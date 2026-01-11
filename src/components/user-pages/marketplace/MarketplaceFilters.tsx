import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

type ContentType = 'video' | 'photo' | 'audio';
type VideoGenre = 'Личное' | 'Жесткое' | 'Фистинг' | 'Золотой дождь' | 'Копро' | 'Износ' | 'Котики' | 'Молодое' | 'Извращения' | 'Инцест' | 'Публичное' | 'Стриптиз' | 'Классика' | 'Минет' | 'Анал' | 'Беременные' | 'Переодевания' | 'Геи' | 'Лесби' | 'Секс машины' | 'БДСМ' | 'Связывание' | 'Госпожа' | 'Унижение' | 'Подглядывание' | 'Скрытая камера' | 'Зоо';
type PhotoGenre = 'Портрет' | 'Ню' | 'Эротика' | 'Белье' | 'Косплей' | 'Фетиш' | 'Арт' | 'Студия' | 'Улица' | 'Природа';
type AudioGenre = 'ASMR' | 'Разговор' | 'Стоны' | 'Ролевая игра' | 'Истории' | 'Инструкции' | 'Фантазии' | 'Медитация';
type Genre = VideoGenre | PhotoGenre | AudioGenre;

interface MarketplaceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: ContentType | 'all';
  setFilterType: (type: ContentType | 'all') => void;
  filterGenre: Genre | 'all';
  setFilterGenre: (genre: Genre | 'all') => void;
}

const videoGenres: VideoGenre[] = ['Личное', 'Жесткое', 'Фистинг', 'Золотой дождь', 'Копро', 'Износ', 'Котики', 'Молодое', 'Извращения', 'Инцест', 'Публичное', 'Стриптиз', 'Классика', 'Минет', 'Анал', 'Беременные', 'Переодевания', 'Геи', 'Лесби', 'Секс машины', 'БДСМ', 'Связывание', 'Госпожа', 'Унижение', 'Подглядывание', 'Скрытая камера', 'Зоо'];
const photoGenres: PhotoGenre[] = ['Портрет', 'Ню', 'Эротика', 'Белье', 'Косплей', 'Фетиш', 'Арт', 'Студия', 'Улица', 'Природа'];
const audioGenres: AudioGenre[] = ['ASMR', 'Разговор', 'Стоны', 'Ролевая игра', 'Истории', 'Инструкции', 'Фантазии', 'Медитация'];

export default function MarketplaceFilters({ 
  searchQuery, 
  setSearchQuery, 
  filterType, 
  setFilterType, 
  filterGenre, 
  setFilterGenre 
}: MarketplaceFiltersProps) {
  const getGenresByType = (): Genre[] => {
    if (filterType === 'video') return videoGenres;
    if (filterType === 'photo') return photoGenres;
    if (filterType === 'audio') return audioGenres;
    return [...videoGenres, ...photoGenres, ...audioGenres];
  };

  const availableGenres = getGenresByType();

  return (
    <div className="mb-6 space-y-4">
      <Input 
        placeholder="Поиск контента..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm">Тип контента</Label>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as ContentType | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Все типы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="video">🎬 Видео</SelectItem>
              <SelectItem value="photo">📸 Фото</SelectItem>
              <SelectItem value="audio">🎵 Аудио</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm">Жанр</Label>
          <Select value={filterGenre} onValueChange={(v) => setFilterGenre(v as Genre | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Все жанры" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Все жанры</SelectItem>
              {availableGenres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {filterType !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            {filterType === 'video' ? '🎬 Видео' : filterType === 'photo' ? '📸 Фото' : '🎵 Аудио'}
            <button onClick={() => setFilterType('all')} className="ml-1">
              <Icon name="X" size={12} />
            </button>
          </Badge>
        )}
        {filterGenre !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            {filterGenre}
            <button onClick={() => setFilterGenre('all')} className="ml-1">
              <Icon name="X" size={12} />
            </button>
          </Badge>
        )}
        {(filterType !== 'all' || filterGenre !== 'all' || searchQuery) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setFilterType('all');
              setFilterGenre('all');
              setSearchQuery('');
            }}
            className="h-7 text-xs"
          >
            Сбросить все
          </Button>
        )}
      </div>
    </div>
  );
}