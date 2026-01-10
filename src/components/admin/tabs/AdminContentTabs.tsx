import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Category } from '../AdminDialogs';

interface AdminContentTabsProps {
  categories: Category[];
  openCategoryDialog: (category?: Category) => void;
  handleDeleteCategory: (id: number) => void;
}

interface Model {
  id: number;
  name: string;
  login: string;
  status: string;
  listingsCount: number;
  totalRevenue: number;
  avatar: string;
  verified: boolean;
}

const mockModels: Model[] = [
  { id: 1, name: 'Анна М.', login: 'anon_x7k2p9', status: 'verified', listingsCount: 12, totalRevenue: 145000, avatar: '👩', verified: true },
  { id: 2, name: 'Мария К.', login: 'anon_m3n8q1', status: 'verified', listingsCount: 8, totalRevenue: 98000, avatar: '👱‍♀️', verified: true },
  { id: 3, name: 'Елена Р.', login: 'anon_p9k2m7', status: 'active', listingsCount: 5, totalRevenue: 67000, avatar: '👧', verified: false },
  { id: 4, name: 'Виктория С.', login: 'anon_q2l8n3', status: 'verified', listingsCount: 15, totalRevenue: 189000, avatar: '👩‍🦰', verified: true },
];

export default function AdminContentTabs({
  categories,
  openCategoryDialog,
  handleDeleteCategory,
}: AdminContentTabsProps) {
  const navigate = useNavigate();

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
          <CardHeader>
            <CardTitle>Модели на платформе ({mockModels.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                      {model.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{model.name}</h3>
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
                    <Button size="sm" variant="outline">
                      <Icon name="MoreVertical" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
