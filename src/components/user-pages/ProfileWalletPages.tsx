import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { createSupportTicket, getSupportTickets } from '@/lib/api';

interface ProfileWalletPagesProps {
  page: 'profile' | 'wallet' | 'support' | 'settings';
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function ProfileWalletPages({ page, generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: ProfileWalletPagesProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const secretKey = 'JBSWY3DPEHPK3PXP';
  const otpauth = `otpauth://totp/AnonimCity:${generatedCredentials?.login}?secret=${secretKey}&issuer=AnonimCity`;

  useEffect(() => {
    if (show2FASetup) {
      QRCode.toDataURL(otpauth)
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error(err));
    }
  }, [show2FASetup, otpauth]);

  useEffect(() => {
    if (page === 'support' && generatedCredentials?.user_id) {
      loadSupportTickets();
    }
  }, [page, generatedCredentials]);

  const loadSupportTickets = async () => {
    if (!generatedCredentials?.user_id) return;
    
    setLoadingTickets(true);
    try {
      const tickets = await getSupportTickets(generatedCredentials.user_id);
      setSupportTickets(tickets);
    } catch (error) {
      console.error('Failed to load support tickets:', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleEnable2FA = () => {
    if (!twoFactorEnabled) {
      setShow2FASetup(true);
    } else {
      setTwoFactorEnabled(false);
      setShow2FASetup(false);
      toast.success('2FA отключен');
    }
  };

  const handleVerify2FA = () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      toast.error('Введите 6-значный код');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setTwoFactorEnabled(true);
      setShow2FASetup(false);
      setVerificationCode('');
      setIsVerifying(false);
      toast.success('2FA успешно активирован');
    }, 1000);
  };

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

    if (!generatedCredentials?.user_id) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    setIsSending(true);

    try {
      const result = await createSupportTicket(
        generatedCredentials.user_id,
        supportSubject,
        supportMessage
      );

      if (result.success) {
        toast.success('Обращение отправлено', {
          description: 'Поддержка ответит в ближайшее время',
        });
        setSupportSubject('');
        setSupportMessage('');
        loadSupportTickets();
      } else {
        toast.error('Ошибка отправки', {
          description: result.error || 'Попробуйте снова',
        });
      }
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
              <h2 className="text-xl font-semibold mb-4">Мои обращения</h2>
              {loadingTickets ? (
                <div className="flex justify-center py-8">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                </div>
              ) : supportTickets.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Icon name="Inbox" size={48} />
                    <p>У вас пока нет обращений</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <Card key={ticket.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{ticket.subject}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              ticket.status === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                              ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' :
                              'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                            }`}>
                              {ticket.status === 'new' ? 'Новое' : 
                               ticket.status === 'in_progress' ? 'В работе' : 
                               'Закрыто'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {ticket.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="Calendar" size={12} />
                            <span>{ticket.created_at}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
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
                <div className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">Google Authenticator (2FA)</p>
                      <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={handleEnable2FA} />
                  </div>
                  
                  {show2FASetup && (
                    <div className="border-t p-4 bg-muted/30 space-y-4">
                      <div className="space-y-3">
                        <p className="text-sm font-medium">1. Отсканируйте QR-код в Google Authenticator</p>
                        <div className="flex justify-center p-4 bg-background rounded-lg">
                          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm font-medium">2. Или введите секретный ключ вручную:</p>
                        <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                          <code className="flex-1 text-sm font-mono text-primary">{secretKey}</code>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => copyToClipboard(secretKey, 'Секретный ключ')}
                          >
                            <Icon name="Copy" size={14} />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>3. Введите 6-значный код из приложения</Label>
                        <Input 
                          placeholder="123456"
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        />
                        <Button 
                          className="w-full gap-2"
                          onClick={handleVerify2FA}
                          disabled={isVerifying || verificationCode.length !== 6}
                        >
                          <Icon name={isVerifying ? "Loader2" : "ShieldCheck"} size={16} className={isVerifying ? "animate-spin" : ""} />
                          {isVerifying ? 'Проверка...' : 'Подтвердить'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {twoFactorEnabled && !show2FASetup && (
                    <div className="border-t p-4 bg-green-50 dark:bg-green-950/20">
                      <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                        <Icon name="ShieldCheck" size={16} />
                        <p>2FA активирован и защищает ваш аккаунт</p>
                      </div>
                    </div>
                  )}
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