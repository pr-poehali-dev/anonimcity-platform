const MEDIA_UPLOAD_API = 'https://functions.poehali.dev/5d53defa-8b10-44a4-bcb6-c17b5341b20e';

interface PresignedUrlResponse {
  upload_url: string;
  file_key: string;
  cdn_url: string;
  expires_in: number;
}

export async function getPresignedUrl(filename: string, contentType: string): Promise<PresignedUrlResponse> {
  const response = await fetch(MEDIA_UPLOAD_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename,
      content_type: contentType,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get presigned URL');
  }

  return await response.json();
}

export async function uploadFileToS3(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const presignedData = await getPresignedUrl(file.name, file.type);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(presignedData.cdn_url);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('PUT', presignedData.upload_url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
