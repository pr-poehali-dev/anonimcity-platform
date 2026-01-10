import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import type { Model } from '@/components/admin/tabs/AdminContentTabs';

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

export default function AdminModelProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('listings');

  // Mock данные модели (в реальном приложении получаем из props или context)
  const model: Model = {
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
  };

  // Mock объявления модели
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/admin')} className="gap-2">
            <Icon name="ArrowLeft" size={16} />
            Назад в админку
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl flex-shrink-0">
                {model.avatar}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{model.name}</h1>
                  {model.verified && (
                    <Badge variant="default" className="gap-1">
                      <Icon name="CheckCircle" size={12} />
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline">{model.login}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="MapPin" size={16} />
                    <span>{model.city || 'Не указан'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Calendar" size={16} />
                    <span>{model.age ? `${model.age} лет` : 'Не указан'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="FileText" size={16} />
                    <span>{model.listingsCount} объявлений</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="DollarSign" size={16} />
                    <span>{model.totalRevenue.toLocaleString()} ₽</span>
                  </div>
                </div>

                {model.bio && (
                  <p className="text-muted-foreground mt-4">{model.bio}</p>
                )}

                {/* Contacts */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {model.phone && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Icon name="Phone" size={14} />
                      {model.phone}
                    </Button>
                  )}
                  {model.telegram && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Icon name="Send" size={14} />
                      {model.telegram}
                    </Button>
                  )}
                  {model.whatsapp && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Icon name="MessageCircle" size={14} />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
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

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Объявления модели ({listings.length})</CardTitle>
                <Button onClick={handleCreateListing} className="gap-2">
                  <Icon name="Plus" size={16} />
                  Создать объявление
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <div key={listing.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{listing.title}</h3>
                            {listing.isPremium && (
                              <Badge variant="default" className="gap-1">
                                <Icon name="Star" size={10} />
                                Premium
                              </Badge>
                            )}
                            {getStatusBadge(listing.status)}
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                            <span>{listing.category}</span>
                            <span>{listing.price}</span>
                            <span>Создано: {listing.createdAt}</span>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="Eye" size={12} />
                              {listing.views} просмотров
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="MessageSquare" size={12} />
                              {listing.inquiries} запросов
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(listing.id)}
                            title={listing.status === 'active' ? 'Деактивировать' : 'Активировать'}
                          >
                            <Icon name={listing.status === 'active' ? 'EyeOff' : 'Eye'} size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePremium(listing.id)}
                            title={listing.isPremium ? 'Убрать премиум' : 'Сделать премиум'}
                          >
                            <Icon name="Star" size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditListing(listing.id)}
                          >
                            <Icon name="Edit" size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteListing(listing.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Общая выручка</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{model.totalRevenue.toLocaleString()} ₽</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Всего просмотров</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{listings.reduce((sum, l) => sum + l.views, 0)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Запросов получено</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{listings.reduce((sum, l) => sum + l.inquiries, 0)}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки профиля</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Редактирование профиля модели находится в разработке
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
