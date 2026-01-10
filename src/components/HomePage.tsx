import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface HomePageProps {
  isAuthenticated: boolean;
  generatedCredentials: { login: string; password: string } | null;
  onLogin: () => void;
  credentialsSaved: boolean;
  onCredentialsSaved: () => void;
}

export default function HomePage({ isAuthenticated, generatedCredentials, onLogin, credentialsSaved, onCredentialsSaved }: HomePageProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован`);
  };
  return (
    <div className="min-h-screen pt-24 pb-12 md:pb-12 pb-24">
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

          {!isAuthenticated && (
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
                <Button onClick={onLogin} size="lg" className="w-full gap-2 text-lg py-6">
                  <Icon name="UserPlus" size={20} />
                  Получить доступ
                </Button>
              </div>
            </Card>
          )}
          
          {isAuthenticated && generatedCredentials && !credentialsSaved && (
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-scale-in">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Icon name="CheckCircle" size={24} />
                  <h3 className="text-xl font-bold">Ваши учетные данные</h3>
                </div>
                <div className="space-y-3 bg-background/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-muted-foreground">Логин:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-primary font-mono">{generatedCredentials.login}</code>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => copyToClipboard(generatedCredentials.login, 'Логин')}
                      >
                        <Icon name="Copy" size={14} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-muted-foreground">Пароль:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-primary font-mono">{generatedCredentials.password}</code>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => copyToClipboard(generatedCredentials.password, 'Пароль')}
                      >
                        <Icon name="Copy" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-amber-500">
                  <Icon name="AlertTriangle" size={16} className="mt-0.5" />
                  <p>Сохраните эти данные! Восстановление невозможно из-за полной анонимности.</p>
                </div>
                <Button onClick={onCredentialsSaved} className="w-full gap-2" size="lg">
                  <Icon name="Check" size={20} />
                  СОХРАНИЛ
                </Button>
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
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
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
}