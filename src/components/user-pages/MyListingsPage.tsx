import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { getListings, deleteListing } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface MyListingsPageProps {
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
}

export default function MyListingsPage({ generatedCredentials }: MyListingsPageProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (generatedCredentials?.user_id) {
      loadListings();
    }
  }, [generatedCredentials]);

  const loadListings = async () => {
    if (!generatedCredentials?.user_id) return;
    
    setIsLoading(true);
    try {
      const data = await getListings({ user_id: generatedCredentials.user_id });
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (listingId: number) => {
    if (!generatedCredentials?.user_id) return;
    
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) return;
    
    try {
      const result = await deleteListing(generatedCredentials.user_id, listingId);
      
      if (result.success) {
        toast({
          title: 'Успешно',
          description: 'Объявление удалено',
        });
        loadListings();
      } else {
        toast({
          title: 'Ошибка',
          description: result.error || 'Не удалось удалить объявление',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при удалении',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Мои объявления</h1>
          <Button className="gap-2" onClick={() => window.location.href = '/create-listing'}>
            <Icon name="Plus" size={16} />
            Создать объявление
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Загрузка объявлений...</p>
          </Card>
        ) : listings.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Icon name="FileText" size={48} />
              <p>У вас пока нет объявлений</p>
              <Button variant="outline" onClick={() => window.location.href = '/create-listing'}>
                Создать первое объявление
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Card key={listing.id} className="p-4">
                <div className="space-y-3">
                  {listing.images && listing.images.length > 0 && (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{listing.description}</p>
                  </div>
                  {listing.price && (
                    <p className="text-lg font-bold text-primary">
                      {listing.price} {listing.currency || 'RUB'}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="MapPin" size={12} />
                    <span>{listing.location || 'Не указано'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Calendar" size={12} />
                    <span>{new Date(listing.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Icon name="Eye" size={14} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}