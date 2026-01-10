import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import type { Model } from './AdminContentTabs';

export interface Message {
  id: number;
  modelId: number;
  modelName: string;
  modelLogin: string;
  senderName: string;
  senderContact: string;
  listingTitle: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  reply?: string;
  repliedAt?: string;
}

interface AdminMessagesTabProps {
  models: Model[];
}

export default function AdminMessagesTab({ models }: AdminMessagesTabProps) {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      modelId: 1, 
      modelName: 'Анна М.', 
      modelLogin: 'anon_x7k2p9',
      senderName: 'Клиент А.',
      senderContact: '+7 (900) 111-22-33',
      listingTitle: 'Профессиональная фотосессия',
      message: 'Здравствуйте! Интересует фотосессия на следующей неделе. Возможна съемка в понедельник?',
      status: 'new',
      createdAt: '2024-01-10 15:30'
    },
    { 
      id: 2, 
      modelId: 1, 
      modelName: 'Анна М.', 
      modelLogin: 'anon_x7k2p9',
      senderName: 'Клиент Б.',
      senderContact: 'telegram: @client_b',
      listingTitle: 'Эскорт на мероприятие',
      message: 'Добрый день! Нужно сопровождение на корпоратив 25 января. Уточните стоимость.',
      status: 'read',
      createdAt: '2024-01-10 14:15'
    },
    { 
      id: 3, 
      modelId: 2, 
      modelName: 'Мария К.', 
      modelLogin: 'anon_m3n8q1',
      senderName: 'Клиент В.',
      senderContact: '+7 (900) 333-44-55',
      listingTitle: 'Видеосъемка для рекламы',
      message: 'Интересуют расценки на видеосъемку продолжительностью 3 часа.',
      status: 'replied',
      createdAt: '2024-01-10 13:00',
      reply: 'Здравствуйте! Стоимость 3-часовой съемки составит 60,000 руб. Подробности обсудим по телефону.',
      repliedAt: '2024-01-10 13:45'
    },
    { 
      id: 4, 
      modelId: 4, 
      modelName: 'Виктория С.', 
      modelLogin: 'anon_q2l8n3',
      senderName: 'Клиент Г.',
      senderContact: 'whatsapp: +79005556677',
      listingTitle: 'VIP эскорт услуги',
      message: 'Доброго времени! Интересует выезд в другой город. Работаете с командировками?',
      status: 'new',
      createdAt: '2024-01-10 12:20'
    },
    { 
      id: 5, 
      modelId: 1, 
      modelName: 'Анна М.', 
      modelLogin: 'anon_x7k2p9',
      senderName: 'Клиент Д.',
      senderContact: '+7 (900) 777-88-99',
      listingTitle: 'Профессиональная фотосессия',
      message: 'Здравствуйте! Можно записаться на фотосессию на эту пятницу?',
      status: 'replied',
      createdAt: '2024-01-10 11:10',
      reply: 'Добрый день! К сожалению, в пятницу все занято. Есть окно в субботу в 14:00. Подойдет?',
      repliedAt: '2024-01-10 11:45'
    },
  ]);

  const filteredMessages = selectedModel === 'all' 
    ? messages 
    : messages.filter(m => m.modelId === Number(selectedModel));

  const getStatusBadge = (status: Message['status']) => {
    const variants = {
      new: { variant: 'default' as const, label: 'Новое', icon: 'Mail' },
      read: { variant: 'secondary' as const, label: 'Прочитано', icon: 'MailOpen' },
      replied: { variant: 'outline' as const, label: 'Отвечено', icon: 'MailCheck' },
    };
    const { variant, label, icon } = variants[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon name={icon} size={10} />
        {label}
      </Badge>
    );
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    setReplyText(message.reply || '');
    
    if (message.status === 'new') {
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, status: 'read' as const } : m
      ));
    }
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите текст ответа",
        variant: "destructive"
      });
      return;
    }

    setMessages(messages.map(m => 
      m.id === selectedMessage.id 
        ? { 
            ...m, 
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
        : m
    ));

    toast({
      title: "Ответ отправлен",
      description: `Ваш ответ отправлен клиенту от имени ${selectedMessage.modelName}`,
    });

    setSelectedMessage(null);
    setReplyText('');
  };

  const newMessagesCount = messages.filter(m => m.status === 'new').length;

  return (
    <TabsContent value="messages" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Сообщения моделям</CardTitle>
              {newMessagesCount > 0 && (
                <Badge variant="destructive">{newMessagesCount} новых</Badge>
              )}
            </div>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все модели</SelectItem>
                {models.map(model => (
                  <SelectItem key={model.id} value={String(model.id)}>
                    {model.avatar} {model.name} ({model.login})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* Список сообщений */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="MailOpen" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Нет сообщений</p>
                </div>
              ) : (
                filteredMessages.map(message => (
                  <div
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{models.find(m => m.id === message.modelId)?.avatar}</span>
                        <div>
                          <p className="font-semibold text-sm">{message.modelName}</p>
                          <p className="text-xs text-muted-foreground">{message.modelLogin}</p>
                        </div>
                      </div>
                      {getStatusBadge(message.status)}
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">
                        От: {message.senderName} • {message.senderContact}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        Объявление: {message.listingTitle}
                      </p>
                    </div>

                    <p className="text-sm line-clamp-2 mb-2">{message.message}</p>
                    
                    <p className="text-xs text-muted-foreground">
                      {message.createdAt}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Детали сообщения и ответ */}
            <div>
              {selectedMessage ? (
                <div className="border rounded-lg p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{models.find(m => m.id === selectedMessage.modelId)?.avatar}</span>
                      <div>
                        <h3 className="font-bold">{selectedMessage.modelName}</h3>
                        <p className="text-sm text-muted-foreground">{selectedMessage.modelLogin}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="User" size={14} className="text-muted-foreground" />
                        <span className="font-semibold">От:</span>
                        <span>{selectedMessage.senderName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Phone" size={14} className="text-muted-foreground" />
                        <span className="font-semibold">Контакт:</span>
                        <span>{selectedMessage.senderContact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="FileText" size={14} className="text-muted-foreground" />
                        <span className="font-semibold">Объявление:</span>
                        <span>{selectedMessage.listingTitle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Clock" size={14} className="text-muted-foreground" />
                        <span className="font-semibold">Дата:</span>
                        <span>{selectedMessage.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2">Сообщение клиента:</h4>
                    <div className="bg-accent/50 p-3 rounded-lg mb-4">
                      <p className="text-sm">{selectedMessage.message}</p>
                    </div>

                    {selectedMessage.reply && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Ваш ответ:</h4>
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <p className="text-sm mb-2">{selectedMessage.reply}</p>
                          <p className="text-xs text-muted-foreground">
                            Отправлено: {selectedMessage.repliedAt}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          {selectedMessage.reply ? 'Изменить ответ:' : 'Написать ответ:'}
                        </h4>
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Ответ от имени ${selectedMessage.modelName}...`}
                          rows={6}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSendReply} className="gap-2 flex-1">
                          <Icon name="Send" size={16} />
                          {selectedMessage.reply ? 'Обновить ответ' : 'Отправить ответ'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedMessage(null);
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
                  <p>Выберите сообщение для просмотра</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
