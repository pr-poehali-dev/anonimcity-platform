import UserPages from '@/components/UserPages';

interface FilesProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function Files({ generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: FilesProps) {
  return (
    <UserPages 
      page="files" 
      generatedCredentials={generatedCredentials} 
      twoFactorEnabled={twoFactorEnabled} 
      setTwoFactorEnabled={setTwoFactorEnabled} 
    />
  );
}
