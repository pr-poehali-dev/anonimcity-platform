import HomePage from '@/components/HomePage';

interface HomeProps {
  isAuthenticated: boolean;
  generatedCredentials: { login: string; password: string } | null;
  onLogin: () => void;
  credentialsSaved: boolean;
  onCredentialsSaved: () => void;
}

export default function Home({ isAuthenticated, generatedCredentials, onLogin, credentialsSaved, onCredentialsSaved }: HomeProps) {
  return <HomePage isAuthenticated={isAuthenticated} generatedCredentials={generatedCredentials} onLogin={onLogin} credentialsSaved={credentialsSaved} onCredentialsSaved={onCredentialsSaved} />;
}