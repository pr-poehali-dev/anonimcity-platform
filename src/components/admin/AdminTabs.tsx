import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
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
  const { toast } = useToast();
  const navigate = useNavigate();

  const [twoFactorDialog, setTwoFactorDialog] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [setupStep, setSetupStep] = useState<'setup' | 'verify'>('setup');

  useEffect(() => {
    const saved2FA = localStorage.getItem('admin_2fa_enabled');
    if (saved2FA === 'true') {
      setTwoFactorEnabled(true);
    }
  }, []);

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  };

  const handleOpen2FADialog = async () => {
    const secret = generateSecret();
    setSecretKey(secret);
    
    const otpauth = `otpauth://totp/Anonimcity%20Admin?secret=${secret}&issuer=Anonimcity`;
    
    try {
      const qrUrl = await QRCode.toDataURL(otpauth);
      setQrCodeUrl(qrUrl);
      setSetupStep('setup');
      setTwoFactorDialog(true);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать QR-код",
        variant: "destructive",
      });
    }
  };

  const handleVerify2FA = () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Ошибка",
        description: "Введите 6-значный код",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('admin_2fa_enabled', 'true');
    localStorage.setItem('admin_2fa_secret', secretKey);
    setTwoFactorEnabled(true);
    setTwoFactorDialog(false);
    setVerificationCode('');
    
    toast({
      title: "2FA активирована",
      description: "Двухфакторная аутентификация успешно настроена",
    });
  };

  const handleDisable2FA = () => {
    localStorage.removeItem('admin_2fa_enabled');
    localStorage.removeItem('admin_2fa_secret');
    setTwoFactorEnabled(false);
    
    toast({
      title: "2FA отключена",
      description: "Двухфакторная аутентификация отключена",
    });
  };

  const handleModerationSettings = () => {
    toast({
      title: "Автоматическая модерация",
      description: "Настройка AI-модерации находится в разработке",
    });
  };

  const handlePricingSettings = () => {
    toast({
      title: "Ценообразование",
      description: "Управление тарифами находится в разработке",
    });
  };

  const handleNotificationSettings = () => {
    toast({
      title: "Уведомления",
      description: "Настройка уведомлений находится в разработке",
    });
  };
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
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
        <TabsTrigger value="models" className="gap-2">
          <Icon name="User" size={16} />
          <span className="hidden sm:inline">Модели</span>
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

      <TabsContent value="models" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Модели на платформе</CardTitle>
            <Button className="gap-2">
              <Icon name="UserPlus" size={16} />
              Добавить модель
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 1, name: 'Анна М.', login: 'anon_x7k2p9', status: 'verified', rating: 4.9, listings: 12, revenue: 145000, photo: '👩' },
                { id: 2, name: 'Виктория К.', login: 'anon_m3n8q1', status: 'verified', rating: 4.8, listings: 8, revenue: 98000, photo: '👱‍♀️' },
                { id: 3, name: 'Екатерина Л.', login: 'anon_q2l8n3', status: 'pending', rating: 4.7, listings: 5, revenue: 67000, photo: '👩‍🦰' },
                { id: 4, name: 'Мария С.', login: 'anon_k3m7n2', status: 'verified', rating: 5.0, listings: 15, revenue: 210000, photo: '👩‍🦱' },
              ].map((model) => (
                <div key={model.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl flex-shrink-0">
                      {model.photo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">{model.name}</h3>
                        {model.status === 'verified' && (
                          <Badge variant="default" className="gap-1">
                            <Icon name="CheckCircle" size={12} />
                            Верифицирована
                          </Badge>
                        )}
                        {model.status === 'pending' && (
                          <Badge variant="secondary">На проверке</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {model.login} • Рейтинг: {model.rating}/5 ⭐
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Объявлений</p>
                      <p className="font-semibold">{model.listings}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Доход</p>
                      <p className="font-semibold">{model.revenue.toLocaleString()} ₽</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => navigate(`/admin/model/${model.id}`)}
                      >
                        <Icon name="Eye" size={14} />
                        Профиль
                      </Button>
                      <Button size="sm" variant="outline">
                        <Icon name="MoreVertical" size={14} />
                      </Button>
                    </div>
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
            <CardTitle>Безопасность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Shield" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Двухфакторная аутентификация</h3>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled ? 'Google Authenticator подключен' : 'Дополнительная защита через Google Authenticator'}
                    </p>
                  </div>
                </div>
                {twoFactorEnabled ? (
                  <Button variant="destructive" onClick={handleDisable2FA}>
                    Отключить
                  </Button>
                ) : (
                  <Button variant="default" onClick={handleOpen2FADialog}>
                    Настроить
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Button variant="outline" onClick={handleModerationSettings}>Настроить</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Ценообразование</h3>
                  <p className="text-sm text-muted-foreground">Управление тарифами и комиссиями</p>
                </div>
                <Button variant="outline" onClick={handlePricingSettings}>Настроить</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Уведомления</h3>
                  <p className="text-sm text-muted-foreground">Настройка системных уведомлений</p>
                </div>
                <Button variant="outline" onClick={handleNotificationSettings}>Настроить</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={twoFactorDialog} onOpenChange={setTwoFactorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Настройка 2FA</DialogTitle>
            <DialogDescription>
              Двухфакторная аутентификация через Google Authenticator
            </DialogDescription>
          </DialogHeader>

          {setupStep === 'setup' ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Отсканируйте QR-код в приложении Google Authenticator
                </p>
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="mx-auto border rounded-lg p-4 bg-white"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Секретный ключ (для ручного ввода)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={secretKey} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(secretKey);
                      toast({ title: "Скопировано", description: "Секретный ключ скопирован в буфер обмена" });
                    }}
                  >
                    <Icon name="Copy" size={14} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Сохраните этот ключ в безопасном месте для восстановления доступа
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg bg-muted/50">
                <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Как настроить:</p>
                  <ol className="text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Установите Google Authenticator на телефон</li>
                    <li>Отсканируйте QR-код или введите ключ вручную</li>
                    <li>Введите 6-значный код для подтверждения</li>
                  </ol>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={() => setSetupStep('verify')}
              >
                Продолжить
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Код подтверждения</Label>
                <Input
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Введите 6-значный код из Google Authenticator
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSetupStep('setup')}
                >
                  Назад
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleVerify2FA}
                  disabled={verificationCode.length !== 6}
                >
                  Подтвердить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}