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
  price: number;
  avatar: string;
  description: string;
  tags: string[];
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
      price: 100,
      avatar: '👩',
      description: 'Приватные видеозвонки, общение',
      tags: ['Видео', 'Общение', 'Флирт']
    },
    {
      id: '2',
      name: 'Мария',
      age: 26,
      city: 'Санкт-Петербург',
      status: 'online',
      rating: 4.9,
      price: 150,
      avatar: '👱‍♀️',
      description: 'Эксклюзивный контент, видеосессии',
      tags: ['Premium', 'Видео', 'Эксклюзив']
    },
    {
      id: '3',
      name: 'Елена',
      age: 22,
      city: 'Новосибирск',
      status: 'busy',
      rating: 4.7,
      price: 80,
      avatar: '🧑‍🦰',
      description: 'Дружеское общение, видеозвонки',
      tags: ['Видео', 'Общение']
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Вирт</h1>
            <p className="text-muted-foreground mt-1">Приватные видеозвонки и общение</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={16} />
                Стать моделью
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
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
                <div className="space-y-2">
                  <Label>Стоимость за минуту (₽)</Label>
                  <Input 
                    type="number" 
                    placeholder="100"
                    value={ratePerMinute}
                    onChange={(e) => setRatePerMinute(e.target.value)}
                  />
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
                        <li>Веб-камера и микрофон</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <Icon name="Video" size={16} />
                  Отправить заявку
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="online" className="mb-6">
          <TabsList>
            <TabsTrigger value="online" className="gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Онлайн
            </TabsTrigger>
            <TabsTrigger value="all">Все модели</TabsTrigger>
            <TabsTrigger value="favorites">Избранное</TabsTrigger>
          </TabsList>

          <TabsContent value="online" className="mt-6">
            <div className="mb-4">
              <Input placeholder="Поиск по имени, городу..." className="max-w-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockModels.filter(m => m.status === 'online').map((model) => (
                <Card key={model.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl relative">
                    {model.avatar}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 gap-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        Online
                      </Badge>
                    </div>
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

                    <p className="text-sm text-muted-foreground">{model.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {model.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-1">
                        <Icon name="Bitcoin" size={16} className="text-primary" />
                        <span className="font-bold text-lg">{model.price} ₽/мин</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2">
                            <Icon name="Video" size={14} />
                            Позвонить
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Видеозвонок с {model.name}</DialogTitle>
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
                                <span className="font-medium">{model.price} ₽/мин</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Минимум:</span>
                                <span className="font-medium">5 минут</span>
                              </div>
                              <div className="flex justify-between text-sm pt-2 border-t">
                                <span className="font-medium">Итого:</span>
                                <span className="font-bold text-lg">{model.price * 5} ₽</span>
                              </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                              <div className="flex items-start gap-2 text-sm">
                                <Icon name="AlertTriangle" size={16} className="text-amber-500 mt-0.5" />
                                <p className="text-amber-700 dark:text-amber-300">
                                  Средства спишутся с вашего кошелька автоматически
                                </p>
                              </div>
                            </div>

                            <Button className="w-full gap-2" size="lg">
                              <Icon name="Video" size={16} />
                              Начать звонок
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockModels.map((model) => (
                <Card key={model.id} className="overflow-hidden hover:shadow-lg transition-shadow opacity-60">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl relative">
                    {model.avatar}
                    <div className="absolute top-3 right-3">
                      <Badge variant={model.status === 'online' ? 'default' : 'secondary'}>
                        {model.status === 'online' ? 'Online' : model.status === 'busy' ? 'Занята' : 'Offline'}
                      </Badge>
                    </div>
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
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="font-bold text-lg">{model.price} ₽/мин</span>
                      <Button size="sm" disabled={model.status !== 'online'}>
                        {model.status === 'busy' ? 'Занята' : 'Offline'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Icon name="Heart" size={48} />
                <p>У вас пока нет избранных моделей</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
