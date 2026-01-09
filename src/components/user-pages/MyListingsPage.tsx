import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

export default function MyListingsPage() {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.slice(0, 5);
    setSelectedPhotos(validFiles);
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Мои объявления</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={16} />
                Создать объявление
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Создать объявление</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Tabs defaultValue="free">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="free">Бесплатное</TabsTrigger>
                    <TabsTrigger value="premium">Платное (Premium)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="free" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Псевдоним</Label>
                        <Input placeholder="Например: Анна" />
                      </div>
                      <div className="space-y-2">
                        <Label>Пол</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Женский</SelectItem>
                            <SelectItem value="male">Мужской</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                      <Label>Заголовок</Label>
                      <Input placeholder="Краткое описание услуги" />
                    </div>
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Textarea placeholder="Подробное описание..." rows={4} />
                    </div>
                    <Button className="w-full">Опубликовать</Button>
                  </TabsContent>
                  <TabsContent value="premium" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Псевдоним</Label>
                        <Input placeholder="Например: Анна" />
                      </div>
                      <div className="space-y-2">
                        <Label>Пол</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Женский</SelectItem>
                            <SelectItem value="male">Мужской</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                      <Label>Заголовок</Label>
                      <Input placeholder="Краткое описание услуги" />
                    </div>
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Textarea placeholder="Подробное описание..." rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Фото (до 5 штук)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          id="premium-photos"
                          onChange={handlePhotoSelect}
                        />
                        <label htmlFor="premium-photos" className="cursor-pointer">
                          <Icon name="Image" size={40} className="mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-1">Нажмите для выбора фото</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG до 10MB каждое</p>
                        </label>
                      </div>
                      
                      {selectedPhotos.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          {selectedPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Icon name="X" size={16} />
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {(photo.size / 1024 / 1024).toFixed(1)} MB
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button className="w-full">Опубликовать Premium</Button>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Icon name="FileText" size={48} />
            <p>У вас пока нет объявлений</p>
            <Button variant="outline">Создать первое объявление</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}