import ListingsPage from '@/components/ListingsPage';

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
  audioGreeting?: string;
  author: string;
  createdAt: string;
  city?: string;
  age?: number;
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
    images: ['https://placehold.co/400x300/6366f1/ffffff?text=Photo+1', 'https://placehold.co/400x300/8b5cf6/ffffff?text=Photo+2'],
    audioGreeting: 'audio_greeting_1.mp3',
    author: 'user_8347',
    createdAt: '2 часа назад',
    city: 'Москва',
    age: 24
  },
  {
    id: 2,
    title: 'Ищу компанию на вечер',
    description: 'Приятное общение, анонимность',
    isPremium: false,
    author: 'user_2891',
    createdAt: '5 часов назад',
    city: 'Санкт-Петербург',
    age: 28
  },
  {
    id: 3,
    title: 'Премиум эскорт-услуги',
    description: 'VIP сопровождение на мероприятия, деловые встречи',
    isPremium: true,
    services: ['Ужин', 'Вечеринка'],
    type: 'Агенство',
    price: '25000 ₽',
    images: ['https://placehold.co/400x300/ec4899/ffffff?text=Photo+1', 'https://placehold.co/400x300/f43f5e/ffffff?text=Photo+2', 'https://placehold.co/400x300/ef4444/ffffff?text=Photo+3'],
    audioGreeting: 'audio_greeting_2.mp3',
    author: 'agency_elite',
    createdAt: '1 день назад',
    city: 'Москва',
    age: 22
  },
  {
    id: 4,
    title: 'Приятное знакомство',
    description: 'Ищу интересное общение',
    isPremium: false,
    author: 'user_5421',
    createdAt: '3 часа назад',
    city: 'Екатеринбург',
    age: 26
  }
];

export default function Listings() {
  return <ListingsPage listings={mockListings} />;
}