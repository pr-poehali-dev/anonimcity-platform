import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Category } from '../AdminDialogs';
import CreateModelDialog from '../dialogs/CreateModelDialog';
import { useToast } from '@/hooks/use-toast';

export interface Model {
  id: number;
  name: string;
  login: string;
  status: string;
  listingsCount: number;
  totalRevenue: number;
  avatar: string;
  verified: boolean;
  gender?: 'female' | 'male';
  age?: number;
  city?: string;
  bio?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  createdByAdmin?: boolean;
}

interface AdminContentTabsProps {
  categories: Category[];
  openCategoryDialog: (category?: Category) => void;
  handleDeleteCategory: (id: number) => void;
  models: Model[];
  onCreateModel: (model: Omit<Model, 'id' | 'listingsCount' | 'totalRevenue'>) => void;
  onUpdateModel: (id: number, model: Omit<Model, 'id' | 'listingsCount' | 'totalRevenue'>) => void;
  onDeleteModel: (id: number) => void;
}

export default function AdminContentTabs({
  categories,
  openCategoryDialog,
  handleDeleteCategory,
  models,
  onCreateModel,
  onUpdateModel,
  onDeleteModel,
}: AdminContentTabsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createModelOpen, setCreateModelOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [showMyModels, setShowMyModels] = useState(false);

  const displayedModels = showMyModels 
    ? models.filter(m => m.createdByAdmin) 
    : models;

  const handleCreateModel = (modelData: Omit<Model, 'id' | 'listingsCount' | 'totalRevenue'>) => {
    if (editingModel) {
      onUpdateModel(editingModel.id, modelData);
      toast({
        title: "Модель обновлена",
        description: `Изменения для ${modelData.name} сохранены`,
      });
    } else {
      onCreateModel(modelData);
      toast({
        title: "Модель создана",
        description: `Аккаунт ${modelData.name} успешно создан`,
      });
    }
    setCreateModelOpen(false);
    setEditingModel(null);
  };

  const handleOpenCreateDialog = () => {
    setEditingModel(null);
    setCreateModelOpen(true);
  };

  const handleOpenEditDialog = (model: Model) => {
    setEditingModel(model);
    setCreateModelOpen(true);
  };

  const handleDeleteModelClick = (id: number, name: string) => {
    if (confirm(`Удалить модель ${name}? Все объявления этой модели также будут удалены.`)) {
      onDeleteModel(id);
      toast({
        title: "Модель удалена",
        description: `Аккаунт удален из системы`,
      });
    }
  };

  return (
    <>
      <TabsContent value="categories" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Категории услуг ({categories.length})</CardTitle>
            <Button onClick={() => openCategoryDialog()} className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name={category.icon as never} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.listingsCount} объявлений
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openCategoryDialog(category)}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="models" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>
                {showMyModels ? `Мои модели (${displayedModels.length})` : `Все модели (${models.length})`}
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={!showMyModels ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowMyModels(false)}
                >
                  Все
                </Button>
                <Button 
                  variant={showMyModels ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowMyModels(true)}
                  className="gap-2"
                >
                  <Icon name="UserCog" size={14} />
                  Мои
                </Button>
              </div>
            </div>
            <Button onClick={handleOpenCreateDialog} className="gap-2">
              <Icon name="Plus" size={16} />
              Создать модель
            </Button>
          </CardHeader>
          <CardContent>
            {displayedModels.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="UserCog" size={48} className="mx-auto mb-4 opacity-50" />
                <p>У вас пока нет созданных моделей</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayedModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                      {model.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{model.name}</h3>
                        {model.createdByAdmin && (
                          <Badge variant="secondary" className="gap-1" title="Создана вами">
                            <Icon name="UserCog" size={10} />
                          </Badge>
                        )}
                        {model.verified && (
                          <Badge variant="default" className="gap-1">
                            <Icon name="CheckCircle" size={10} />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{model.login}</p>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{model.listingsCount} объявлений</span>
                        <span>{model.totalRevenue.toLocaleString()} ₽</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/admin/model/${model.id}`)}
                    >
                      Профиль
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenEditDialog(model)}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteModelClick(model.id, model.name)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
                ))}\n              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <CreateModelDialog
        open={createModelOpen}
        onOpenChange={(open) => {
          setCreateModelOpen(open);
          if (!open) setEditingModel(null);
        }}
        onSubmit={handleCreateModel}
        editingModel={editingModel}
      />
    </>
  );
}