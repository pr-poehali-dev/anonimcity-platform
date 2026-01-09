import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

type Service = 'Секс Выезд' | 'Секс Апартаменты' | 'Ужин' | 'Вечеринка' | 'Виртуальный секс';
type ListingType = 'Индивидуалка' | 'Агенство';

const SERVICES: Service[] = ['Секс Выезд', 'Секс Апартаменты', 'Ужин', 'Вечеринка', 'Виртуальный секс'];

export default function CreateListing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<ListingType>('Индивидуалка');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  const handleServiceToggle = (service: Service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Объявление создано",
      description: "Ваше объявление опубликовано",
    });

    navigate('/my-listings');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Plus" size={24} />
              Создать объявление
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок *</Label>
                <Input
                  id="title"
                  placeholder="Краткое описание услуги"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  placeholder="Подробное описание услуги, условия, особенности..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена</Label>
                <Input
                  id="price"
                  placeholder="Например: 5000 ₽/час"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Тип</Label>
                <RadioGroup value={type} onValueChange={(value) => setType(value as ListingType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Индивидуалка" id="individual" />
                    <Label htmlFor="individual" className="cursor-pointer">Индивидуалка</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Агенство" id="agency" />
                    <Label htmlFor="agency" className="cursor-pointer">Агенство</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Услуги</Label>
                <div className="space-y-2">
                  {SERVICES.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={service} className="cursor-pointer font-normal">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-accent/10">
                <Checkbox
                  id="premium"
                  checked={isPremium}
                  onCheckedChange={(checked) => setIsPremium(checked as boolean)}
                />
                <Label htmlFor="premium" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Icon name="Crown" size={18} className="text-yellow-500" />
                    <span>Премиум объявление (500 ₽)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Выделенное размещение в топе списка
                  </p>
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 gap-2">
                  <Icon name="Send" size={16} />
                  Опубликовать
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
