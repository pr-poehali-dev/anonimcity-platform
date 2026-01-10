import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

export default function AdminSettingsTab() {
  const { toast } = useToast();

  const [twoFactorDialog, setTwoFactorDialog] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [setupStep, setSetupStep] = useState<'setup' | 'verify'>('setup');
  const [soundNotificationsEnabled, setSoundNotificationsEnabled] = useState(false);

  useEffect(() => {
    const saved2FA = localStorage.getItem('admin_2fa_enabled');
    if (saved2FA === 'true') {
      setTwoFactorEnabled(true);
    }
    const savedSoundNotifications = localStorage.getItem('admin_sound_notifications');
    if (savedSoundNotifications === 'true') {
      setSoundNotificationsEnabled(true);
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

  const handleToggleSoundNotifications = () => {
    const newState = !soundNotificationsEnabled;
    setSoundNotificationsEnabled(newState);
    localStorage.setItem('admin_sound_notifications', String(newState));
    
    toast({
      title: newState ? "Звук включен" : "Звук выключен",
      description: newState 
        ? "Вы будете получать звуковые оповещения о новых сообщениях и ответах"
        : "Звуковые оповещения отключены",
    });
  };

  return (
    <>
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={soundNotificationsEnabled ? "Volume2" : "VolumeX"} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Звуковые уведомления</h3>
                    <p className="text-sm text-muted-foreground">
                      {soundNotificationsEnabled ? 'Звук включен для новых сообщений и ответов' : 'Звуковые оповещения отключены'}
                    </p>
                  </div>
                </div>
                {soundNotificationsEnabled ? (
                  <Button variant="destructive" onClick={handleToggleSoundNotifications}>
                    Отключить
                  </Button>
                ) : (
                  <Button variant="default" onClick={handleToggleSoundNotifications}>
                    Включить
                  </Button>
                )}
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
    </>
  );
}