import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminProps {
  generatedCredentials: { login: string; password: string } | null;
}

export default function Admin({ generatedCredentials }: AdminProps) {
  const [stats] = useState({
    totalUsers: 1247,
    activeListings: 342,
    totalRevenue: 125430,
    pendingModeration: 18,
    totalMessages: 5623,
    totalFiles: 892,
    reportedContent: 7,
  });

  const [recentUsers] = useState([
    { id: 1, login: 'anon_x7k2p9', registered: '2024-01-10 14:23', status: 'active' },
    { id: 2, login: 'anon_m3n8q1', registered: '2024-01-10 13:45', status: 'active' },
    { id: 3, login: 'anon_p9k2m7', registered: '2024-01-10 12:10', status: 'blocked' },
    { id: 4, login: 'anon_q2l8n3', registered: '2024-01-10 11:30', status: 'active' },
  ]);

  const [pendingListings] = useState([
    { id: 1, title: 'Премиум эскорт услуги', author: 'anon_x7k2p9', created: '2024-01-10 14:00', type: 'premium' },
    { id: 2, title: 'Виртуальное общение', author: 'anon_m3n8q1', created: '2024-01-10 13:30', type: 'regular' },
    { id: 3, title: 'Выезд по городу', author: 'anon_q2l8n3', created: '2024-01-10 12:45', type: 'premium' },
  ]);

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Shield" size={32} className="text-primary" />
            <h1 className="text-3xl font-bold">Админ-панель</h1>
          </div>
          <p className="text-muted-foreground">Управление платформой и модерация контента</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Users" size={16} />
                Всего пользователей
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">+42 за последний месяц</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="FileText" size={16} />
                Активные объявления
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground mt-1">+15 за последний месяц</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Wallet" size={16} />
                Общий доход
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">+23% за последний месяц</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                Ожидают модерации
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.pendingModeration}</div>
              <p className="text-xs text-muted-foreground mt-1">Требуют внимания</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="moderation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="moderation" className="gap-2">
              <Icon name="Shield" size={16} />
              <span className="hidden sm:inline">Модерация</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Icon name="Users" size={16} />
              <span className="hidden sm:inline">Пользователи</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <Icon name="Flag" size={16} />
              <span className="hidden sm:inline">Жалобы</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Icon name="Settings" size={16} />
              <span className="hidden sm:inline">Настройки</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Объявления на модерации</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{listing.title}</h3>
                          {listing.type === 'premium' && (
                            <Badge variant="default" className="gap-1">
                              <Icon name="Crown" size={12} />
                              Премиум
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Автор: {listing.author} • {listing.created}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" className="gap-2">
                          <Icon name="Check" size={14} />
                          Одобрить
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-2">
                          <Icon name="X" size={14} />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Последние регистрации</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Icon name="User" size={24} className="text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{user.login}</h3>
                          <p className="text-sm text-muted-foreground">{user.registered}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Icon name="MoreVertical" size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Жалобы пользователей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="Flag" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Нет активных жалоб</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки платформы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Автоматическая модерация</h3>
                      <p className="text-sm text-muted-foreground">Использовать AI для предварительной проверки</p>
                    </div>
                    <Button variant="outline">Настроить</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Ценообразование</h3>
                      <p className="text-sm text-muted-foreground">Управление тарифами и комиссиями</p>
                    </div>
                    <Button variant="outline">Настроить</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Уведомления</h3>
                      <p className="text-sm text-muted-foreground">Настройка системных уведомлений</p>
                    </div>
                    <Button variant="outline">Настроить</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
