import VirtPage from '@/components/user-pages/VirtPage';

interface VirtProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function Virt({ generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: VirtProps) {
  return <VirtPage generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} />;
}
