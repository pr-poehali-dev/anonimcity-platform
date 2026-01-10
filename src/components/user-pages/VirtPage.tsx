import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface VirtPageProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

interface VirtModel {
  id: string;
  name: string;
  age: number;
  city: string;
  status: 'online' | 'offline' | 'busy';
  rating: number;
  videoPrice?: number;
  audioPrice?: number;
  chatPrice?: number;
  avatar: string;
  description: string;
  tags: string[];
  services: ('video' | 'audio' | 'chat')[];
}

export default function VirtPage({ generatedCredentials }: VirtPageProps) {
  const [ratePerMinute, setRatePerMinute] = useState('');
  const [description, setDescription] = useState('');

  const mockModels: VirtModel[] = [
    {
      id: '1',
      name: 'Анна',
      age: 24,
      city: 'Москва',
      status: 'online',
      rating: 4.8,
      videoPrice: 100,
      audioPrice: 60,
      chatPrice: 30,
      avatar: '👩',
      description: 'Приватные видеозвонки, аудио, переписка',
      tags: ['Видео', 'Аудио', 'Чат'],
      services: ['video', 'audio', 'chat']
    },
    {
      id: '2',
      name: 'Мария',
      age: 26,
      city: 'Санкт-Петербург',
      status: 'online',
      rating: 4.9,
      videoPrice: 150,
      audioPrice: 80,
      avatar: '👱‍♀️',
      description: 'Эксклюзивный видео и аудио контент',
      tags: ['Premium', 'Видео', 'Аудио'],
      services: ['video', 'audio']
    },
    {
      id: '3',
      name: 'Елена',
      age: 22,
      city: 'Новосибирск',
      status: 'busy',
      rating: 4.7,
      videoPrice: 80,
      chatPrice: 25,
      avatar: '🧑‍🦰',
      description: 'Видеозвонки и приятная переписка',
      tags: ['Видео', 'Чат'],
      services: ['video', 'chat']
    },
    {
      id: '4',
      name: 'София',
      age: 23,
      city: 'Казань',
      status: 'online',
      rating: 4.6,
      audioPrice: 50,
      chatPrice: 20,
      avatar: '👸',
      description: 'Аудиозвонки и переписка с голосовыми',
      tags: ['Аудио', 'Чат', 'Голосовые'],
      services: ['audio', 'chat']
    }
  ];

  const renderModelCard = (model: VirtModel, serviceType?: 'video' | 'audio' | 'chat') => {
    const getPrice = () => {
      if (serviceType === 'video') return model.videoPrice;
      if (serviceType === 'audio') return model.audioPrice;
      if (serviceType === 'chat') return model.chatPrice;
      return model.videoPrice || model.audioPrice || model.chatPrice;
    };

    const getServiceIcon = () => {
      if (serviceType === 'video') return 'Video';
      if (serviceType === 'audio') return 'Phone';
      if (serviceType === 'chat') return 'MessageCircle';
      return 'Video';
    };

    const getServiceLabel = () => {
      if (serviceType === 'video') return 'Видеозвонок';
      if (serviceType === 'audio') return 'Аудиозвонок';
      if (serviceType === 'chat') return 'Написать';
      return 'Позвонить';
    };

    const price = getPrice();
    if (!price) return null;

    return (
      <Card key={`${model.id}-${serviceType}`} className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl relative">
          {model.avatar}
          <div className="absolute top-3 right-3">
            <Badge className={model.status === 'online' ? 'bg-green-500 gap-1' : ''} variant={model.status === 'online' ? 'default' : 'secondary'}>
              {model.status === 'online' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              {model.status === 'online' ? 'Online' : model.status === 'busy' ? 'Занята' : 'Offline'}
            </Badge>
          </div>
          {serviceType && (
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="bg-background/80 gap-1">
                <Icon name={getServiceIcon() as any} size={12} />
                {serviceType === 'video' ? 'Видео' : serviceType === 'audio' ? 'Аудио' : 'Чат'}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{model.name}, {model.age}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Icon name="MapPin" size={14} />
                {model.city}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Star" size={14} className="text-yellow-500" />
              <span className="font-medium">{model.rating}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{model.description}</p>

          <div className="flex flex-wrap gap-2">
            {model.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1">
              <Icon name="Bitcoin" size={16} className="text-primary" />
              <span className="font-bold text-lg">{price} ₽/мин</span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2" disabled={model.status !== 'online'}>
                  <Icon name={getServiceIcon() as any} size={14} />
                  {getServiceLabel()}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {serviceType === 'video' ? 'Видеозвонок' : serviceType === 'audio' ? 'Аудиозвонок' : 'Переписка'} с {model.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-3xl">{model.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{model.name}, {model.age}</h3>
                      <p className="text-sm text-muted-foreground">{model.city}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Icon name="Star" size={12} className="text-yellow-500" />
                        <span className="text-sm font-medium">{model.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Стоимость:</span>
                      <span className="font-medium">{price} ₽/мин</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Минимум:</span>
                      <span className="font-medium">{serviceType === 'chat' ? '10 минут' : '5 минут'}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="font-medium">Итого:</span>
                      <span className="font-bold text-lg">{price * (serviceType === 'chat' ? 10 : 5)} ₽</span>
                    </div>
                  </div>

                  {serviceType === 'chat' && (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                      <div className="flex items-start gap-2 text-sm">
                        <Icon name="Info" size={16} className="text-blue-500 mt-0.5" />
                        <p className="text-blue-700 dark:text-blue-300">
                          В переписке доступны текстовые и голосовые сообщения
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                    <div className="flex items-start gap-2 text-sm">
                      <Icon name="AlertTriangle" size={16} className="text-amber-500 mt-0.5" />
                      <p className="text-amber-700 dark:text-amber-300">
                        Средства спишутся с вашего кошелька автоматически
                      </p>
                    </div>
                  </div>

                  <Button className="w-full gap-2" size="lg">
                    <Icon name={getServiceIcon() as any} size={16} />
                    {serviceType === 'video' ? 'Начать видеозвонок' : serviceType === 'audio' ? 'Начать аудиозвонок' : 'Открыть чат'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Вирт</h1>
            <p className="text-muted-foreground mt-1">Приватное общение в разных форматах</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={16} />
                Стать моделью
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Регистрация как модель</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Псевдоним</Label>
                  <Input placeholder="Например: Анна" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Возраст</Label>
                    <Input type="number" placeholder="25" />
                  </div>
                  <div className="space-y-2">
                    <Label>Город</Label>
                    <Input placeholder="Москва" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Предоставляемые услуги и цены (₽/мин)</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="Видеозвонки" />
                      <Icon name="Video" size={18} className="text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="Аудиозвонки" />
                      <Icon name="Phone" size={18} className="text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="Переписка" />
                      <Icon name="MessageCircle" size={18} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Описание услуг</Label>
                  <Textarea 
                    placeholder="Расскажите о себе и своих услугах..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <Icon name="Info" size={16} className="text-primary mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Требования:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Возраст 18+</li>
                        <li>Стабильное интернет-соединение</li>
                        <li>Для видео/аудио: веб-камера и микрофон</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <Icon name="Send" size={16} />
                  Отправить заявку
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="video" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video" className="gap-2">
              <Icon name="Video" size={16} />
              <span className="hidden sm:inline">Видеозвонки</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="gap-2">
              <Icon name="Phone" size={16} />
              <span className="hidden sm:inline">Аудиозвонки</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <Icon name="MessageCircle" size={16} />
              <span className="hidden sm:inline">Переписка</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="mt-6">
            <div className="mb-4 flex gap-2">
              <Input placeholder="Поиск по имени, городу..." className="flex-1" />
              <Button variant="outline" size="icon">
                <Icon name="Filter" size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockModels
                .filter(m => m.services.includes('video') && m.status === 'online')
                .map(model => renderModelCard(model, 'video'))}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-6">
            <div className="mb-4 flex gap-2">
              <Input placeholder="Поиск по имени, городу..." className="flex-1" />
              <Button variant="outline" size="icon">
                <Icon name="Filter" size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockModels
                .filter(m => m.services.includes('audio') && m.status === 'online')
                .map(model => renderModelCard(model, 'audio'))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <div className="mb-4 flex gap-2">
              <Input placeholder="Поиск по имени, городу..." className="flex-1" />
              <Button variant="outline" size="icon">
                <Icon name="Filter" size={18} />
              </Button>
            </div>

            <div className="mb-4 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="MessageCircle" size={20} className="text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Переписка с голосовыми сообщениями
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Общайтесь текстом и отправляйте голосовые сообщения в приватном чате
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockModels
                .filter(m => m.services.includes('chat') && m.status === 'online')
                .map(model => renderModelCard(model, 'chat'))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
