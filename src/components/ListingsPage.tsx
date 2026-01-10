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
  isMine?: boolean;
}

interface ListingsPageProps {
  listings: Listing[];
}

export default function ListingsPage({ listings }: ListingsPageProps) {
  const myListings = listings.filter(l => l.isMine);

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
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
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="all">Все объявления</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="my">Мои объявления</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
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

          <TabsContent value="premium" className="space-y-4 mt-6">
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

          <TabsContent value="my" className="mt-6">
            {myListings.length > 0 ? (
              <div className="space-y-4">
                {myListings.map((listing) => (
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
                            <span>{listing.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Icon name="Edit" size={14} />
                          Редактировать
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-2">
                          <Icon name="Trash2" size={14} />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Icon name="FileText" size={48} />
                  <p>У вас пока нет объявлений</p>
                  <Button asChild className="gap-2">
                    <Link to="/create-listing">
                      <Icon name="Plus" size={16} />
                      Создать первое объявление
                    </Link>
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
