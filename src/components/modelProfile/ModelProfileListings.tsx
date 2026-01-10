import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Listing {
  id: number;
  title: string;
  price: string;
  category: string;
  status: 'active' | 'pending' | 'inactive';
  isPremium: boolean;
  createdAt: string;
  views: number;
  inquiries: number;
}

interface ModelProfileListingsProps {
  listings: Listing[];
  onCreateListing: () => void;
  onEditListing: (id: number) => void;
  onDeleteListing: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onTogglePremium: (id: number) => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export default function ModelProfileListings({
  listings,
  onCreateListing,
  onEditListing,
  onDeleteListing,
  onToggleStatus,
  onTogglePremium,
  getStatusBadge,
}: ModelProfileListingsProps) {
  return (
    <TabsContent value="listings" className="space-y-4 mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Объявления модели ({listings.length})</CardTitle>
          <Button onClick={onCreateListing} className="gap-2">
            <Icon name="Plus" size={16} />
            Создать объявление
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{listing.title}</h3>
                      {listing.isPremium && (
                        <Badge variant="default" className="gap-1">
                          <Icon name="Star" size={10} />
                          Premium
                        </Badge>
                      )}
                      {getStatusBadge(listing.status)}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                      <span>{listing.category}</span>
                      <span>{listing.price}</span>
                      <span>Создано: {listing.createdAt}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size={12} />
                        {listing.views} просмотров
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="MessageSquare" size={12} />
                        {listing.inquiries} запросов
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleStatus(listing.id)}
                      title={listing.status === 'active' ? 'Деактивировать' : 'Активировать'}
                    >
                      <Icon name={listing.status === 'active' ? 'EyeOff' : 'Eye'} size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onTogglePremium(listing.id)}
                      title={listing.isPremium ? 'Убрать премиум' : 'Сделать премиум'}
                    >
                      <Icon name="Star" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditListing(listing.id)}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteListing(listing.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
