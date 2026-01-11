import { useState, useEffect } from 'react';
import ListingsPage from '@/components/ListingsPage';
import { getListings } from '@/lib/api';

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

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await getListings();
      setListings(data || []);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-24 md:pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <ListingsPage listings={listings} />;
}