import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function MessagesPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Сообщения</h1>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Icon name="MessageSquare" size={48} />
            <p>У вас пока нет сообщений</p>
          </div>
        </Card>
      </div>
    </div>
  );
}