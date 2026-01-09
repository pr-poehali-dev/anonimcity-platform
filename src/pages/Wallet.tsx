import UserPages from '@/components/UserPages';

interface WalletProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function Wallet({ generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: WalletProps) {
  return (
    <UserPages 
      page="wallet" 
      generatedCredentials={generatedCredentials} 
      twoFactorEnabled={twoFactorEnabled} 
      setTwoFactorEnabled={setTwoFactorEnabled} 
    />
  );
}
