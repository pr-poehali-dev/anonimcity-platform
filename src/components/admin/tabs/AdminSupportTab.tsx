import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: number;
  userLogin: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
  response?: string;
  respondedAt?: string;
}

export default function AdminSupportTab() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const savedTickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    setTickets(savedTickets.sort((a: SupportTicket, b: SupportTicket) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const handleStatusChange = (ticketId: number, status: SupportTicket['status']) => {
    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? { ...t, status } : t
    );
    setTickets(updatedTickets);
    localStorage.setItem('support_tickets', JSON.stringify(updatedTickets));
    
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status });
    }

    toast({
      title: "Статус обновлен",
      description: `Обращение переведено в статус "${getStatusLabel(status)}"`,
    });
  };

  const handleSendResponse = () => {
    if (!selectedTicket || !response.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите текст ответа",
        variant: "destructive",
      });
      return;
    }

    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id 
        ? { 
            ...t, 
            status: 'resolved' as const,
            response: response,
            respondedAt: new Date().toISOString()
          } 
        : t
    );
    
    setTickets(updatedTickets);
    localStorage.setItem('support_tickets', JSON.stringify(updatedTickets));
    
    toast({
      title: "Ответ отправлен",
      description: `Ответ пользователю ${selectedTicket.userLogin} отправлен`,
    });

    setResponse('');
    setSelectedTicket(null);
  };

  const handleDeleteTicket = (ticketId: number) => {
    if (!confirm('Удалить это обращение?')) return;

    const updatedTickets = tickets.filter(t => t.id !== ticketId);
    setTickets(updatedTickets);
    localStorage.setItem('support_tickets', JSON.stringify(updatedTickets));

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(null);
    }

    toast({
      title: "Обращение удалено",
    });
  };

  const getStatusLabel = (status: SupportTicket['status']) => {
    const labels = {
      'new': 'Новое',
      'in-progress': 'В работе',
      'resolved': 'Решено',
    };
    return labels[status];
  };

  const getStatusVariant = (status: SupportTicket['status']) => {
    const variants = {
      'new': 'default' as const,
      'in-progress': 'secondary' as const,
      'resolved': 'outline' as const,
    };
    return variants[status];
  };

  const newTicketsCount = tickets.filter(t => t.status === 'new').length;
  const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  return (
    <TabsContent value="support" className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="AlertCircle" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newTicketsCount}</p>
                <p className="text-sm text-muted-foreground">Новых обращений</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-sm text-muted-foreground">В работе</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resolvedCount}</p>
                <p className="text-sm text-muted-foreground">Решено</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список обращений */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Headphones" size={20} />
              Обращения в поддержку ({tickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Обращений пока нет</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                      selectedTicket?.id === ticket.id ? 'bg-accent border-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{ticket.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          От: {ticket.userLogin}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {ticket.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={12} />
                      {new Date(ticket.createdAt).toLocaleString('ru-RU')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Детали обращения */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="MessageSquare" size={20} />
              Детали обращения
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedTicket ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="MousePointerClick" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Выберите обращение из списка</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={getStatusVariant(selectedTicket.status)} className="text-sm">
                      {getStatusLabel(selectedTicket.status)}
                    </Badge>
                    <div className="flex gap-2">
                      {selectedTicket.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(selectedTicket.id, 'in-progress')}
                          className="gap-1"
                        >
                          <Icon name="Clock" size={14} />
                          В работу
                        </Button>
                      )}
                      {selectedTicket.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                          className="gap-1"
                        >
                          <Icon name="CheckCircle" size={14} />
                          Решено
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTicket(selectedTicket.id)}
                        className="gap-1 text-destructive"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Тема:</p>
                      <p className="text-base font-semibold">{selectedTicket.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">От пользователя:</p>
                      <p className="text-base">{selectedTicket.userLogin}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Дата обращения:</p>
                      <p className="text-base">
                        {new Date(selectedTicket.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Сообщение:</p>
                    <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
                  </div>

                  {selectedTicket.response && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-primary mb-2">
                        <Icon name="Reply" size={14} className="inline mr-1" />
                        Ваш ответ:
                      </p>
                      <p className="whitespace-pre-wrap mb-2">{selectedTicket.response}</p>
                      {selectedTicket.respondedAt && (
                        <p className="text-xs text-muted-foreground">
                          Отправлено: {new Date(selectedTicket.respondedAt).toLocaleString('ru-RU')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {selectedTicket.status !== 'resolved' && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Ответ пользователю:</p>
                      <Textarea
                        placeholder="Введите ответ на обращение..."
                        rows={6}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                    <Button
                      onClick={handleSendResponse}
                      disabled={!response.trim()}
                      className="w-full gap-2"
                    >
                      <Icon name="Send" size={16} />
                      Отправить ответ
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
