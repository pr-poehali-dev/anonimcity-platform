import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Listing } from '../AdminDialogs';

interface AdminListingsTabsProps {
  pendingListings: Listing[];
  activeListings: Listing[];
  openViewListing: (listing: Listing) => void;
  handleApprove: (id: number) => void;
  handleReject: (id: number) => void;
  openEditListing: (listing: Listing) => void;
  handleDeleteListing: (id: number) => void;
}

export default function AdminListingsTabs({
  pendingListings,
  activeListings,
  openViewListing,
  handleApprove,
  handleReject,
  openEditListing,
  handleDeleteListing,
}: AdminListingsTabsProps) {
  return (
    <>
      <TabsContent value="moderation" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Объявления на модерации ({pendingListings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingListings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Все объявления проверены</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingListings.map((listing) => (
                  <div key={listing.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">{listing.title}</h3>
                        {listing.type === 'premium' && (
                          <Badge variant="default" className="gap-1">
                            <Icon name="Crown" size={12} />
                            Премиум
                          </Badge>
                        )}
                        <Badge variant="outline">{listing.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{listing.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Автор: {listing.author} • {listing.created} • {listing.price.toLocaleString()} ₽
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => openViewListing(listing)}
                      >
                        <Icon name="Eye" size={14} />
                        Просмотр
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="gap-2"
                        onClick={() => handleApprove(listing.id)}
                      >
                        <Icon name="Check" size={14} />
                        Одобрить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="gap-2"
                        onClick={() => handleReject(listing.id)}
                      >
                        <Icon name="X" size={14} />
                        Отклонить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="listings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Все объявления ({activeListings.length} активных)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeListings.map((listing) => (
                <div key={listing.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold">{listing.title}</h3>
                      {listing.type === 'premium' && (
                        <Badge variant="default" className="gap-1">
                          <Icon name="Crown" size={12} />
                          Премиум
                        </Badge>
                      )}
                      <Badge variant="outline">{listing.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{listing.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Автор: {listing.author} • {listing.price.toLocaleString()} ₽
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => openViewListing(listing)}
                    >
                      <Icon name="Eye" size={14} />
                      Просмотр
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => openEditListing(listing)}
                    >
                      <Icon name="Edit" size={14} />
                      Редактировать
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="gap-2"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      <Icon name="Trash2" size={14} />
                      Удалить
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
