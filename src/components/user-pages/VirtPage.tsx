import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ModelCard from './virt/ModelCard';
import ModelRegistrationDialog from './virt/ModelRegistrationDialog';
import { mockModels } from './virt/mockData';

interface VirtPageProps {
  generatedCredentials: { login: string; password: string } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function VirtPage({ generatedCredentials }: VirtPageProps) {
  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Вирт</h1>
            <p className="text-muted-foreground mt-1">Приватное общение в разных форматах</p>
          </div>
          <ModelRegistrationDialog />
        </div>

        <Tabs defaultValue="video" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video" className="gap-2">
              <Icon name="Video" size={16} />
              <span className="hidden sm:inline">Видеозвонки</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="gap-2">
              <Icon name="Phone" size={16} />
              <span className="hidden sm:inline">Аудиозвонки</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <Icon name="MessageCircle" size={16} />
              <span className="hidden sm:inline">Переписка</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockModels
                .filter(m => m.services.includes('video'))
                .map(model => (
                  <ModelCard key={model.id} model={model} serviceType="video" />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockModels
                .filter(m => m.services.includes('audio'))
                .map(model => (
                  <ModelCard key={model.id} model={model} serviceType="audio" />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockModels
                .filter(m => m.services.includes('chat'))
                .map(model => (
                  <ModelCard key={model.id} model={model} serviceType="chat" />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
