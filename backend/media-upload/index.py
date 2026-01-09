import json
import os
import boto3
from datetime import datetime, timedelta

s3_client = boto3.client('s3',
    endpoint_url='https://bucket.poehali.dev',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)

def handler(event: dict, context) -> dict:
    '''API для получения presigned URLs для загрузки медиа-файлов в S3'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    if method == 'POST':
        try:
            raw_body = event.get('body', '{}')
            if not raw_body or raw_body == '{}':
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Filename is required'})
                }
            
            body = json.loads(raw_body)
            filename = body.get('filename')
            content_type = body.get('content_type', 'application/octet-stream')

            if not filename:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Filename is required'})
                }

            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            file_key = f'media/{timestamp}_{filename}'

            presigned_url = s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': 'files',
                    'Key': file_key,
                    'ContentType': content_type
                },
                ExpiresIn=3600
            )

            cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'upload_url': presigned_url,
                    'file_key': file_key,
                    'cdn_url': cdn_url,
                    'expires_in': 3600
                })
            }

        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }

    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }