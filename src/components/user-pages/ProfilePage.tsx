import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { getApplications } from '@/lib/api';

interface ProfilePageProps {
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
}

export default function ProfilePage({ generatedCredentials }: ProfilePageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [modelApplication, setModelApplication] = useState<any>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(true);

  useEffect(() => {
    loadModelApplication();
  }, [generatedCredentials]);

  const loadModelApplication = async () => {
    if (!generatedCredentials?.login) {
      setIsLoadingApplication(false);
      return;
    }
    
    setIsLoadingApplication(true);
    try {
      const applications = await getApplications();
      const userApp = applications.find((app: any) => 
        app.name === generatedCredentials.login || 
        app.telegram === generatedCredentials.login
      );
      setModelApplication(userApp || null);
    } catch (error) {
      console.error('Failed to load application:', error);
    } finally {
      setIsLoadingApplication(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><Icon name="CheckCircle" size={12} className="mr-1" />Одобрено</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><Icon name="XCircle" size={12} className="mr-1" />Отклонено</Badge>;
      default:
        return <Badge variant="secondary"><Icon name="Clock" size={12} className="mr-1" />На рассмотрении</Badge>;
    }
  };

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

          {!isLoadingApplication && modelApplication && (
            <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="User" size={18} className="text-purple-500" />
                Заявка модели
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Статус заявки:</span>
                  {getStatusBadge(modelApplication.status || 'pending')}
                </div>
                <div className="p-3 bg-background/80 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Никнейм:</span>
                    <span className="font-medium">{modelApplication.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Возраст:</span>
                    <span className="font-medium">{modelApplication.age || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Город:</span>
                    <span className="font-medium">{modelApplication.city || 'Не указан'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата подачи:</span>
                    <span className="font-medium">
                      {new Date(modelApplication.submitted_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
                {modelApplication.status === 'pending' && (
                  <div className="flex items-start gap-2 text-xs text-blue-600 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                    <Icon name="Info" size={12} className="mt-0.5" />
                    <p>Ваша заявка на рассмотрении. Ожидайте решения администратора в течение 24 часов.</p>
                  </div>
                )}
                {modelApplication.status === 'approved' && (
                  <div className="flex items-start gap-2 text-xs text-green-600 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                    <Icon name="CheckCircle" size={12} className="mt-0.5" />
                    <p>Поздравляем! Ваша заявка одобрена. Вы можете начать работу в разделе "Виртуальный секс".</p>
                  </div>
                )}
                {modelApplication.status === 'rejected' && (
                  <div className="flex items-start gap-2 text-xs text-red-600 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                    <Icon name="XCircle" size={12} className="mt-0.5" />
                    <p>К сожалению, ваша заявка была отклонена. Вы можете подать новую заявку через 7 дней.</p>
                  </div>
                )}
              </div>
            </Card>
          )}

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