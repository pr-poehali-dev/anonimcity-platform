import HomePage from '@/components/HomePage';

interface HomeProps {
  isAuthenticated: boolean;
  generatedCredentials: { login: string; password: string } | null;
  onLogin: () => void;
}

export default function Home({ isAuthenticated, generatedCredentials, onLogin }: HomeProps) {
  return <HomePage isAuthenticated={isAuthenticated} generatedCredentials={generatedCredentials} onLogin={onLogin} />;
}
