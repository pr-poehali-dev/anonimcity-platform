import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Category, Listing } from './AdminDialogs';

interface AdminTabsProps {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  pendingListings: Listing[];
  activeListings: Listing[];
  categories: Category[];
  recentUsers: Array<{ id: number; login: string; registered: string; status: string }>;
  openViewListing: (listing: Listing) => void;
  handleApprove: (id: number) => void;
  handleReject: (id: number) => void;
  openEditListing: (listing: Listing) => void;
  handleDeleteListing: (id: number) => void;
  openCategoryDialog: (category?: Category) => void;
  handleDeleteCategory: (id: number) => void;
}

export default function AdminTabs({
  selectedTab,
  setSelectedTab,
  pendingListings,
  activeListings,
  categories,
  recentUsers,
  openViewListing,
  handleApprove,
  handleReject,
  openEditListing,
  handleDeleteListing,
  openCategoryDialog,
  handleDeleteCategory,
}: AdminTabsProps) {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="moderation" className="gap-2">
          <Icon name="Shield" size={16} />
          <span className="hidden sm:inline">Модерация</span>
        </TabsTrigger>
        <TabsTrigger value="listings" className="gap-2">
          <Icon name="FileText" size={16} />
          <span className="hidden sm:inline">Объявления</span>
        </TabsTrigger>
        <TabsTrigger value="categories" className="gap-2">
          <Icon name="Tag" size={16} />
          <span className="hidden sm:inline">Категории</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="gap-2">
          <Icon name="Users" size={16} />
          <span className="hidden sm:inline">Пользователи</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Icon name="Settings" size={16} />
          <span className="hidden sm:inline">Настройки</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="moderation" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Объявления на модерации ({pendingListings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingListings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Все объявления проверены</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingListings.map((listing) => (
                  <div key={listing.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">{listing.title}</h3>
                        {listing.type === 'premium' && (
                          <Badge variant="default" className="gap-1">
                            <Icon name="Crown" size={12} />
                            Премиум
                          </Badge>
                        )}
                        <Badge variant="outline">{listing.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{listing.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Автор: {listing.author} • {listing.created} • {listing.price.toLocaleString()} ₽
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => openViewListing(listing)}
                      >
                        <Icon name="Eye" size={14} />
                        Просмотр
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="gap-2"
                        onClick={() => handleApprove(listing.id)}
                      >
                        <Icon name="Check" size={14} />
                        Одобрить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="gap-2"
                        onClick={() => handleReject(listing.id)}
                      >
                        <Icon name="X" size={14} />
                        Отклонить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="listings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Все объявления ({activeListings.length} активных)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeListings.map((listing) => (
                <div key={listing.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold">{listing.title}</h3>
                      {listing.type === 'premium' && (
                        <Badge variant="default" className="gap-1">
                          <Icon name="Crown" size={12} />
                          Премиум
                        </Badge>
                      )}
                      <Badge variant="outline">{listing.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{listing.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Автор: {listing.author} • {listing.price.toLocaleString()} ₽
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => openViewListing(listing)}
                    >
                      <Icon name="Eye" size={14} />
                      Просмотр
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => openEditListing(listing)}
                    >
                      <Icon name="Edit" size={14} />
                      Редактировать
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="gap-2"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      <Icon name="Trash2" size={14} />
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="categories" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Категории услуг ({categories.length})</CardTitle>
            <Button onClick={() => openCategoryDialog()} className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить категорию
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={category.icon as any} size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{category.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {category.listingsCount} объявлений
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openCategoryDialog(category)}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Icon name="Trash2" size={14} />
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
  );
}
