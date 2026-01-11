import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getWalletBalance, withdrawFromWallet } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import MarketplaceUploadDialog from './marketplace/MarketplaceUploadDialog';
import MarketplaceFilters from './marketplace/MarketplaceFilters';
import MarketplaceItemCard, { type MediaItem } from './marketplace/MarketplaceItemCard';

type ContentType = 'video' | 'photo' | 'audio';
type VideoGenre = 'Личное' | 'Жесткое' | 'Фистинг' | 'Золотой дождь' | 'Копро' | 'Износ' | 'Котики' | 'Молодое' | 'Извращения' | 'Инцест' | 'Публичное' | 'Стриптиз' | 'Классика' | 'Минет' | 'Анал' | 'Беременные' | 'Переодевания' | 'Геи' | 'Лесби' | 'Секс машины' | 'БДСМ' | 'Связывание' | 'Госпожа' | 'Унижение' | 'Подглядывание' | 'Скрытая камера' | 'Зоо';
type PhotoGenre = 'Портрет' | 'Ню' | 'Эротика' | 'Белье' | 'Косплей' | 'Фетиш' | 'Арт' | 'Студия' | 'Улица' | 'Природа';
type AudioGenre = 'ASMR' | 'Разговор' | 'Стоны' | 'Ролевая игра' | 'Истории' | 'Инструкции' | 'Фантазии' | 'Медитация';
type Genre = VideoGenre | PhotoGenre | AudioGenre;

interface MarketplacePageProps {
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
}

export default function MarketplacePage({ generatedCredentials }: MarketplacePageProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterGenre, setFilterGenre] = useState<Genre | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePurchase = async (itemId: string, price: number) => {
    if (!generatedCredentials?.user_id) {
      toast({
        title: "Ошибка",
        description: "Необходимо авторизоваться",
        variant: "destructive"
      });
      return;
    }

    setIsPurchasing(true);

    try {
      const balanceData = await getWalletBalance(generatedCredentials.user_id);
      const currentBalance = balanceData?.balance_rub || 0;

      if (currentBalance < price) {
        toast({
          title: "Недостаточно средств",
          description: `На балансе ${currentBalance} ₽, а нужно ${price} ₽`,
          variant: "destructive",
          action: {
            label: "Пополнить кошелек",
            onClick: () => navigate('/wallet')
          }
        });
        return;
      }

      const result = await withdrawFromWallet(generatedCredentials.user_id, price, 'RUB', `Покупка контента ${itemId}`);

      if (result.success) {
        toast({
          title: "Покупка успешна!",
          description: `Контент доступен в разделе "Покупки"`,
        });
      } else {
        toast({
          title: "Ошибка покупки",
          description: result.error || "Не удалось списать средства",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить покупку",
        variant: "destructive"
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const mockMediaItems: MediaItem[] = [
    {
      id: 'media_1735980000_abc123xyz',
      type: 'video',
      title: 'Приватное видео #1',
      description: 'Эксклюзивный контент',
      price: 500,
      preview: '🎬',
      author: 'user_1234',
      isPremium: true,
      duration: '5:30',
      genre: 'Личное'
    },
    {
      id: 'media_1735980100_def456uvw',
      type: 'photo',
      title: 'Фотосет "Вечер"',
      description: '15 фотографий',
      price: 200,
      preview: '📸',
      author: 'user_5678',
      isPremium: false,
      count: 15,
      genre: 'Эротика'
    },
    {
      id: 'media_1735980200_ghi789rst',
      type: 'audio',
      title: 'Голосовое сообщение',
      description: 'Приватная запись',
      price: 100,
      preview: '🎵',
      author: 'user_9012',
      isPremium: false,
      duration: '2:15',
      genre: 'ASMR'
    }
  ];
  
  const filteredItems = mockMediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesGenre = filterGenre === 'all' || item.genre === filterGenre;
    return matchesSearch && matchesType && matchesGenre;
  });

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Магазин контента</h1>
            <p className="text-muted-foreground mt-1">Покупайте и продавайте эксклюзивный контент</p>
          </div>
          <MarketplaceUploadDialog />
        </div>

        <Tabs defaultValue="marketplace" className="mb-6">
          <TabsList>
            <TabsTrigger value="marketplace">Магазин</TabsTrigger>
            <TabsTrigger value="my-content">Мой контент</TabsTrigger>
            <TabsTrigger value="purchases">Покупки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplace" className="mt-6">
            <MarketplaceFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              filterGenre={filterGenre}
              setFilterGenre={setFilterGenre}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MarketplaceItemCard
                  key={item.id}
                  item={item}
                  isPurchasing={isPurchasing}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-content" className="mt-6">
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Icon name="Package" size={48} />
                <p>У вас нет контента на продаже</p>
                <MarketplaceUploadDialog />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="mt-6">
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Icon name="ShoppingBag" size={48} />
                <p>У вас пока нет покупок</p>
                <Button variant="outline" asChild>
                  <a href="#marketplace">
                    <Icon name="Search" size={16} className="mr-2" />
                    Перейти в магазин
                  </a>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}