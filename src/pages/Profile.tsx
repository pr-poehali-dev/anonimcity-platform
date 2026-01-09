import UserPages from '@/components/UserPages';

interface ProfileProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function Profile({ generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: ProfileProps) {
  return (
    <UserPages 
      page="profile" 
      generatedCredentials={generatedCredentials} 
      twoFactorEnabled={twoFactorEnabled} 
      setTwoFactorEnabled={setTwoFactorEnabled} 
    />
  );
}
