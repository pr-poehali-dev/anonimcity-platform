import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  type: 'video' | 'photo' | 'audio';
  title: string;
  description: string;
  price: number;
  preview: string;
  author: string;
  isPremium: boolean;
  duration?: string;
  count?: number;
}

const generateId = () => `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function MarketplacePage() {
  const { toast } = useToast();
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadPrice, setUploadPrice] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleUpload = () => {
    if (!uploadTitle || !uploadDescription || !uploadPrice) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const newId = generateId();
    toast({
      title: "Контент загружен",
      description: `ID: ${newId}`,
    });

    setUploadTitle('');
    setUploadDescription('');
    setUploadPrice('');
    setUploadDialogOpen(false);
  };

  const mockMediaItems: MediaItem[] = [
    {
      id: 'media_1735980000_abc123xyz',
      type: 'video',
      title: 'Приватное видео #1',
      description: 'Эксклюзивный контент',
      price: 500,
      preview: '🎬',
      author: 'user_1234',
      isPremium: true,
      duration: '5:30'
    },
    {
      id: 'media_1735980100_def456uvw',
      type: 'photo',
      title: 'Фотосет "Вечер"',
      description: '15 фотографий',
      price: 200,
      preview: '📸',
      author: 'user_5678',
      isPremium: false,
      count: 15
    },
    {
      id: 'media_1735980200_ghi789rst',
      type: 'audio',
      title: 'Голосовое сообщение',
      description: 'Приватная запись',
      price: 100,
      preview: '🎵',
      author: 'user_9012',
      isPremium: false,
      duration: '2:15'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Магазин контента</h1>
            <p className="text-muted-foreground mt-1">Покупайте и продавайте эксклюзивный контент</p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Upload" size={16} />
                Продать контент
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Загрузить контент на продажу</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input 
                    placeholder="Например: Приватное видео" 
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea 
                    placeholder="Краткое описание контента..." 
                    rows={3}
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Цена (₽)</Label>
                  <Input 
                    type="number" 
                    placeholder="500"
                    value={uploadPrice}
                    onChange={(e) => setUploadPrice(e.target.value)}
                  />
                </div>

                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Нажмите или перетащите файлы</p>
                  <p className="text-xs text-muted-foreground">Фото: JPG, PNG | Видео: MP4, MOV | Аудио: MP3, WAV</p>
                  <p className="text-xs text-muted-foreground mt-1">До 50MB</p>
                </div>

                <Button className="w-full gap-2" onClick={handleUpload}>
                  <Icon name="ShoppingBag" size={16} />
                  Выставить на продажу
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="marketplace" className="mb-6">
          <TabsList>
            <TabsTrigger value="marketplace">Магазин</TabsTrigger>
            <TabsTrigger value="my-content">Мой контент</TabsTrigger>
            <TabsTrigger value="purchases">Покупки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplace" className="mt-6">
            <div className="mb-4 flex gap-2">
              <Input placeholder="Поиск контента..." className="flex-1" />
              <Button variant="outline" size="icon">
                <Icon name="Filter" size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMediaItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl">
                    {item.preview}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      </div>
                      {item.isPremium && (
                        <Icon name="Crown" size={18} className="text-yellow-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="User" size={14} />
                      <span>{item.author}</span>
                      {item.duration && (
                        <>
                          <span>•</span>
                          <Icon name="Clock" size={14} />
                          <span>{item.duration}</span>
                        </>
                      )}
                      {item.count && (
                        <>
                          <span>•</span>
                          <Icon name="Image" size={14} />
                          <span>{item.count}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Icon name="Bitcoin" size={16} className="text-primary" />
                        <span className="font-bold text-lg">{item.price} ₽</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2">
                            <Icon name="ShoppingCart" size={14} />
                            Купить
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Покупка контента</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-semibold mb-2">{item.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Цена:</span>
                                <span className="font-bold text-xl">{item.price} ₽</span>
                              </div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground">После покупки контент будет доступен в разделе "Покупки"</p>
                            </div>
                            <Button className="w-full gap-2">
                              <Icon name="Lock" size={16} />
                              Оплатить {item.price} ₽
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

          <TabsContent value="my-content" className="mt-6">
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Icon name="Package" size={48} />
                <p>У вас нет контента на продаже</p>
                <Button className="gap-2" onClick={() => setUploadDialogOpen(true)}>
                  <Icon name="Upload" size={16} />
                  Загрузить первый контент
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="mt-6">
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Icon name="ShoppingBag" size={48} />
                <p>У вас пока нет покупок</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}