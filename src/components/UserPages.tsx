import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface UserPagesProps {
  page: 'my-listings' | 'messages' | 'files' | 'profile' | 'wallet' | 'support' | 'settings';
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function UserPages({ page, generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: UserPagesProps) {
  if (page === 'my-listings') {
    return (
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
  }

  if (page === 'messages') {
    return (
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
  }

  if (page === 'files') {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Файлы</h1>
            <Button className="gap-2">
              <Icon name="Upload" size={16} />
              Загрузить файл
            </Button>
          </div>
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Icon name="FolderOpen" size={48} />
              <p>У вас пока нет файлов</p>
              <Button variant="outline">Загрузить первый файл</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (page === 'profile') {
    return (
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
  }

  if (page === 'wallet') {
    return (
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
  }

  if (page === 'support') {
    return (
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
  }

  if (page === 'settings') {
    return (
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
  }

  return null;
}