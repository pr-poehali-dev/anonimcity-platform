import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import type { Model } from '../tabs/AdminContentTabs';

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  models: Model[];
  onSubmit: (listing: ListingFormData) => void;
}

interface ListingFormData {
  modelId: number;
  title: string;
  description: string;
  category: string;
  price: string;
  isPremium: boolean;
  status: 'active' | 'pending';
}

const categories = [
  'Эскорт',
  'Массаж',
  'Фотосессии',
  'Видео',
  'Танцы',
  'Сопровождение',
  'Другое',
];

export default function CreateListingDialog({ open, onOpenChange, models, onSubmit }: CreateListingDialogProps) {
  const [formData, setFormData] = useState<ListingFormData>({
    modelId: 0,
    title: '',
    description: '',
    category: '',
    price: '',
    isPremium: false,
    status: 'active',
  });

  const handleSubmit = () => {
    if (!formData.modelId || !formData.title.trim() || !formData.category || !formData.price.trim()) {
      alert('Заполните обязательные поля: модель, название, категория и цена');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      modelId: 0,
      title: '',
      description: '',
      category: '',
      price: '',
      isPremium: false,
      status: 'active',
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      modelId: 0,
      title: '',
      description: '',
      category: '',
      price: '',
      isPremium: false,
      status: 'active',
    });
  };

  const selectedModel = models.find(m => m.id === formData.modelId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать объявление</DialogTitle>
          <DialogDescription>
            Создайте новое объявление от имени модели
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Выбор модели */}
          <div className="space-y-2">
            <Label htmlFor="model">Модель *</Label>
            <Select 
              value={formData.modelId ? formData.modelId.toString() : ''} 
              onValueChange={(value) => setFormData({ ...formData, modelId: Number(value) })}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Выберите модель" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{model.avatar}</span>
                      <span>{model.name}</span>
                      <span className="text-xs text-muted-foreground">({model.login})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedModel && (
              <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  {selectedModel.avatar}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{selectedModel.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedModel.city} • {selectedModel.age} лет</p>
                </div>
              </div>
            )}
          </div>

          {/* Основная информация */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground">Информация об объявлении</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Название *</Label>
              <Input
                id="title"
                placeholder="Профессиональная фотосессия"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Подробное описание услуги..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена *</Label>
                <Input
                  id="price"
                  placeholder="5000 ₽/час"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Настройки публикации */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground">Настройки публикации</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'pending' })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Опубликовать сразу</SelectItem>
                    <SelectItem value="pending">Отправить на модерацию</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-yellow-500" />
                    Премиум объявление
                  </span>
                </label>
              </div>
            </div>

            {formData.isPremium && (
              <div className="flex items-start gap-2 p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <Icon name="Info" size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Премиум объявления будут показаны в топе результатов поиска и получат больше просмотров
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>
            <Icon name="Plus" size={16} className="mr-2" />
            Создать объявление
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
