import UserPages from '@/components/UserPages';

interface MessagesProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function Messages({ generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: MessagesProps) {
  return (
    <UserPages 
      page="messages" 
      generatedCredentials={generatedCredentials} 
      twoFactorEnabled={twoFactorEnabled} 
      setTwoFactorEnabled={setTwoFactorEnabled} 
    />
  );
}
