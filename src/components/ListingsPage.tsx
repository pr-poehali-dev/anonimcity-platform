import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

type Service = 'Секс Выезд' | 'Секс Апартаменты' | 'Ужин' | 'Вечеринка' | 'Виртуальный секс';
type ListingType = 'Индивидуалка' | 'Агенство';

interface Listing {
  id: number;
  title: string;
  description: string;
  isPremium: boolean;
  services?: Service[];
  type?: ListingType;
  price?: string;
  images?: string[];
  author: string;
  createdAt: string;
}

interface ListingsPageProps {
  listings: Listing[];
}

export default function ListingsPage({ listings }: ListingsPageProps) {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Объявления</h1>
          <Button asChild className="gap-2">
            <Link to="/create-listing">
              <Icon name="Plus" size={16} />
              Создать объявление
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Input placeholder="Поиск объявлений..." className="flex-1" />
          <Select>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Все услуги" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все услуги</SelectItem>
              <SelectItem value="outcall">Секс Выезд</SelectItem>
              <SelectItem value="apartment">Секс Апартаменты</SelectItem>
              <SelectItem value="dinner">Ужин</SelectItem>
              <SelectItem value="party">Вечеринка</SelectItem>
              <SelectItem value="virtual">Виртуальный секс</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-6">
            <TabsTrigger value="all">Все объявления</TabsTrigger>
            <TabsTrigger value="premium">Премиум</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="p-6 hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{listing.title}</h3>
                          {listing.isPremium && (
                            <Badge className="bg-gradient-to-r from-primary to-accent">
                              <Icon name="Crown" size={12} className="mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{listing.description}</p>
                      </div>
                    </div>

                    {listing.isPremium && (
                      <div className="flex flex-wrap gap-2">
                        {listing.services?.map((service) => (
                          <Badge key={service} variant="secondary">{service}</Badge>
                        ))}
                        {listing.type && <Badge variant="outline">{listing.type}</Badge>}
                        {listing.price && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {listing.price}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{listing.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{listing.author}</span>
                        <span>•</span>
                        <span>{listing.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Icon name="MessageCircle" size={16} />
                        Написать
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Отправить сообщение</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea placeholder="Ваше сообщение..." rows={5} />
                        <Button className="w-full">Отправить</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="premium" className="space-y-4">
            {listings.filter(l => l.isPremium).map((listing) => (
              <Card key={listing.id} className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30 hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{listing.title}</h3>
                          <Badge className="bg-gradient-to-r from-primary to-accent">
                            <Icon name="Crown" size={12} className="mr-1" />
                            Premium
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{listing.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {listing.services?.map((service) => (
                        <Badge key={service} variant="secondary">{service}</Badge>
                      ))}
                      {listing.type && <Badge variant="outline">{listing.type}</Badge>}
                      {listing.price && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {listing.price}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{listing.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{listing.author}</span>
                        <span>•</span>
                        <span>{listing.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="gap-2">
                    <Icon name="MessageCircle" size={16} />
                    Написать
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-2xl">
              <Icon name="Plus" size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Создать объявление</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs defaultValue="free" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="free">Бесплатное</TabsTrigger>
                  <TabsTrigger value="premium">Платное (Premium)</TabsTrigger>
                </TabsList>

                <TabsContent value="free" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Заголовок</Label>
                    <Input placeholder="Краткое описание" />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea placeholder="Подробное описание..." rows={4} />
                  </div>
                  <Button className="w-full">Опубликовать бесплатно</Button>
                </TabsContent>

                <TabsContent value="premium" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Заголовок</Label>
                    <Input placeholder="Краткое описание" />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea placeholder="Подробное описание..." rows={4} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Тип</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Индивидуалка</SelectItem>
                          <SelectItem value="agency">Агенство</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Стоимость</Label>
                      <Input placeholder="Цена" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Услуги</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Секс Выезд', 'Секс Апартаменты', 'Ужин', 'Вечеринка', 'Виртуальный секс'].map((service) => (
                        <Label key={service} className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-accent/10">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{service}</span>
                        </Label>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full gap-2">
                    <Icon name="Crown" size={16} />
                    Опубликовать Premium (0.001 BTC)
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}