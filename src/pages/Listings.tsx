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

export default function Listings() {
  return <ListingsPage listings={mockListings} />;
}
