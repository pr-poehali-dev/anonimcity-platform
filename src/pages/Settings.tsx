import UserPages from '@/components/UserPages';

interface SettingsProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function Settings({ generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: SettingsProps) {
  return (
    <UserPages 
      page="settings" 
      generatedCredentials={generatedCredentials} 
      twoFactorEnabled={twoFactorEnabled} 
      setTwoFactorEnabled={setTwoFactorEnabled} 
    />
  );
}
