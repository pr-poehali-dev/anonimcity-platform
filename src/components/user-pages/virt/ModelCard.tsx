import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { VirtModel } from './mockData';

interface ModelCardProps {
  model: VirtModel;
  serviceType?: 'video' | 'audio' | 'chat';
}

export default function ModelCard({ model, serviceType }: ModelCardProps) {
  const getPrice = () => {
    if (serviceType === 'video') return model.videoPrice;
    if (serviceType === 'audio') return model.audioPrice;
    if (serviceType === 'chat') return model.chatPrice;
    return model.videoPrice || model.audioPrice || model.chatPrice;
  };

  const getServiceIcon = () => {
    if (serviceType === 'video') return 'Video';
    if (serviceType === 'audio') return 'Phone';
    if (serviceType === 'chat') return 'MessageCircle';
    return 'Video';
  };

  const getServiceLabel = () => {
    if (serviceType === 'video') return 'Видеозвонок';
    if (serviceType === 'audio') return 'Аудиозвонок';
    if (serviceType === 'chat') return 'Написать';
    return 'Написать';
  };

  const price = getPrice();
  if (!price) return null;

  return (
    <Card key={`${model.id}-${serviceType}`} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl relative">
        {model.avatar}
        <div className="absolute top-3 right-3">
          <Badge className={model.status === 'online' ? 'bg-green-500 gap-1' : ''} variant={model.status === 'online' ? 'default' : 'secondary'}>
            {model.status === 'online' && <div className="w-2 h-2 bg-white rounded-full"></div>}
            {model.status === 'online' ? 'Online' : model.status === 'busy' ? 'Занята' : 'Offline'}
          </Badge>
        </div>
        {serviceType && (
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="bg-background/80 gap-1">
              <Icon name={getServiceIcon() as any} size={12} />
              {serviceType === 'video' ? 'Видео' : serviceType === 'audio' ? 'Аудио' : 'Чат'}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col h-full">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{model.name}, {model.age}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Icon name="MapPin" size={14} />
                {model.city}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Star" size={14} className="text-yellow-500" />
              <span className="font-medium">{model.rating}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{model.description}</p>

          <div className="flex flex-wrap gap-2">
            {model.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t mt-auto">
          <div className="flex items-center gap-1">
            <Icon name="Bitcoin" size={16} className="text-primary" />
            <span className="font-bold text-lg">{price} ₽/мин</span>
          </div>
          <Button 
            size="sm" 
            className="gap-2" 
            disabled={model.status !== 'online'}
            onClick={() => window.location.href = '/messages'}
          >
            <Icon name="MessageCircle" size={14} />
            Написать
          </Button>
        </div>
      </div>
    </Card>
  );
}