import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HomePage from '@/components/HomePage';
import ListingsPage from '@/components/ListingsPage';
import UserPages from '@/components/UserPages';

type Service = 'Секс Выезд' | 'Секс Апартаменты' | 'Ужин' | 'Вечеринка' | 'Виртуальный секс';
type ListingType = 'Индивидуалка' | 'Агенство';

interface Listing {
  id: number;
  title: string;
  description: string;
  isPremium: boolean;
  services?: Service[];
  type?: ListingType;
  price?: string;
  images?: string[];
  author: string;
  createdAt: string;
}

const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Элитная встреча в центре города',
    description: 'Высокий уровень сервиса, конфиденциальность гарантирована',
    isPremium: true,
    services: ['Секс Апартаменты', 'Ужин'],
    type: 'Индивидуалка',
    price: '15000 ₽/час',
    author: 'user_8347',
    createdAt: '2 часа назад'
  },
  {
    id: 2,
    title: 'Ищу компанию на вечер',
    description: 'Приятное общение, анонимность',
    isPremium: false,
    author: 'user_2891',
    createdAt: '5 часов назад'
  },
  {
    id: 3,
    title: 'Премиум эскорт-услуги',
    description: 'VIP сопровождение на мероприятия, деловые встречи',
    isPremium: true,
    services: ['Ужин', 'Вечеринка'],
    type: 'Агенство',
    price: '25000 ₽',
    author: 'agency_elite',
    createdAt: '1 день назад'
  }
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState<'home' | 'listings' | 'my-listings' | 'messages' | 'profile' | 'wallet' | 'support' | 'settings'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ login: string; password: string } | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const generateCredentials = () => {
    const login = `anon_${Math.random().toString(36).substr(2, 8)}`;
    const password = Math.random().toString(36).substr(2, 12);
    setGeneratedCredentials({ login, password });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setGeneratedCredentials(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      return <HomePage isAuthenticated={isAuthenticated} generatedCredentials={generatedCredentials} onLogin={generateCredentials} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage isAuthenticated={isAuthenticated} generatedCredentials={generatedCredentials} onLogin={generateCredentials} />;
      case 'listings':
        return <ListingsPage listings={mockListings} />;
      case 'my-listings':
      case 'messages':
      case 'profile':
      case 'wallet':
      case 'support':
      case 'settings':
        return <UserPages page={currentPage} generatedCredentials={generatedCredentials} twoFactorEnabled={twoFactorEnabled} setTwoFactorEnabled={setTwoFactorEnabled} />;
      default:
        return <HomePage isAuthenticated={isAuthenticated} generatedCredentials={generatedCredentials} onLogin={generateCredentials} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        isAuthenticated={isAuthenticated} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onLogin={generateCredentials} 
        onLogout={handleLogout} 
      />
      {renderPage()}
    </div>
  );
}
