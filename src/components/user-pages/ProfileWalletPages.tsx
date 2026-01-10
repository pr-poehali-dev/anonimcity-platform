import ProfilePage from './ProfilePage';
import WalletPage from './WalletPage';
import SupportPage from './SupportPage';
import SettingsPage from './SettingsPage';

interface ProfileWalletPagesProps {
  page: 'profile' | 'wallet' | 'support' | 'settings';
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function ProfileWalletPages({ page, generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: ProfileWalletPagesProps) {
  if (page === 'profile') {
    return <ProfilePage generatedCredentials={generatedCredentials} />;
  }

  if (page === 'wallet') {
    return <WalletPage generatedCredentials={generatedCredentials} />;
  }

  if (page === 'support') {
    return <SupportPage generatedCredentials={generatedCredentials} />;
  }

  if (page === 'settings') {
    return (
      <SettingsPage 
        generatedCredentials={generatedCredentials}
        twoFactorEnabled={twoFactorEnabled}
        setTwoFactorEnabled={setTwoFactorEnabled}
      />
    );
  }

  return null;
}