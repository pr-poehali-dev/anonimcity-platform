import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProfileWalletPagesProps {
  page: 'profile' | 'wallet' | 'support' | 'settings';
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function ProfileWalletPages({ page, generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: ProfileWalletPagesProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован`);
  };

  if (page === 'profile') {
    return (
      <div className="min-h-screen pt-24 pb-24 md:pb-12">
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

            <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="KeyRound" size={18} className="text-primary" />
                Учетные данные
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background/80 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Логин</p>
                    <code className="text-primary font-mono">{generatedCredentials?.login}</code>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => copyToClipboard(generatedCredentials?.login || '', 'Логин')}
                  >
                    <Icon name="Copy" size={14} />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/80 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Пароль</p>
                    <code className="text-primary font-mono">
                      {showPassword ? generatedCredentials?.password : '••••••••••••'}
                    </code>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard(generatedCredentials?.password || '', 'Пароль')}
                    >
                      <Icon name="Copy" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-amber-600 mt-3 p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
                <Icon name="AlertTriangle" size={12} className="mt-0.5" />
                <p>Сохраните эти данные в надежном месте. Восстановление невозможно.</p>
              </div>
            </Card>

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
      <div className="min-h-screen pt-24 pb-24 md:pb-12">
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

  const handleSendSupportTicket = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error('Заполните все поля');
      return;
    }

    if (!generatedCredentials) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    setIsSending(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const ticket = {
        id: Date.now(),
        userLogin: generatedCredentials.login,
        subject: supportSubject,
        message: supportMessage,
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      const existingTickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
      localStorage.setItem('support_tickets', JSON.stringify([ticket, ...existingTickets]));

      toast.success('Обращение отправлено', {
        description: 'Поддержка ответит в ближайшее время',
      });

      setSupportSubject('');
      setSupportMessage('');
    } catch (error) {
      toast.error('Ошибка отправки', {
        description: 'Попробуйте снова',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (page === 'support') {
    return (
      <div className="min-h-screen pt-24 pb-24 md:pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Поддержка</h1>
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Связаться с поддержкой</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Тема обращения</Label>
                  <Input 
                    placeholder="Кратко опишите проблему" 
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Сообщение</Label>
                  <Textarea 
                    placeholder="Подробное описание проблемы..." 
                    rows={5}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full gap-2"
                  onClick={handleSendSupportTicket}
                  disabled={isSending}
                >
                  <Icon name={isSending ? "Loader2" : "Send"} size={16} className={isSending ? "animate-spin" : ""} />
                  {isSending ? 'Отправка...' : 'Отправить'}
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4">Часто задаваемые вопросы</h2>
              <div className="space-y-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Icon name="HelpCircle" size={20} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Как работает анонимность?</h3>
                      <p className="text-sm text-muted-foreground">
                        Все пользователи работают под случайными идентификаторами, личные данные не собираются.
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Icon name="HelpCircle" size={20} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Как оплачивать услуги?</h3>
                      <p className="text-sm text-muted-foreground">
                        Платформа использует криптовалюту для обеспечения анонимности транзакций.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (page === 'settings') {
    return (
      <div className="min-h-screen pt-24 pb-24 md:pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Настройки</h1>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Учетные данные</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Логин</p>
                    <p className="text-sm text-muted-foreground">{generatedCredentials?.login}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Пароль</p>
                    <p className="text-sm text-muted-foreground">••••••••</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Icon name="Eye" size={16} />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Безопасность</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Двухфакторная аутентификация</p>
                    <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Конфиденциальность</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Скрыть онлайн-статус</p>
                    <p className="text-sm text-muted-foreground">Другие не увидят когда вы в сети</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Приватный профиль</p>
                    <p className="text-sm text-muted-foreground">Профиль виден только вам</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-destructive/50">
              <h2 className="text-xl font-semibold mb-4 text-destructive">Опасная зона</h2>
              <Button variant="destructive" className="w-full gap-2">
                <Icon name="Trash2" size={16} />
                Удалить аккаунт
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}