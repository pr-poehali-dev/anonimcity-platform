import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import type { Listing } from '../AdminDialogs';

export interface Response {
  id: number;
  listingId: number;
  listingTitle: string;
  listingAuthor: string;
  senderName: string;
  senderContact: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  reply?: string;
  repliedAt?: string;
}

interface AdminResponsesTabProps {
  listings: Listing[];
}

export default function AdminResponsesTab({ listings }: AdminResponsesTabProps) {
  const { toast } = useToast();
  const [selectedListing, setSelectedListing] = useState<string>('all');
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const [replyText, setReplyText] = useState('');

  const [responses, setResponses] = useState<Response[]>([
    {
      id: 1,
      listingId: 1,
      listingTitle: 'Премиум эскорт услуги',
      listingAuthor: 'anon_x7k2p9',
      senderName: 'Клиент Иванов',
      senderContact: '+7 (900) 123-45-67',
      message: 'Здравствуйте! Интересует VIP сопровождение на корпоративное мероприятие 20 января. Можете уточнить стоимость и условия?',
      status: 'new',
      createdAt: '2024-01-10 16:30'
    },
    {
      id: 2,
      listingId: 3,
      listingTitle: 'Выезд по городу',
      listingAuthor: 'anon_q2l8n3',
      senderName: 'Клиент Петров',
      senderContact: 'telegram: @petrov_client',
      message: 'Добрый день! Нужно сопровождение по Москве на 3 часа. Доступны ли вы в эту субботу?',
      status: 'read',
      createdAt: '2024-01-10 15:15'
    },
    {
      id: 3,
      listingId: 1,
      listingTitle: 'Премиум эскорт услуги',
      listingAuthor: 'anon_x7k2p9',
      senderName: 'Клиент Сидоров',
      senderContact: 'whatsapp: +79001234567',
      message: 'Интересует выезд в другой город. Работаете с командировками?',
      status: 'replied',
      createdAt: '2024-01-10 14:00',
      reply: 'Здравствуйте! Да, работаю с командировками. Стоимость обсуждается индивидуально. Свяжитесь со мной для деталей.',
      repliedAt: '2024-01-10 14:30'
    },
    {
      id: 4,
      listingId: 3,
      listingTitle: 'Выезд по городу',
      listingAuthor: 'anon_q2l8n3',
      senderName: 'Клиент Козлов',
      senderContact: '+7 (900) 999-88-77',
      message: 'Здравствуйте! Какие районы Москвы вы обслуживаете? Интересует СВАО.',
      status: 'new',
      createdAt: '2024-01-10 13:45'
    },
    {
      id: 5,
      listingId: 1,
      listingTitle: 'Премиум эскорт услуги',
      listingAuthor: 'anon_x7k2p9',
      senderName: 'Клиент Новиков',
      senderContact: 'telegram: @novikov_vip',
      message: 'Добрый вечер! Интересует сопровождение на бизнес-ужин. Есть ли у вас опыт таких мероприятий?',
      status: 'replied',
      createdAt: '2024-01-10 12:20',
      reply: 'Добрый день! Да, большой опыт работы на бизнес-мероприятиях. Напишите подробности по телеграм.',
      repliedAt: '2024-01-10 12:50'
    },
  ]);

  // Фильтруем ответы только для объявлений, созданных через админку
  const adminListingIds = (listings || []).filter(l => l.createdByAdmin).map(l => l.id);
  const responsesForAdminListings = responses.filter(r => adminListingIds.includes(r.listingId));

  const filteredResponses = selectedListing === 'all'
    ? responsesForAdminListings
    : responsesForAdminListings.filter(r => r.listingId === Number(selectedListing));

  const getStatusBadge = (status: Response['status']) => {
    const variants = {
      new: { variant: 'default' as const, label: 'Новый', icon: 'MessageSquare' },
      read: { variant: 'secondary' as const, label: 'Прочитан', icon: 'MessageSquareMore' },
      replied: { variant: 'outline' as const, label: 'Отвечено', icon: 'MessageSquareCheck' },
    };
    const { variant, label, icon } = variants[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon name={icon} size={10} />
        {label}
      </Badge>
    );
  };

  const handleSelectResponse = (response: Response) => {
    setSelectedResponse(response);
    setReplyText(response.reply || '');

    if (response.status === 'new') {
      setResponses(responses.map(r =>
        r.id === response.id ? { ...r, status: 'read' as const } : r
      ));
    }
  };

  const handleSendReply = () => {
    if (!selectedResponse || !replyText.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите текст ответа",
        variant: "destructive"
      });
      return;
    }

    setResponses(responses.map(r =>
      r.id === selectedResponse.id
        ? {
            ...r,
            status: 'replied' as const,
            reply: replyText,
            repliedAt: new Date().toLocaleString('ru-RU', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }).replace(',', '')
          }
        : r
    ));

    toast({
      title: "Ответ отправлен",
      description: `Ваш ответ отправлен клиенту на объявление "${selectedResponse.listingTitle}"`,
    });

    setSelectedResponse(null);
    setReplyText('');
  };

  const newResponsesCount = responsesForAdminListings.filter(r => r.status === 'new').length;

  // Получаем уникальные объявления для фильтра
  const adminListings = listings.filter(l => l.createdByAdmin && adminListingIds.includes(l.id));

  return (
    <TabsContent value="responses" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Ответы на объявления</CardTitle>
              {newResponsesCount > 0 && (
                <Badge variant="destructive">{newResponsesCount} новых</Badge>
              )}
            </div>
            <Select value={selectedListing} onValueChange={setSelectedListing}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все объявления</SelectItem>
                {adminListings.map(listing => (
                  <SelectItem key={listing.id} value={String(listing.id)}>
                    {listing.title} ({listing.author})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* Список ответов */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredResponses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Нет ответов на ваши объявления</p>
                </div>
              ) : (
                filteredResponses.map(response => (
                  <div
                    key={response.id}
                    onClick={() => handleSelectResponse(response)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedResponse?.id === response.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="FileEdit" size={14} className="text-muted-foreground" />
                          <p className="font-semibold text-sm">{response.listingTitle}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{response.listingAuthor}</p>
                      </div>
                      {getStatusBadge(response.status)}
                    </div>

                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">
                        От: {response.senderName} • {response.senderContact}
                      </p>
                    </div>

                    <p className="text-sm line-clamp-2 mb-2">{response.message}</p>

                    <p className="text-xs text-muted-foreground">
                      {response.createdAt}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Детали ответа */}
            <div>
              {selectedResponse ? (
                <div className="border rounded-lg p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                      <Icon name="FileEdit" size={20} className="text-primary" />
                      <div className="flex-1">
                        <h3 className="font-bold">{selectedResponse.listingTitle}</h3>
                        <p className="text-sm text-muted-foreground">{selectedResponse.listingAuthor}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="User" size={14} className="text-muted-foreground" />
                        <span className="font-semibold">От:</span>
                        <span>{selectedResponse.senderName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Phone" size={14} className="text-muted-foreground" />
                        <span className="font-semibold">Контакт:</span>
                        <span>{selectedResponse.senderContact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Clock" size={14} className="text-muted-foreground" />
                        <span className="font-semibold">Дата:</span>
                        <span>{selectedResponse.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2">Сообщение клиента:</h4>
                    <div className="bg-accent/50 p-3 rounded-lg mb-4">
                      <p className="text-sm">{selectedResponse.message}</p>
                    </div>

                    {selectedResponse.reply && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Ваш ответ:</h4>
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <p className="text-sm mb-2">{selectedResponse.reply}</p>
                          <p className="text-xs text-muted-foreground">
                            Отправлено: {selectedResponse.repliedAt}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          {selectedResponse.reply ? 'Изменить ответ:' : 'Написать ответ:'}
                        </h4>
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Ответ на объявление "${selectedResponse.listingTitle}"...`}
                          rows={6}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSendReply} className="gap-2 flex-1">
                          <Icon name="Send" size={16} />
                          {selectedResponse.reply ? 'Обновить ответ' : 'Отправить ответ'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedResponse(null);
                            setReplyText('');
                          }}
                        >
                          Закрыть
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-12 text-center text-muted-foreground">
                  <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Выберите ответ для просмотра</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}