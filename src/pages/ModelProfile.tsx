import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

export default function ModelProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [model] = useState({
    id: Number(id) || 1,
    name: 'Анна М.',
    login: 'anon_x7k2p9',
    email: 'model_x7k2p9@anonimcity.com',
    phone: '+7 (900) 123-45-67',
    status: 'verified',
    rating: 4.9,
    totalListings: 12,
    activeListings: 10,
    totalRevenue: 145000,
    monthRevenue: 45000,
    totalViews: 2847,
    totalMessages: 156,
    responseRate: 95,
    averageResponseTime: '15 мин',
    registered: '2024-01-15 14:23',
    lastActive: '2024-01-10 18:45',
    verifiedDate: '2024-01-16 10:30',
    photo: '👩',
    categories: ['Эскорт услуги', 'Виртуальное общение'],
    city: 'Москва',
    age: 24,
    languages: ['Русский', 'Английский'],
  });

  const [stats] = useState({
    thisMonth: { views: 856, messages: 42, revenue: 45000, bookings: 12 },
    lastMonth: { views: 723, messages: 38, revenue: 38000, bookings: 10 },
    growth: { views: 18, messages: 10, revenue: 18, bookings: 20 },
  });

  const [listings] = useState([
    { id: 1, title: 'Премиум эскорт услуги', category: 'Эскорт услуги', price: 15000, status: 'active', views: 456, messages: 23, created: '2024-01-05' },
    { id: 2, title: 'VIP сопровождение', category: 'Эскорт услуги', price: 20000, status: 'active', views: 389, messages: 18, created: '2024-01-08' },
    { id: 3, title: 'Виртуальное общение', category: 'Виртуальное общение', price: 1500, status: 'active', views: 267, messages: 15, created: '2024-01-09' },
    { id: 4, title: 'Выезд по городу', category: 'Эскорт услуги', price: 18000, status: 'paused', views: 123, messages: 8, created: '2024-01-07' },
  ]);

  const [reviews] = useState([
    { id: 1, author: 'anon_client_1', rating: 5, text: 'Отличный сервис, очень профессиональный подход!', date: '2024-01-09 16:30' },
    { id: 2, author: 'anon_client_2', rating: 5, text: 'Рекомендую! Все на высшем уровне.', date: '2024-01-08 14:20' },
    { id: 3, author: 'anon_client_3', rating: 4, text: 'Хорошо, но можно было бы быстрее отвечать.', date: '2024-01-07 11:15' },
  ]);

  const [transactions] = useState([
    { id: 1, type: 'payment', amount: 15000, description: 'Оплата услуги "Премиум эскорт"', date: '2024-01-10 18:30', status: 'completed' },
    { id: 2, type: 'payment', amount: 20000, description: 'Оплата услуги "VIP сопровождение"', date: '2024-01-09 15:20', status: 'completed' },
    { id: 3, type: 'withdrawal', amount: -10000, description: 'Вывод средств на карту', date: '2024-01-08 10:00', status: 'completed' },
    { id: 4, type: 'payment', amount: 1500, description: 'Оплата услуги "Виртуальное общение"', date: '2024-01-07 20:15', status: 'completed' },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')} className="gap-2">
                <Icon name="ArrowLeft" size={16} />
                Назад
              </Button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl">
                {model.photo}
              </div>
              <div>
                <h1 className="text-xl font-bold">{model.name}</h1>
                <p className="text-xs text-muted-foreground">{model.login}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Icon name="MessageCircle" size={16} />
                Написать
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Icon name="Ban" size={16} />
                Заблокировать
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{model.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Телефон</p>
                    <p className="font-medium">{model.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Город</p>
                    <p className="font-medium">{model.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Возраст</p>
                    <p className="font-medium">{model.age} лет</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Статус</p>
                    <Badge variant="default" className="gap-1">
                      <Icon name="CheckCircle" size={12} />
                      Верифицирована
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Рейтинг</p>
                    <p className="font-medium">{model.rating}/5 ⭐</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Языки</p>
                    <p className="font-medium">{model.languages.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Категории</p>
                    <div className="flex gap-2 flex-wrap">
                      {model.categories.map((cat, i) => (
                        <Badge key={i} variant="outline">{cat}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Регистрация</p>
                  <p className="text-sm font-medium">{model.registered}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Верификация</p>
                  <p className="text-sm font-medium">{model.verifiedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Последняя активность</p>
                  <p className="text-sm font-medium">{model.lastActive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Быстрая статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Eye" size={20} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Просмотры</p>
                    <p className="text-xl font-bold">{model.totalViews}</p>
                  </div>
                </div>
                <Badge variant="secondary">+{stats.growth.views}%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="MessageCircle" size={20} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Сообщений</p>
                    <p className="text-xl font-bold">{model.totalMessages}</p>
                  </div>
                </div>
                <Badge variant="secondary">+{stats.growth.messages}%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Wallet" size={20} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Доход</p>
                    <p className="text-xl font-bold">{model.totalRevenue.toLocaleString()} ₽</p>
                  </div>
                </div>
                <Badge variant="secondary">+{stats.growth.revenue}%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Clock" size={20} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ответ</p>
                    <p className="text-xl font-bold">{model.averageResponseTime}</p>
                  </div>
                </div>
                <Badge variant="default">{model.responseRate}%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Просмотры за месяц</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.thisMonth.views}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.lastMonth.views} в прошлом месяце
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Сообщения за месяц</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.thisMonth.messages}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.lastMonth.messages} в прошлом месяце
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Доход за месяц</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.thisMonth.revenue.toLocaleString()} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.lastMonth.revenue.toLocaleString()} ₽ в прошлом месяце
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Бронирований</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.thisMonth.bookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.lastMonth.bookings} в прошлом месяце
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings" className="gap-2">
              <Icon name="FileText" size={16} />
              Объявления ({listings.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Icon name="Star" size={16} />
              Отзывы ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <Icon name="CreditCard" size={16} />
              Транзакции ({transactions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Все объявления</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <div key={listing.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold">{listing.title}</h3>
                          <Badge variant="outline">{listing.category}</Badge>
                          <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                            {listing.status === 'active' ? 'Активно' : 'На паузе'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {listing.price.toLocaleString()} ₽ • {listing.views} просмотров • {listing.messages} сообщений
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Создано: {listing.created}</p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Icon name="Eye" size={14} />
                        Просмотр
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Отзывы клиентов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon name="User" size={20} className="text-muted-foreground" />
                          <span className="font-medium">{review.author}</span>
                          <div className="flex">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <span key={i} className="text-yellow-500">⭐</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>История транзакций</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'payment' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          <Icon 
                            name={transaction.type === 'payment' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                            size={20} 
                            className={transaction.type === 'payment' ? 'text-green-500' : 'text-red-500'}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'payment' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} ₽
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.status === 'completed' ? 'Завершено' : 'В обработке'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
