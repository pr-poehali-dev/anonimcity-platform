import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  onAdminLogout: () => void;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  listingsCount: number;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  author: string;
  created: string;
  type: 'premium' | 'regular';
  category: string;
  price: number;
  status: 'pending' | 'active' | 'rejected';
}

export default function AdminDashboard({ onAdminLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats] = useState({
    totalUsers: 1247,
    activeListings: 342,
    totalRevenue: 125430,
    pendingModeration: 18,
    totalMessages: 5623,
    reportedContent: 7,
  });

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Эскорт услуги', description: 'Сопровождение на мероприятия', icon: 'Users', listingsCount: 142 },
    { id: 2, name: 'Виртуальное общение', description: 'Онлайн знакомства и общение', icon: 'MessageCircle', listingsCount: 89 },
    { id: 3, name: 'Массаж', description: 'Профессиональный массаж', icon: 'Heart', listingsCount: 56 },
    { id: 4, name: 'Фото/Видео услуги', description: 'Индивидуальный контент', icon: 'Camera', listingsCount: 55 },
  ]);

  const [listings, setListings] = useState<Listing[]>([
    { id: 1, title: 'Премиум эскорт услуги', description: 'VIP сопровождение', author: 'anon_x7k2p9', created: '2024-01-10 14:00', type: 'premium', category: 'Эскорт услуги', price: 15000, status: 'pending' },
    { id: 2, title: 'Виртуальное общение', description: 'Приятное общение онлайн', author: 'anon_m3n8q1', created: '2024-01-10 13:30', type: 'regular', category: 'Виртуальное общение', price: 1500, status: 'active' },
    { id: 3, title: 'Выезд по городу', description: 'Сопровождение по Москве', author: 'anon_q2l8n3', created: '2024-01-10 12:45', type: 'premium', category: 'Эскорт услуги', price: 20000, status: 'pending' },
    { id: 4, title: 'Расслабляющий массаж', description: 'Профессиональный массаж', author: 'anon_k3m7n2', created: '2024-01-10 11:20', type: 'regular', category: 'Массаж', price: 5000, status: 'active' },
  ]);

  const [recentUsers] = useState([
    { id: 1, login: 'anon_x7k2p9', registered: '2024-01-10 14:23', status: 'active' },
    { id: 2, login: 'anon_m3n8q1', registered: '2024-01-10 13:45', status: 'active' },
    { id: 3, login: 'anon_p9k2m7', registered: '2024-01-10 12:10', status: 'blocked' },
    { id: 4, login: 'anon_q2l8n3', registered: '2024-01-10 11:30', status: 'active' },
  ]);

  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: 'Tag' });

  const [listingDialog, setListingDialog] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingListing, setViewingListing] = useState<Listing | null>(null);
  const [selectedTab, setSelectedTab] = useState('moderation');

  const handleLogout = () => {
    onAdminLogout();
    navigate('/admin/login');
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из панели администратора",
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({ title: "Ошибка", description: "Введите название категории", variant: "destructive" });
      return;
    }

    const category: Category = {
      id: Date.now(),
      name: newCategory.name,
      description: newCategory.description,
      icon: newCategory.icon,
      listingsCount: 0,
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '', icon: 'Tag' });
    setCategoryDialog(false);
    toast({ title: "Категория добавлена", description: `"${category.name}" успешно создана` });
  };

  const handleEditCategory = () => {
    if (!editingCategory || !newCategory.name) return;

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, name: newCategory.name, description: newCategory.description, icon: newCategory.icon }
        : cat
    ));
    
    setEditingCategory(null);
    setNewCategory({ name: '', description: '', icon: 'Tag' });
    setCategoryDialog(false);
    toast({ title: "Категория обновлена", description: "Изменения сохранены" });
  };

  const handleDeleteCategory = (id: number) => {
    const category = categories.find(c => c.id === id);
    setCategories(categories.filter(cat => cat.id !== id));
    toast({ title: "Категория удалена", description: `"${category?.name}" была удалена` });
  };

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setNewCategory({ name: category.name, description: category.description, icon: category.icon });
    } else {
      setEditingCategory(null);
      setNewCategory({ name: '', description: '', icon: 'Tag' });
    }
    setCategoryDialog(true);
  };

  const handleApprove = (id: number) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: 'active' as const } : l));
    toast({ title: "Объявление одобрено", description: "Объявление опубликовано на платформе" });
  };

  const handleReject = (id: number) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: 'rejected' as const } : l));
    toast({ title: "Объявление отклонено", description: "Автору отправлено уведомление", variant: "destructive" });
  };

  const handleDeleteListing = (id: number) => {
    const listing = listings.find(l => l.id === id);
    setListings(listings.filter(l => l.id !== id));
    toast({ title: "Объявление удалено", description: `"${listing?.title}" было удалено` });
  };

  const openEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setListingDialog(true);
  };

  const openViewListing = (listing: Listing) => {
    setViewingListing(listing);
    setViewDialog(true);
  };

  const handleSaveListing = () => {
    if (!editingListing) return;

    setListings(listings.map(l => l.id === editingListing.id ? editingListing : l));
    setListingDialog(false);
    setEditingListing(null);
    toast({ title: "Объявление обновлено", description: "Изменения сохранены" });
  };

  const pendingListings = listings.filter(l => l.status === 'pending');
  const activeListings = listings.filter(l => l.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-background" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Админ-панель</h1>
                <p className="text-xs text-muted-foreground">Anonimcity Management</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <Icon name="LogOut" size={16} />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
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
                На модерации
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{pendingListings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Требуют внимания</p>
            </CardContent>
          </Card>
        </div>

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
      </div>

      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Измените параметры категории' : 'Создайте новую категорию услуг'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Название категории</Label>
              <Input
                id="name"
                placeholder="Эскорт услуги"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                placeholder="Краткое описание категории"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="icon">Иконка (Lucide название)</Label>
              <Input
                id="icon"
                placeholder="Users, Heart, Camera..."
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialog(false)}>
              Отмена
            </Button>
            <Button onClick={editingCategory ? handleEditCategory : handleAddCategory}>
              {editingCategory ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={listingDialog} onOpenChange={setListingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать объявление</DialogTitle>
            <DialogDescription>
              Внесите изменения в объявление
            </DialogDescription>
          </DialogHeader>
          {editingListing && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={editingListing.title}
                  onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={editingListing.description}
                  onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Цена (₽)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingListing.price}
                    onChange={(e) => setEditingListing({ ...editingListing, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Input
                    id="category"
                    value={editingListing.category}
                    onChange={(e) => setEditingListing({ ...editingListing, category: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setListingDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveListing}>
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Просмотр объявления</DialogTitle>
          </DialogHeader>
          {viewingListing && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <h2 className="text-xl font-bold">{viewingListing.title}</h2>
                    {viewingListing.type === 'premium' && (
                      <Badge variant="default" className="gap-1">
                        <Icon name="Crown" size={14} />
                        Премиум
                      </Badge>
                    )}
                    <Badge 
                      variant={
                        viewingListing.status === 'active' ? 'default' : 
                        viewingListing.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {viewingListing.status === 'active' ? 'Активно' : 
                       viewingListing.status === 'pending' ? 'На модерации' : 
                       'Отклонено'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Категория</p>
                        <div className="flex items-center gap-2">
                          <Icon name="Tag" size={16} className="text-primary" />
                          <p className="font-medium">{viewingListing.category}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Цена</p>
                        <div className="flex items-center gap-2">
                          <Icon name="Wallet" size={16} className="text-primary" />
                          <p className="font-medium text-xl">{viewingListing.price.toLocaleString()} ₽</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Автор</p>
                        <div className="flex items-center gap-2">
                          <Icon name="User" size={16} className="text-primary" />
                          <p className="font-medium">{viewingListing.author}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Дата создания</p>
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} className="text-primary" />
                          <p className="font-medium">{viewingListing.created}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Описание</p>
                    <p className="text-base leading-relaxed">{viewingListing.description}</p>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <p className="text-sm text-muted-foreground mb-3">Дополнительная информация</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={16} className="text-muted-foreground" />
                        <span>Москва, Россия</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={16} className="text-muted-foreground" />
                        <span>Доступно 24/7</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Shield" size={16} className="text-muted-foreground" />
                        <span>Проверенный профиль</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Star" size={16} className="text-muted-foreground" />
                        <span>Рейтинг: 4.8/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {viewingListing.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 gap-2"
                    onClick={() => {
                      handleApprove(viewingListing.id);
                      setViewDialog(false);
                    }}
                  >
                    <Icon name="Check" size={16} />
                    Одобрить объявление
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => {
                      handleReject(viewingListing.id);
                      setViewDialog(false);
                    }}
                  >
                    <Icon name="X" size={16} />
                    Отклонить
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialog(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}