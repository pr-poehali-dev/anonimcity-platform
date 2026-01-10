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
import { useState } from 'react';

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
  audioGreeting?: string;
  author: string;
  createdAt: string;
  isMine?: boolean;
  city?: string;
  age?: number;
}

interface ListingsPageProps {
  listings: Listing[];
}

export default function ListingsPage({ listings }: ListingsPageProps) {
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [ageRange, setAgeRange] = useState<string>('all');
  
  const cities = ['all', ...Array.from(new Set(listings.map(l => l.city).filter(Boolean)))] as string[];
  
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = selectedService === 'all' || listing.services?.some(s => {
      if (selectedService === 'outcall') return s === 'Секс Выезд';
      if (selectedService === 'apartment') return s === 'Секс Апартаменты';
      if (selectedService === 'dinner') return s === 'Ужин';
      if (selectedService === 'party') return s === 'Вечеринка';
      if (selectedService === 'virtual') return s === 'Виртуальный секс';
      return false;
    });
    const matchesCity = selectedCity === 'all' || listing.city === selectedCity;
    const matchesAge = ageRange === 'all' || (() => {
      if (!listing.age) return false;
      if (ageRange === '18-25') return listing.age >= 18 && listing.age <= 25;
      if (ageRange === '26-35') return listing.age >= 26 && listing.age <= 35;
      if (ageRange === '36+') return listing.age >= 36;
      return true;
    })();
    
    return matchesSearch && matchesService && matchesCity && matchesAge;
  });
  
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    return 0;
  });

  const myListings = listings.filter(l => l.isMine);

  const handlePlayAudio = (listingId: number) => {
    if (playingAudio === listingId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(listingId);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Объявления</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Input 
            placeholder="Поиск объявлений..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:col-span-2"
          />
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
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
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Все города" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все города</SelectItem>
              {cities.filter(c => c !== 'all').map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ageRange} onValueChange={setAgeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Любой возраст" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любой возраст</SelectItem>
              <SelectItem value="18-25">18-25 лет</SelectItem>
              <SelectItem value="26-35">26-35 лет</SelectItem>
              <SelectItem value="36+">36+ лет</SelectItem>
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
            {sortedListings.map((listing) => (
              <Card key={listing.id} className={`p-6 transition-all ${
                listing.isPremium 
                  ? 'bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-primary/40 hover:border-primary/60 shadow-lg' 
                  : 'hover:border-primary/50'
              }`}>
                <div className="flex flex-col md:flex-row gap-6">
                  {listing.isPremium && listing.images && listing.images.length > 0 && (
                    <div className="w-full md:w-64 flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title}
                          className="w-full h-48 md:h-full object-cover rounded-lg"
                        />
                        {listing.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Icon name="Image" size={12} />
                            <span>+{listing.images.length - 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
                        {listing.city && (
                          <Badge variant="outline" className="gap-1">
                            <Icon name="MapPin" size={12} />
                            {listing.city}
                          </Badge>
                        )}
                        {listing.age && (
                          <Badge variant="outline">
                            {listing.age} лет
                          </Badge>
                        )}
                      </div>
                    )}

                    {listing.isPremium && listing.audioGreeting && (
                      <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handlePlayAudio(listing.id)}
                        >
                          <Icon name={playingAudio === listing.id ? "Pause" : "Play"} size={16} className="text-primary" />
                        </Button>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Голосовое приветствие</p>
                          <p className="text-xs text-muted-foreground">Нажмите для прослушивания</p>
                        </div>
                        <Icon name="Volume2" size={18} className="text-primary" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
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

                  <Dialog className="flex-shrink-0">
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