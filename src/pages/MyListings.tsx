import UserPages from '@/components/UserPages';

interface MyListingsProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function MyListings({ generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: MyListingsProps) {
  return (
    <UserPages 
      page="my-listings" 
      generatedCredentials={generatedCredentials} 
      twoFactorEnabled={twoFactorEnabled} 
      setTwoFactorEnabled={setTwoFactorEnabled} 
    />
  );
}
