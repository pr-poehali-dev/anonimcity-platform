import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export interface MediaFile {
  id: number;
  filename: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  size: number;
  uploadedBy: string;
  uploadedByLogin: string;
  uploadedAt: string;
  usedIn?: string;
}

export default function AdminFilesTab() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio'>('all');

  const [files] = useState<MediaFile[]>([
    {
      id: 1,
      filename: 'profile-photo-anna.jpg',
      type: 'image',
      url: 'https://cdn.poehali.dev/projects/demo/bucket/photos/profile-anna.jpg',
      size: 2458000,
      uploadedBy: 'Анна М.',
      uploadedByLogin: 'anon_x7k2p9',
      uploadedAt: '2024-01-10 14:30',
      usedIn: 'Профиль модели'
    },
    {
      id: 2,
      filename: 'listing-photo-escort.jpg',
      type: 'image',
      url: 'https://cdn.poehali.dev/projects/demo/bucket/listings/escort-premium.jpg',
      size: 3120000,
      uploadedBy: 'Анна М.',
      uploadedByLogin: 'anon_x7k2p9',
      uploadedAt: '2024-01-10 14:25',
      usedIn: 'Объявление: Премиум эскорт услуги'
    },
    {
      id: 3,
      filename: 'intro-video.mp4',
      type: 'video',
      url: 'https://cdn.poehali.dev/projects/demo/bucket/videos/intro-maria.mp4',
      size: 15680000,
      uploadedBy: 'Мария К.',
      uploadedByLogin: 'anon_m3n8q1',
      uploadedAt: '2024-01-10 13:15',
      usedIn: 'Профиль модели'
    },
    {
      id: 4,
      filename: 'voice-message.mp3',
      type: 'audio',
      url: 'https://cdn.poehali.dev/projects/demo/bucket/audio/voice-anna.mp3',
      size: 890000,
      uploadedBy: 'Анна М.',
      uploadedByLogin: 'anon_x7k2p9',
      uploadedAt: '2024-01-10 12:40',
      usedIn: 'Профиль модели'
    },
    {
      id: 5,
      filename: 'gallery-1.jpg',
      type: 'image',
      url: 'https://cdn.poehali.dev/projects/demo/bucket/gallery/victoria-1.jpg',
      size: 1950000,
      uploadedBy: 'Виктория С.',
      uploadedByLogin: 'anon_q2l8n3',
      uploadedAt: '2024-01-10 11:50',
      usedIn: 'Галерея профиля'
    },
    {
      id: 6,
      filename: 'gallery-2.jpg',
      type: 'image',
      url: 'https://cdn.poehali.dev/projects/demo/bucket/gallery/victoria-2.jpg',
      size: 2100000,
      uploadedBy: 'Виктория С.',
      uploadedByLogin: 'anon_q2l8n3',
      uploadedAt: '2024-01-10 11:48',
      usedIn: 'Галерея профиля'
    },
    {
      id: 7,
      filename: 'promo-video.mp4',
      type: 'video',
      url: 'https://cdn.poehali.dev/projects/demo/bucket/videos/promo-elena.mp4',
      size: 22400000,
      uploadedBy: 'Елена Р.',
      uploadedByLogin: 'anon_p9k2m7',
      uploadedAt: '2024-01-10 10:30',
      usedIn: 'Объявление: Выезд по городу'
    },
    {
      id: 8,
      filename: 'listing-cover.jpg',
      type: 'image',
      url: 'https://cdn.poehali.dev/projects/demo/bucket/listings/massage-cover.jpg',
      size: 1780000,
      uploadedBy: 'Мария К.',
      uploadedByLogin: 'anon_m3n8q1',
      uploadedAt: '2024-01-10 09:20',
      usedIn: 'Объявление: Расслабляющий массаж'
    },
  ]);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.uploadedByLogin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const getFileTypeIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return 'Image';
      case 'video': return 'Video';
      case 'audio': return 'Music';
    }
  };

  const getFileTypeBadge = (type: MediaFile['type']) => {
    const variants = {
      image: { variant: 'default' as const, label: 'Фото', icon: 'Image' },
      video: { variant: 'secondary' as const, label: 'Видео', icon: 'Video' },
      audio: { variant: 'outline' as const, label: 'Аудио', icon: 'Music' },
    };
    const { variant, label, icon } = variants[type];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon name={icon} size={10} />
        {label}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Ссылка скопирована",
      description: "URL файла скопирован в буфер обмена",
    });
  };

  const handleOpenFile = (url: string) => {
    window.open(url, '_blank');
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const imageCount = files.filter(f => f.type === 'image').length;
  const videoCount = files.filter(f => f.type === 'video').length;
  const audioCount = files.filter(f => f.type === 'audio').length;

  return (
    <TabsContent value="files" className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="HardDrive" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{files.length}</p>
                <p className="text-sm text-muted-foreground">Всего файлов</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Icon name="Image" size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{imageCount}</p>
                <p className="text-sm text-muted-foreground">Фото</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Icon name="Video" size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{videoCount}</p>
                <p className="text-sm text-muted-foreground">Видео</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Icon name="Music" size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{audioCount}</p>
                <p className="text-sm text-muted-foreground">Аудио</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и список файлов */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Загруженные файлы</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Общий размер: {formatFileSize(totalSize)}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                placeholder="Поиск файлов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[250px]"
              />
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="image">Фото</SelectItem>
                  <SelectItem value="video">Видео</SelectItem>
                  <SelectItem value="audio">Аудио</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="FileX" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Файлы не найдены</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  {/* Превью */}
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {file.type === 'image' ? (
                      <img 
                        src={file.url} 
                        alt={file.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-10 h-10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg></div>';
                        }}
                      />
                    ) : (
                      <Icon name={getFileTypeIcon(file.type)} size={32} className="text-muted-foreground" />
                    )}
                  </div>

                  {/* Информация о файле */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold truncate">{file.filename}</h3>
                      {getFileTypeBadge(file.type)}
                      <Badge variant="outline" className="gap-1">
                        <Icon name="HardDrive" size={10} />
                        {formatFileSize(file.size)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={14} />
                        <span>{file.uploadedBy} ({file.uploadedByLogin})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={14} />
                        <span>{file.uploadedAt}</span>
                      </div>
                      {file.usedIn && (
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={14} />
                          <span className="truncate">{file.usedIn}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground font-mono truncate">
                      {file.url}
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenFile(file.url)}
                      className="gap-2"
                    >
                      <Icon name="ExternalLink" size={14} />
                      Открыть
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyLink(file.url)}
                      className="gap-2"
                    >
                      <Icon name="Copy" size={14} />
                      Копировать
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
