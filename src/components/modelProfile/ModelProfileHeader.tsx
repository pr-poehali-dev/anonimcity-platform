import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { Model } from '@/components/admin/tabs/AdminContentTabs';

interface ModelProfileHeaderProps {
  model: Model;
}

export default function ModelProfileHeader({ model }: ModelProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl flex-shrink-0">
            {model.avatar}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{model.name}</h1>
              {model.verified && (
                <Badge variant="default" className="gap-1">
                  <Icon name="CheckCircle" size={12} />
                  Verified
                </Badge>
              )}
              <Badge variant="outline">{model.login}</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="MapPin" size={16} />
                <span>{model.city || 'Не указан'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Calendar" size={16} />
                <span>{model.age ? `${model.age} лет` : 'Не указан'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="FileText" size={16} />
                <span>{model.listingsCount} объявлений</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="DollarSign" size={16} />
                <span>{model.totalRevenue.toLocaleString()} ₽</span>
              </div>
            </div>

            {model.bio && (
              <p className="text-muted-foreground mt-4">{model.bio}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              {model.phone && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Icon name="Phone" size={14} />
                  {model.phone}
                </Button>
              )}
              {model.telegram && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Icon name="Send" size={14} />
                  {model.telegram}
                </Button>
              )}
              {model.whatsapp && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Icon name="MessageCircle" size={14} />
                  WhatsApp
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
