import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

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

  const renderNavigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-background" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Anonimcity
            </span>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {[
                { icon: 'Home', label: 'Главная', page: 'home' },
                { icon: 'Grid', label: 'Объявления', page: 'listings' },
                { icon: 'FileText', label: 'Мои объявления', page: 'my-listings' },
                { icon: 'MessageSquare', label: 'Сообщения', page: 'messages' },
                { icon: 'Wallet', label: 'Кошелек', page: 'wallet' }
              ].map((item) => (
                <Button
                  key={item.page}
                  variant={currentPage === item.page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(item.page as any)}
                  className="gap-2"
                >
                  <Icon name={item.icon as any} size={16} />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage('settings')}>
                  <Icon name="Settings" size={18} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage('support')}>
                  <Icon name="HelpCircle" size={18} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <Icon name="LogOut" size={16} />
                  Выход
                </Button>
              </>
            ) : (
              <Button onClick={generateCredentials} className="gap-2">
                <Icon name="UserPlus" size={16} />
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHomePage = () => (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold">
              Полная <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">анонимность</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Безопасная платформа для размещения и поиска анонимных объявлений с криптовалютными платежами
            </p>
          </div>

          {!isAuthenticated ? (
            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 animate-scale-in">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 text-primary">
                  <Icon name="Shield" size={32} />
                  <Icon name="Lock" size={32} />
                  <Icon name="Eye" size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Вход в один клик</h2>
                  <p className="text-muted-foreground">
                    Мы автоматически создадим для вас логин и пароль. Сохраните их в надежном месте!
                  </p>
                </div>
                <Button onClick={generateCredentials} size="lg" className="w-full gap-2 text-lg py-6">
                  <Icon name="UserPlus" size={20} />
                  Получить доступ
                </Button>
              </div>
            </Card>
          ) : generatedCredentials && (
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-scale-in">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Icon name="CheckCircle" size={24} />
                  <h3 className="text-xl font-bold">Ваши учетные данные</h3>
                </div>
                <div className="space-y-3 bg-background/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Логин:</span>
                    <code className="text-primary font-mono">{generatedCredentials.login}</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Пароль:</span>
                    <code className="text-primary font-mono">{generatedCredentials.password}</code>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-amber-500">
                  <Icon name="AlertTriangle" size={16} className="mt-0.5" />
                  <p>Сохраните эти данные! Восстановление невозможно из-за полной анонимности.</p>
                </div>
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: 'Shield', title: 'Полная анонимность', desc: 'Без email, телефона и личных данных' },
              { icon: 'Bitcoin', title: 'Криптовалюта', desc: 'Безопасные платежи без следов' },
              { icon: 'Lock', title: '2FA защита', desc: 'Двухфакторная аутентификация' }
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-card/30 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name={feature.icon as any} size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderListingsPage = () => (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Input placeholder="Поиск объявлений..." className="flex-1" />
          <Select>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Все услуги" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все услуги</SelectItem>
              <SelectItem value="outcall">Секс Выезд</SelectItem>
              <SelectItem value="apartment">Секс Апартаменты</SelectItem>
              <SelectItem value="dinner">Ужин</SelectItem>
              <SelectItem value="party">Вечеринка</SelectItem>
              <SelectItem value="virtual">Виртуальный секс</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-6">
            <TabsTrigger value="all">Все объявления</TabsTrigger>
            <TabsTrigger value="premium">Премиум</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {mockListings.map((listing) => (
              <Card key={listing.id} className="p-6 hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{listing.title}</h3>
                          {listing.isPremium && (
                            <Badge className="bg-gradient-to-r from-primary to-accent">
                              <Icon name="Crown" size={12} className="mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{listing.description}</p>
                      </div>
                    </div>

                    {listing.isPremium && (
                      <div className="flex flex-wrap gap-2">
                        {listing.services?.map((service) => (
                          <Badge key={service} variant="secondary">{service}</Badge>
                        ))}
                        {listing.type && <Badge variant="outline">{listing.type}</Badge>}
                        {listing.price && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {listing.price}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{listing.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{listing.author}</span>
                        <span>•</span>
                        <span>{listing.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Icon name="MessageCircle" size={16} />
                        Написать
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Отправить сообщение</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea placeholder="Ваше сообщение..." rows={5} />
                        <Button className="w-full">Отправить</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="premium" className="space-y-4">
            {mockListings.filter(l => l.isPremium).map((listing) => (
              <Card key={listing.id} className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30 hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{listing.title}</h3>
                          <Badge className="bg-gradient-to-r from-primary to-accent">
                            <Icon name="Crown" size={12} className="mr-1" />
                            Premium
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{listing.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {listing.services?.map((service) => (
                        <Badge key={service} variant="secondary">{service}</Badge>
                      ))}
                      {listing.type && <Badge variant="outline">{listing.type}</Badge>}
                      {listing.price && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {listing.price}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{listing.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{listing.author}</span>
                        <span>•</span>
                        <span>{listing.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="gap-2">
                    <Icon name="MessageCircle" size={16} />
                    Написать
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-2xl">
              <Icon name="Plus" size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Создать объявление</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs defaultValue="free" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="free">Бесплатное</TabsTrigger>
                  <TabsTrigger value="premium">Платное (Premium)</TabsTrigger>
                </TabsList>

                <TabsContent value="free" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Заголовок</Label>
                    <Input placeholder="Краткое описание" />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea placeholder="Подробное описание..." rows={4} />
                  </div>
                  <Button className="w-full">Опубликовать бесплатно</Button>
                </TabsContent>

                <TabsContent value="premium" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Заголовок</Label>
                    <Input placeholder="Краткое описание" />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea placeholder="Подробное описание..." rows={4} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Тип</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Индивидуалка</SelectItem>
                          <SelectItem value="agency">Агенство</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Стоимость</Label>
                      <Input placeholder="Цена" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Услуги</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Секс Выезд', 'Секс Апартаменты', 'Ужин', 'Вечеринка', 'Виртуальный секс'].map((service) => (
                        <Label key={service} className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-accent/10">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{service}</span>
                        </Label>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full gap-2">
                    <Icon name="Crown" size={16} />
                    Опубликовать Premium (0.001 BTC)
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  const renderMyListingsPage = () => (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Мои объявления</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={16} />
                Создать объявление
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Создать объявление</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Tabs defaultValue="free">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="free">Бесплатное</TabsTrigger>
                    <TabsTrigger value="premium">Платное (Premium)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="free" className="space-y-4 mt-4">
                    <Input placeholder="Заголовок" />
                    <Textarea placeholder="Описание..." rows={4} />
                    <Button className="w-full">Опубликовать</Button>
                  </TabsContent>
                  <TabsContent value="premium" className="space-y-4 mt-4">
                    <Input placeholder="Заголовок" />
                    <Textarea placeholder="Описание..." rows={4} />
                    <Button className="w-full">Опубликовать Premium</Button>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Icon name="FileText" size={48} />
            <p>У вас пока нет объявлений</p>
            <Button variant="outline">Создать первое объявление</Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMessagesPage = () => (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Сообщения</h1>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Icon name="MessageSquare" size={48} />
            <p>У вас пока нет сообщений</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderProfilePage = () => (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Профиль</h1>
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">
                {generatedCredentials?.login.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{generatedCredentials?.login}</h2>
              <p className="text-muted-foreground">Анонимный пользователь</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Объявлений</p>
                <p className="text-2xl font-bold text-primary">0</p>
              </div>
              <Icon name="FileText" size={24} className="text-muted-foreground" />
            </div>

            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Сообщений</p>
                <p className="text-2xl font-bold text-primary">0</p>
              </div>
              <Icon name="MessageSquare" size={24} className="text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderWalletPage = () => (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Кошелек</h1>
        
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Баланс</h2>
                <Icon name="Bitcoin" size={24} className="text-primary" />
              </div>
              <p className="text-4xl font-bold">0.0000 BTC</p>
              <p className="text-muted-foreground">≈ 0.00 ₽</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Пополнить кошелек</h3>
              <div className="space-y-2">
                <Label>Сумма BTC</Label>
                <Input placeholder="0.001" />
              </div>
              <Button className="w-full gap-2">
                <Icon name="Download" size={16} />
                Пополнить
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">История транзакций</h3>
            <div className="text-center text-muted-foreground py-8">
              <Icon name="History" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Нет транзакций</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSupportPage = () => (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Поддержка</h1>
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Связаться с поддержкой</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Тема обращения</Label>
                <Input placeholder="Кратко опишите проблему" />
              </div>
              <div className="space-y-2">
                <Label>Сообщение</Label>
                <Textarea placeholder="Подробное описание..." rows={6} />
              </div>
              <Button className="w-full gap-2">
                <Icon name="Send" size={16} />
                Отправить
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">Часто задаваемые вопросы</h3>
            <div className="space-y-3">
              {[
                { q: 'Как восстановить доступ?', a: 'К сожалению, восстановление невозможно. Сохраняйте учетные данные.' },
                { q: 'Как работают платежи?', a: 'Все платежи производятся через криптовалюту для полной анонимности.' },
                { q: 'Безопасность данных?', a: 'Мы не храним личные данные, только анонимные идентификаторы.' }
              ].map((item, i) => (
                <Card key={i} className="p-4">
                  <h4 className="font-medium mb-2">{item.q}</h4>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSettingsPage = () => (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Настройки</h1>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Безопасность</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Двухфакторная аутентификация</p>
                  <p className="text-sm text-muted-foreground">Дополнительный уровень защиты аккаунта</p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              {generatedCredentials && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="font-medium">Учетные данные</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Логин:</span>
                      <code className="text-primary">{generatedCredentials.login}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Пароль:</span>
                      <code className="text-primary">{generatedCredentials.password}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Уведомления</h2>
            <div className="space-y-3">
              {[
                { label: 'Новые сообщения', desc: 'Уведомления о входящих сообщениях' },
                { label: 'Ответы на объявления', desc: 'Когда кто-то отвечает на ваше объявление' },
                { label: 'Транзакции', desc: 'Уведомления о движении средств' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-destructive/50">
            <h2 className="text-xl font-semibold text-destructive mb-4">Опасная зона</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                После удаления аккаунта все данные будут безвозвратно утеряны
              </p>
              <Button variant="destructive" className="gap-2">
                <Icon name="Trash2" size={16} />
                Удалить аккаунт
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    if (!isAuthenticated) return renderHomePage();

    switch (currentPage) {
      case 'home': return renderHomePage();
      case 'listings': return renderListingsPage();
      case 'my-listings': return renderMyListingsPage();
      case 'messages': return renderMessagesPage();
      case 'profile': return renderProfilePage();
      case 'wallet': return renderWalletPage();
      case 'support': return renderSupportPage();
      case 'settings': return renderSettingsPage();
      default: return renderHomePage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderNavigation()}
      {renderPage()}
    </div>
  );
}
