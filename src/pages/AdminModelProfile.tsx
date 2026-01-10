import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import type { Model } from '@/components/admin/tabs/AdminContentTabs';
import ModelProfileHeader from '@/components/modelProfile/ModelProfileHeader';
import ModelProfileListings from '@/components/modelProfile/ModelProfileListings';
import ModelProfileStats from '@/components/modelProfile/ModelProfileStats';
import ModelProfileSettings from '@/components/modelProfile/ModelProfileSettings';

interface Listing {
  id: number;
  title: string;
  price: string;
  category: string;
  status: 'active' | 'pending' | 'inactive';
  isPremium: boolean;
  createdAt: string;
  views: number;
  inquiries: number;
}

const avatarOptions = ['👩', '👱‍♀️', '👧', '👩‍🦰', '👩‍🦱', '👩‍🦳', '🧕', '👸', '💃', '🙋‍♀️'];
const cityOptions = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону'];

export default function AdminModelProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('listings');
  const [isEditing, setIsEditing] = useState(false);

  const [model, setModel] = useState<Model>({
    id: Number(id),
    name: 'Анна М.',
    login: 'anon_x7k2p9',
    status: 'verified',
    listingsCount: 12,
    totalRevenue: 145000,
    avatar: '👩',
    verified: true,
    age: 24,
    city: 'Москва',
    bio: 'Профессиональная модель с опытом работы более 3 лет. Специализация: фотосессии, видеосъемка, эскорт услуги премиум класса.',
    phone: '+7 (900) 123-45-67',
    telegram: '@anna_model',
    whatsapp: '+79001234567',
  });

  const [editForm, setEditForm] = useState(model);

  const [listings, setListings] = useState<Listing[]>([
    { id: 1, title: 'Профессиональная фотосессия', price: '15000 ₽/час', category: 'Фотосессии', status: 'active', isPremium: true, createdAt: '2024-01-15', views: 234, inquiries: 12 },
    { id: 2, title: 'Эскорт на мероприятие', price: '25000 ₽/вечер', category: 'Эскорт', status: 'active', isPremium: true, createdAt: '2024-01-14', views: 189, inquiries: 8 },
    { id: 3, title: 'Видеосъемка для рекламы', price: '20000 ₽/час', category: 'Видео', status: 'active', isPremium: false, createdAt: '2024-01-13', views: 156, inquiries: 5 },
  ]);

  const handleCreateListing = () => {
    toast({
      title: "Создание объявления",
      description: "Функция создания объявления от имени модели находится в разработке",
    });
  };

  const handleEditListing = (listingId: number) => {
    toast({
      title: "Редактирование",
      description: `Редактирование объявления #${listingId}`,
    });
  };

  const handleDeleteListing = (listingId: number) => {
    if (confirm('Удалить это объявление?')) {
      setListings(listings.filter(l => l.id !== listingId));
      toast({
        title: "Объявление удалено",
        description: "Объявление успешно удалено",
      });
    }
  };

  const handleToggleStatus = (listingId: number) => {
    setListings(listings.map(l => 
      l.id === listingId 
        ? { ...l, status: l.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
        : l
    ));
    toast({
      title: "Статус изменен",
      description: "Статус объявления обновлен",
    });
  };

  const handleTogglePremium = (listingId: number) => {
    setListings(listings.map(l => 
      l.id === listingId 
        ? { ...l, isPremium: !l.isPremium }
        : l
    ));
    toast({
      title: "Премиум статус изменен",
      description: "Статус премиум объявления обновлен",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      active: { variant: 'default', label: 'Активно' },
      pending: { variant: 'secondary', label: 'На модерации' },
      inactive: { variant: 'destructive', label: 'Неактивно' },
    };
    const { variant, label } = variants[status] || variants.active;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const handleSaveProfile = () => {
    setModel(editForm);
    setIsEditing(false);
    toast({
      title: "Профиль обновлен",
      description: "Изменения успешно сохранены",
    });
  };

  const handleCancelEdit = () => {
    setEditForm(model);
    setIsEditing(false);
  };

  const handleFormChange = (field: keyof Model, value: string | number | boolean | undefined) => {
    setEditForm({ ...editForm, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/admin')} className="gap-2">
            <Icon name="ArrowLeft" size={16} />
            Назад в админку
          </Button>
        </div>

        <ModelProfileHeader model={model} />

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings" className="gap-2">
              <Icon name="FileText" size={16} />
              Объявления
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <Icon name="BarChart" size={16} />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Icon name="Settings" size={16} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <ModelProfileListings
            listings={listings}
            onCreateListing={handleCreateListing}
            onEditListing={handleEditListing}
            onDeleteListing={handleDeleteListing}
            onToggleStatus={handleToggleStatus}
            onTogglePremium={handleTogglePremium}
            getStatusBadge={getStatusBadge}
          />

          <ModelProfileStats
            totalRevenue={model.totalRevenue}
            listings={listings}
          />

          <ModelProfileSettings
            model={model}
            isEditing={isEditing}
            editForm={editForm}
            avatarOptions={avatarOptions}
            cityOptions={cityOptions}
            onEditClick={() => setIsEditing(true)}
            onFormChange={handleFormChange}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        </Tabs>
      </div>
    </div>
  );
}
