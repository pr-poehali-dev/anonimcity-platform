import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type ContentType = 'video' | 'photo' | 'audio';
type VideoGenre = 'Личное' | 'Жесткое' | 'Фистинг' | 'Золотой дождь' | 'Копро' | 'Износ' | 'Котики' | 'Молодое' | 'Извращения' | 'Инцест' | 'Публичное' | 'Стриптиз' | 'Классика' | 'Минет' | 'Анал' | 'Беременные' | 'Переодевания' | 'Геи' | 'Лесби' | 'Секс машины' | 'БДСМ' | 'Связывание' | 'Госпожа' | 'Унижение' | 'Подглядывание' | 'Скрытая камера' | 'Зоо';
type PhotoGenre = 'Портрет' | 'Ню' | 'Эротика' | 'Белье' | 'Косплей' | 'Фетиш' | 'Арт' | 'Студия' | 'Улица' | 'Природа';
type AudioGenre = 'ASMR' | 'Разговор' | 'Стоны' | 'Ролевая игра' | 'Истории' | 'Инструкции' | 'Фантазии' | 'Медитация';
type Genre = VideoGenre | PhotoGenre | AudioGenre;

export interface MediaItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  price: number;
  preview: string;
  author: string;
  isPremium: boolean;
  duration?: string;
  count?: number;
  genre?: Genre;
}

interface MarketplaceItemCardProps {
  item: MediaItem;
  isPurchasing: boolean;
  onPurchase: (itemId: string, price: number) => void;
}

export default function MarketplaceItemCard({ item, isPurchasing, onPurchase }: MarketplaceItemCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl">
        {item.preview}
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{item.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{item.description}</p>
          </div>
          {item.isPremium && (
            <Icon name="Crown" size={18} className="text-yellow-500 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <Icon name="User" size={14} />
            <span>{item.author}</span>
          </div>
          {item.duration && (
            <>
              <span>•</span>
              <Icon name="Clock" size={14} />
              <span>{item.duration}</span>
            </>
          )}
          {item.count && (
            <>
              <span>•</span>
              <Icon name="Image" size={14} />
              <span>{item.count}</span>
            </>
          )}
        </div>
        
        {item.genre && (
          <Badge variant="outline" className="text-xs">
            {item.genre}
          </Badge>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <Icon name="Bitcoin" size={16} className="text-primary" />
            <span className="font-bold text-lg">{item.price} ₽</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Icon name="ShoppingCart" size={14} />
                Купить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Покупка контента</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">ID:</span>
                    <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Цена:</span>
                    <span className="font-bold text-xl">{item.price} ₽</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">После покупки контент будет доступен в разделе "Покупки"</p>
                </div>
                <Button 
                  className="w-full gap-2"
                  onClick={() => onPurchase(item.id, item.price)}
                  disabled={isPurchasing}
                >
                  <Icon name={isPurchasing ? "Loader2" : "Lock"} size={16} className={isPurchasing ? "animate-spin" : ""} />
                  {isPurchasing ? 'Оплата...' : `Оплатить ${item.price} ₽`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}