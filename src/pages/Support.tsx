import UserPages from '@/components/UserPages';

interface SupportProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function Support({ generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: SupportProps) {
  return (
    <UserPages 
      page="support" 
      generatedCredentials={generatedCredentials} 
      twoFactorEnabled={twoFactorEnabled} 
      setTwoFactorEnabled={setTwoFactorEnabled} 
    />
  );
}
