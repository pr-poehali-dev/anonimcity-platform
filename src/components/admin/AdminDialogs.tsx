import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  listingsCount: number;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  author: string;
  created: string;
  type: 'premium' | 'regular';
  category: string;
  price: number;
  status: 'pending' | 'active' | 'rejected';
}

interface AdminDialogsProps {
  categoryDialog: boolean;
  setCategoryDialog: (value: boolean) => void;
  editingCategory: Category | null;
  newCategory: { name: string; description: string; icon: string };
  setNewCategory: (value: { name: string; description: string; icon: string }) => void;
  handleAddCategory: () => void;
  handleEditCategory: () => void;
  
  listingDialog: boolean;
  setListingDialog: (value: boolean) => void;
  editingListing: Listing | null;
  setEditingListing: (value: Listing | null) => void;
  handleSaveListing: () => void;
  
  viewDialog: boolean;
  setViewDialog: (value: boolean) => void;
  viewingListing: Listing | null;
  handleApprove: (id: number) => void;
  handleReject: (id: number) => void;
}

export default function AdminDialogs({
  categoryDialog,
  setCategoryDialog,
  editingCategory,
  newCategory,
  setNewCategory,
  handleAddCategory,
  handleEditCategory,
  listingDialog,
  setListingDialog,
  editingListing,
  setEditingListing,
  handleSaveListing,
  viewDialog,
  setViewDialog,
  viewingListing,
  handleApprove,
  handleReject,
}: AdminDialogsProps) {
  return (
    <>
      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Измените параметры категории' : 'Создайте новую категорию услуг'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Название категории</Label>
              <Input
                id="name"
                placeholder="Эскорт услуги"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                placeholder="Краткое описание категории"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="icon">Иконка (Lucide название)</Label>
              <Input
                id="icon"
                placeholder="Users, Heart, Camera..."
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialog(false)}>
              Отмена
            </Button>
            <Button onClick={editingCategory ? handleEditCategory : handleAddCategory}>
              {editingCategory ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={listingDialog} onOpenChange={setListingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать объявление</DialogTitle>
            <DialogDescription>
              Внесите изменения в объявление
            </DialogDescription>
          </DialogHeader>
          {editingListing && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={editingListing.title}
                  onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={editingListing.description}
                  onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Цена (₽)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingListing.price}
                    onChange={(e) => setEditingListing({ ...editingListing, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Input
                    id="category"
                    value={editingListing.category}
                    onChange={(e) => setEditingListing({ ...editingListing, category: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setListingDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveListing}>
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Просмотр объявления</DialogTitle>
          </DialogHeader>
          {viewingListing && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <h2 className="text-xl font-bold">{viewingListing.title}</h2>
                    {viewingListing.type === 'premium' && (
                      <Badge variant="default" className="gap-1">
                        <Icon name="Crown" size={14} />
                        Премиум
                      </Badge>
                    )}
                    <Badge 
                      variant={
                        viewingListing.status === 'active' ? 'default' : 
                        viewingListing.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {viewingListing.status === 'active' ? 'Активно' : 
                       viewingListing.status === 'pending' ? 'На модерации' : 
                       'Отклонено'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Категория</p>
                        <div className="flex items-center gap-2">
                          <Icon name="Tag" size={16} className="text-primary" />
                          <p className="font-medium">{viewingListing.category}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Цена</p>
                        <div className="flex items-center gap-2">
                          <Icon name="Wallet" size={16} className="text-primary" />
                          <p className="font-medium text-xl">{viewingListing.price.toLocaleString()} ₽</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Автор</p>
                        <div className="flex items-center gap-2">
                          <Icon name="User" size={16} className="text-primary" />
                          <p className="font-medium">{viewingListing.author}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Дата создания</p>
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} className="text-primary" />
                          <p className="font-medium">{viewingListing.created}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Описание</p>
                    <p className="text-base leading-relaxed">{viewingListing.description}</p>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <p className="text-sm text-muted-foreground mb-3">Дополнительная информация</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={16} className="text-muted-foreground" />
                        <span>Москва, Россия</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={16} className="text-muted-foreground" />
                        <span>Доступно 24/7</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Shield" size={16} className="text-muted-foreground" />
                        <span>Проверенный профиль</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Star" size={16} className="text-muted-foreground" />
                        <span>Рейтинг: 4.8/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {viewingListing.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 gap-2"
                    onClick={() => {
                      handleApprove(viewingListing.id);
                      setViewDialog(false);
                    }}
                  >
                    <Icon name="Check" size={16} />
                    Одобрить объявление
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => {
                      handleReject(viewingListing.id);
                      setViewDialog(false);
                    }}
                  >
                    <Icon name="X" size={16} />
                    Отклонить
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialog(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
