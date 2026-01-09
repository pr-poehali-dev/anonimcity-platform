import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

export default function MyListingsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Мои объявления</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={16} />
                Создать объявление
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Создать объявление</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Tabs defaultValue="free">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="free">Бесплатное</TabsTrigger>
                    <TabsTrigger value="premium">Платное (Premium)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="free" className="space-y-4 mt-4">
                    <Input placeholder="Заголовок" />
                    <Textarea placeholder="Описание..." rows={4} />
                    <Button className="w-full">Опубликовать</Button>
                  </TabsContent>
                  <TabsContent value="premium" className="space-y-4 mt-4">
                    <Input placeholder="Заголовок" />
                    <Textarea placeholder="Описание..." rows={4} />
                    <Button className="w-full">Опубликовать Premium</Button>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Icon name="FileText" size={48} />
            <p>У вас пока нет объявлений</p>
            <Button variant="outline">Создать первое объявление</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
