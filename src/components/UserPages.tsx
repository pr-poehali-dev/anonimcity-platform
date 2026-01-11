import MyListingsPage from './user-pages/MyListingsPage';
import MessagesPage from './user-pages/MessagesPage';
import MarketplacePage from './user-pages/MarketplacePage';
import ProfileWalletPages from './user-pages/ProfileWalletPages';

interface UserPagesProps {
  page: 'my-listings' | 'messages' | 'files' | 'profile' | 'wallet' | 'support' | 'settings';
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function UserPages({ page, generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: UserPagesProps) {
  if (page === 'my-listings') {
    return <MyListingsPage generatedCredentials={generatedCredentials} />;
  }

  if (page === 'messages') {
    return <MessagesPage generatedCredentials={generatedCredentials} />;
  }

  if (page === 'files') {
    return <MarketplacePage generatedCredentials={generatedCredentials} />;
  }

  if (page === 'profile' || page === 'wallet' || page === 'support' || page === 'settings') {
    return (
      <ProfileWalletPages 
        page={page}
        generatedCredentials={generatedCredentials}
        twoFactorEnabled={twoFactorEnabled}
        setTwoFactorEnabled={setTwoFactorEnabled}
      />
    );
  }

  return null;
}