import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { getApplications, updateApplicationStatus, deleteApplication } from '@/lib/api';

interface ModelApplication {
  id: number;
  nickname: string;
  age: number;
  city: string;
  gender: 'female' | 'male';
  videoPrice: number | null;
  audioPrice: number | null;
  chatPrice: number | null;
  description: string;
  photo: string | null;
  hasAudio: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function AdminModelApplicationsTab() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ModelApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getApplications();
      const mapped = data.map((app: any) => ({
        id: app.id,
        nickname: app.name,
        age: app.age || 0,
        city: app.city || '',
        gender: 'female' as const,
        videoPrice: null,
        audioPrice: null,
        chatPrice: null,
        description: app.experience || '',
        photo: null,
        hasAudio: false,
        status: app.status || 'pending',
        submittedAt: app.submitted_at,
      }));
      setApplications(mapped);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    const result = await updateApplicationStatus(id, 'approved');
    
    if (result.success) {
      await loadApplications();
      toast({
        title: "Заявка одобрена",
        description: "Модель добавлена в каталог",
      });
    } else {
      toast({
        title: "Ошибка",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    const result = await updateApplicationStatus(id, 'rejected');
    
    if (result.success) {
      await loadApplications();
      toast({
        title: "Заявка отклонена",
        description: "Пользователь будет уведомлен",
      });
    } else {
      toast({
        title: "Ошибка",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deleteApplication(id);
    
    if (success) {
      await loadApplications();
      toast({
        title: "Заявка удалена",
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заявку",
        variant: "destructive",
      });
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderApplication = (app: ModelApplication) => (
    <Card key={app.id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Фото */}
          <div className="flex-shrink-0">
            <Avatar className="w-32 h-32 rounded-lg">
              {app.photo ? (
                <AvatarImage src={app.photo} alt={app.nickname} />
              ) : (
                <AvatarFallback className="text-4xl rounded-lg">
                  <Icon name="User" size={48} />
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Информация */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{app.nickname}, {app.age}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Icon name="MapPin" size={14} />
                  <span>{app.city}</span>
                  <span>•</span>
                  <span>{app.gender === 'female' ? 'Женщина' : 'Мужчина'}</span>
                </div>
              </div>
              <Badge 
                variant={
                  app.status === 'pending' ? 'secondary' : 
                  app.status === 'approved' ? 'default' : 
                  'destructive'
                }
              >
                {app.status === 'pending' ? 'На модерации' : 
                 app.status === 'approved' ? 'Одобрено' : 
                 'Отклонено'}
              </Badge>
            </div>

            {/* Цены */}
            <div className="flex flex-wrap gap-3">
              {app.videoPrice && (
                <Badge variant="outline" className="gap-2">
                  <Icon name="Video" size={14} />
                  {app.videoPrice} ₽/мин
                </Badge>
              )}
              {app.audioPrice && (
                <Badge variant="outline" className="gap-2">
                  <Icon name="Phone" size={14} />
                  {app.audioPrice} ₽/мин
                </Badge>
              )}
              {app.chatPrice && (
                <Badge variant="outline" className="gap-2">
                  <Icon name="MessageCircle" size={14} />
                  {app.chatPrice} ₽/мин
                </Badge>
              )}
              {app.hasAudio && (
                <Badge variant="outline" className="gap-2">
                  <Icon name="Mic" size={14} />
                  Аудио приветствие
                </Badge>
              )}
            </div>

            {/* Описание */}
            {app.description && (
              <p className="text-sm text-muted-foreground">{app.description}</p>
            )}

            {/* Дата подачи */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Clock" size={12} />
              <span>Подана: {formatDate(app.submittedAt)}</span>
            </div>

            {/* Действия */}
            {app.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(app.id)}
                  className="gap-2"
                >
                  <Icon name="Check" size={14} />
                  Одобрить
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(app.id)}
                  className="gap-2"
                >
                  <Icon name="X" size={14} />
                  Отклонить
                </Button>
              </div>
            )}

            {app.status !== 'pending' && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(app.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={14} />
                  Удалить
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TabsContent value="model-applications" className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingApplications.length}</p>
                <p className="text-sm text-muted-foreground">На модерации</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedApplications.length}</p>
                <p className="text-sm text-muted-foreground">Одобрено</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Icon name="XCircle" size={20} className="text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejectedApplications.length}</p>
                <p className="text-sm text-muted-foreground">Отклонено</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список заявок */}
      {pendingApplications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Заявки на модерации</h2>
          {pendingApplications.map(renderApplication)}
        </div>
      )}

      {approvedApplications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Одобренные заявки</h2>
          {approvedApplications.map(renderApplication)}
        </div>
      )}

      {rejectedApplications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Отклоненные заявки</h2>
          {rejectedApplications.map(renderApplication)}
        </div>
      )}

      {applications.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет заявок на регистрацию</p>
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}