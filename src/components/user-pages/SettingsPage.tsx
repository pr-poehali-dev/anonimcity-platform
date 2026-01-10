import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface SettingsPageProps {
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function SettingsPage({ generatedCredentials, twoFactorEnabled, setTwoFactorEnabled }: SettingsPageProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  const secretKey = 'JBSWY3DPEHPK3PXP';
  const otpauth = `otpauth://totp/AnonimCity:${generatedCredentials?.login}?secret=${secretKey}&issuer=AnonimCity`;

  useEffect(() => {
    if (show2FASetup) {
      QRCode.toDataURL(otpauth)
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error(err));
    }
  }, [show2FASetup, otpauth]);

  const handleEnable2FA = () => {
    if (!twoFactorEnabled) {
      setShow2FASetup(true);
    } else {
      setTwoFactorEnabled(false);
      setShow2FASetup(false);
      localStorage.setItem('2fa_enabled', 'false');
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
      localStorage.setItem('2fa_enabled', 'true');
      toast.success('2FA успешно активирован');
    }, 1000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован`);
  };

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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(generatedCredentials?.login || '', 'Логин')}
                >
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
            <h2 className="text-xl font-semibold mb-4">Уведомления</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Email уведомления</p>
                  <p className="text-sm text-muted-foreground">Получать уведомления на почту</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Push уведомления</p>
                  <p className="text-sm text-muted-foreground">Уведомления в браузере</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}