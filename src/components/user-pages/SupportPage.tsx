import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { createSupportTicket, getSupportTickets } from '@/lib/api';

interface SupportPageProps {
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
}

export default function SupportPage({ generatedCredentials }: SupportPageProps) {
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    if (generatedCredentials?.user_id) {
      loadSupportTickets();
    }
  }, [generatedCredentials]);

  const loadSupportTickets = async () => {
    if (!generatedCredentials?.user_id) return;
    
    setLoadingTickets(true);
    try {
      const tickets = await getSupportTickets(generatedCredentials.user_id);
      setSupportTickets(tickets);
    } catch (error) {
      console.error('Failed to load support tickets:', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleSendSupportTicket = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error('Заполните все поля');
      return;
    }

    if (!generatedCredentials?.user_id) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    setIsSending(true);

    try {
      const result = await createSupportTicket(
        generatedCredentials.user_id,
        supportSubject,
        supportMessage
      );

      if (result.success) {
        toast.success('Обращение отправлено', {
          description: 'Поддержка ответит в ближайшее время',
        });
        setSupportSubject('');
        setSupportMessage('');
        loadSupportTickets();
      } else {
        toast.error('Ошибка отправки', {
          description: result.error || 'Попробуйте снова',
        });
      }
    } catch (error) {
      toast.error('Ошибка отправки', {
        description: 'Попробуйте снова',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Поддержка</h1>
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Связаться с поддержкой</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Тема обращения</Label>
                <Input 
                  placeholder="Кратко опишите проблему" 
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Сообщение</Label>
                <Textarea 
                  placeholder="Подробное описание проблемы..." 
                  rows={5}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                />
              </div>
              <Button 
                className="w-full gap-2"
                onClick={handleSendSupportTicket}
                disabled={isSending}
              >
                <Icon name={isSending ? "Loader2" : "Send"} size={16} className={isSending ? "animate-spin" : ""} />
                {isSending ? 'Отправка...' : 'Отправить'}
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Мои обращения</h2>
            {loadingTickets ? (
              <div className="flex justify-center py-8">
                <Icon name="Loader2" size={32} className="animate-spin text-primary" />
              </div>
            ) : supportTickets.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Icon name="Inbox" size={48} />
                  <p>У вас пока нет обращений</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {supportTickets.map((ticket) => (
                  <Card key={ticket.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{ticket.subject}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            ticket.status === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                            ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' :
                            'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                          }`}>
                            {ticket.status === 'new' ? 'Новое' : 
                             ticket.status === 'in_progress' ? 'В работе' : 
                             'Закрыто'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {ticket.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="Calendar" size={12} />
                          <span>{ticket.created_at}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <Icon name="HelpCircle" size={20} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Как работает анонимность?</h3>
                    <p className="text-sm text-muted-foreground">
                      Все пользователи работают под случайными идентификаторами, личные данные не собираются.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <Icon name="HelpCircle" size={20} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Как оплачивать услуги?</h3>
                    <p className="text-sm text-muted-foreground">
                      Платформа использует криптовалюту для обеспечения анонимности транзакций.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
