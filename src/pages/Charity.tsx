import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CharityProject {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  image: string;
  status: 'active' | 'completed';
}

interface CharityProps {
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

export default function Charity({ generatedCredentials }: CharityProps) {
  const { toast } = useToast();
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  const charityProjects: CharityProject[] = [];

  const handleDonation = (projectId: string) => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast({
        title: "Ошибка",
        description: "Укажите корректную сумму пожертвования",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Спасибо за поддержку!",
      description: `Ваше пожертвование ${donationAmount} ₽ принято`
    });

    setDonationAmount('');
    setCustomMessage('');
    setSelectedProject(null);
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Icon name="Heart" size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Благотворительность</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Поддержите важные проекты и помогите тем, кто нуждается в вашей помощи
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="HandHeart" size={24} />
                Быстрое пожертвование
              </CardTitle>
              <CardDescription>
                Сделайте разовое пожертвование на общий благотворительный фонд
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quick-amount">Сумма пожертвования (₽)</Label>
                <Input
                  id="quick-amount"
                  type="number"
                  placeholder="Введите сумму"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[100, 500, 1000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setDonationAmount(amount.toString())}
                  >
                    {amount} ₽
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Сообщение (необязательно)</Label>
                <Textarea
                  id="message"
                  placeholder="Оставьте пожелание или комментарий..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                className="w-full"
                onClick={() => handleDonation('general')}
                disabled={!donationAmount}
              >
                <Icon name="Heart" size={16} className="mr-2" />
                Отправить пожертвование
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" size={24} />
                О благотворительности
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Shield" size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Безопасность</h4>
                    <p className="text-sm text-muted-foreground">
                      Все транзакции защищены и анонимны
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="TrendingUp" size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Прозрачность</h4>
                    <p className="text-sm text-muted-foreground">
                      Отслеживайте куда идут средства
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Users" size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Сообщество</h4>
                    <p className="text-sm text-muted-foreground">
                      Присоединяйтесь к тысячам благотворителей
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {charityProjects.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Активные проекты</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {charityProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-6xl">{project.image}</span>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status === 'active' ? 'Активно' : 'Завершено'}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {project.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Собрано:</span>
                        <span className="font-medium">
                          {project.raised.toLocaleString()} ₽ из {project.goal.toLocaleString()} ₽
                        </span>
                      </div>
                      <Progress value={(project.raised / project.goal) * 100} />
                    </div>

                    {project.status === 'active' && (
                      <Button
                        className="w-full"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <Icon name="Heart" size={16} className="mr-2" />
                        Поддержать
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Icon name="Heart" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Нет активных проектов</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                В данный момент нет активных благотворительных проектов. Вы можете сделать общее пожертвование
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Sparkles" size={24} />
              Ваш вклад имеет значение
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Каждое пожертвование помогает изменить чью-то жизнь к лучшему. 
              Спасибо за вашу поддержку и доброту! ❤️
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
