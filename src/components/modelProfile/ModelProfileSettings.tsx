import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import type { Model } from '@/components/admin/tabs/AdminContentTabs';

interface ModelProfileSettingsProps {
  model: Model;
  isEditing: boolean;
  editForm: Model;
  avatarOptions: string[];
  cityOptions: string[];
  onEditClick: () => void;
  onFormChange: (field: keyof Model, value: string | number | boolean | undefined) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ModelProfileSettings({
  model,
  isEditing,
  editForm,
  avatarOptions,
  cityOptions,
  onEditClick,
  onFormChange,
  onSave,
  onCancel,
}: ModelProfileSettingsProps) {
  return (
    <TabsContent value="settings" className="space-y-4 mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Настройки профиля</CardTitle>
          {!isEditing && (
            <Button onClick={onEditClick} className="gap-2">
              <Icon name="Edit" size={16} />
              Редактировать
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              {/* Основная информация */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Основная информация</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя модели</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => onFormChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login">Логин</Label>
                    <Input
                      id="login"
                      value={editForm.login}
                      onChange={(e) => onFormChange('login', e.target.value)}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Аватар</Label>
                    <Select value={editForm.avatar} onValueChange={(value) => onFormChange('avatar', value)}>
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
                      min="18"
                      max="99"
                      value={editForm.age || ''}
                      onChange={(e) => onFormChange('age', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Select value={editForm.city} onValueChange={(value) => onFormChange('city', value)}>
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
                    value={editForm.bio}
                    onChange={(e) => onFormChange('bio', e.target.value)}
                    rows={4}
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
                    value={editForm.phone}
                    onChange={(e) => onFormChange('phone', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input
                      id="telegram"
                      value={editForm.telegram}
                      onChange={(e) => onFormChange('telegram', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={editForm.whatsapp}
                      onChange={(e) => onFormChange('whatsapp', e.target.value)}
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
                    <Select value={editForm.status} onValueChange={(value) => onFormChange('status', value)}>
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
                        checked={editForm.verified}
                        onChange={(e) => onFormChange('verified', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Верифицированный профиль</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Кнопки сохранения */}
              <div className="flex gap-3 pt-4">
                <Button onClick={onSave} className="gap-2">
                  <Icon name="Save" size={16} />
                  Сохранить изменения
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Основная информация</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Имя</p>
                      <p className="font-medium">{model.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Логин</p>
                      <p className="font-medium">{model.login}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Возраст</p>
                      <p className="font-medium">{model.age ? `${model.age} лет` : 'Не указан'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Город</p>
                      <p className="font-medium">{model.city || 'Не указан'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Контакты</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Телефон</p>
                      <p className="font-medium">{model.phone || 'Не указан'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Telegram</p>
                      <p className="font-medium">{model.telegram || 'Не указан'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                      <p className="font-medium">{model.whatsapp || 'Не указан'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {model.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Описание</h4>
                  <p className="text-sm">{model.bio}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Статус аккаунта</h4>
                <div className="flex gap-2">
                  <Badge variant="outline">{model.status}</Badge>
                  {model.verified && (
                    <Badge variant="default" className="gap-1">
                      <Icon name="CheckCircle" size={12} />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
