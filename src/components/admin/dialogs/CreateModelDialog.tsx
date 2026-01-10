import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface CreateModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (model: ModelFormData) => void;
  editingModel?: ModelFormData & { id: number; listingsCount: number; totalRevenue: number } | null;
}

interface ModelFormData {
  name: string;
  login: string;
  avatar: string;
  age?: number;
  city?: string;
  bio?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  status: string;
  verified: boolean;
}

const avatarOptions = ['👩', '👱‍♀️', '👧', '👩‍🦰', '👩‍🦱', '👩‍🦳', '🧕', '👸', '💃', '🙋‍♀️'];
const cityOptions = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону'];

export default function CreateModelDialog({ open, onOpenChange, onSubmit, editingModel }: CreateModelDialogProps) {
  const [formData, setFormData] = useState<ModelFormData>({
    name: '',
    login: '',
    avatar: '👩',
    age: undefined,
    city: '',
    bio: '',
    phone: '',
    telegram: '',
    whatsapp: '',
    status: 'active',
    verified: false,
  });

  useEffect(() => {
    if (editingModel) {
      setFormData({
        name: editingModel.name,
        login: editingModel.login,
        avatar: editingModel.avatar,
        age: editingModel.age,
        city: editingModel.city,
        bio: editingModel.bio,
        phone: editingModel.phone,
        telegram: editingModel.telegram,
        whatsapp: editingModel.whatsapp,
        status: editingModel.status,
        verified: editingModel.verified,
      });
    } else {
      setFormData({
        name: '',
        login: '',
        avatar: '👩',
        age: undefined,
        city: '',
        bio: '',
        phone: '',
        telegram: '',
        whatsapp: '',
        status: 'active',
        verified: false,
      });
    }
  }, [editingModel, open]);

  const generateRandomLogin = () => {
    const prefix = 'anon_';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let suffix = '';
    for (let i = 0; i < 8; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    return prefix + suffix;
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.login.trim()) {
      alert('Заполните обязательные поля: имя и логин');
      return;
    }

    onSubmit(formData);
    setFormData({
      name: '',
      login: '',
      avatar: '👩',
      age: undefined,
      city: '',
      bio: '',
      phone: '',
      telegram: '',
      whatsapp: '',
      status: 'active',
      verified: false,
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      name: '',
      login: '',
      avatar: '👩',
      age: undefined,
      city: '',
      bio: '',
      phone: '',
      telegram: '',
      whatsapp: '',
      status: 'active',
      verified: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingModel ? 'Редактировать модель' : 'Создать новую модель'}</DialogTitle>
          <DialogDescription>
            {editingModel ? 'Измените информацию о модели' : 'Создайте новый аккаунт модели для размещения объявлений'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Основная информация</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя модели *</Label>
                <Input
                  id="name"
                  placeholder="Анна М."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login">Логин *</Label>
                <div className="flex gap-2">
                  <Input
                    id="login"
                    placeholder="anon_x7k2p9"
                    value={formData.login}
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, login: generateRandomLogin() })}
                    title="Сгенерировать случайный логин"
                  >
                    <Icon name="Shuffle" size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avatar">Аватар</Label>
                <Select value={formData.avatar} onValueChange={(value) => setFormData({ ...formData, avatar: value })}>
                  <SelectTrigger id="avatar">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {avatarOptions.map((emoji) => (
                      <SelectItem key={emoji} value={emoji}>
                        <span className="text-2xl">{emoji}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Возраст</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  min="18"
                  max="99"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Город</Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Описание профиля</Label>
              <Textarea
                id="bio"
                placeholder="Краткое описание модели..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Контакты */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground">Контактная информация</h3>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (900) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  placeholder="@username"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="+79001234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Статус */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground">Статус аккаунта</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="verified">Верифицирован</SelectItem>
                    <SelectItem value="inactive">Неактивен</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">Верифицированный профиль</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>
            <Icon name={editingModel ? "Save" : "Plus"} size={16} className="mr-2" />
            {editingModel ? 'Сохранить изменения' : 'Создать модель'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}