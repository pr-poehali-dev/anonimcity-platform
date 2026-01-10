import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  sender: string;
  senderType: 'admin' | 'user';
  subject: string;
  preview: string;
  text: string;
  date: string;
  isRead: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Администрация Anonimcity',
      senderType: 'admin',
      subject: 'Добро пожаловать на платформу',
      preview: 'Здравствуйте! Благодарим за регистрацию на нашей платформе...',
      text: 'Здравствуйте! Благодарим за регистрацию на нашей платформе. Мы рады приветствовать вас в сообществе Anonimcity. Здесь вы можете безопасно размещать объявления и общаться с другими пользователями. Если у вас возникнут вопросы, обращайтесь в поддержку.',
      date: '2024-01-10 10:00',
      isRead: false,
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenMessage = (message: Message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
    setMessages(messages.map(m => m.id === message.id ? { ...m, isRead: true } : m));
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Сообщения</h1>
            {unreadCount > 0 && (
              <Badge variant="default">{unreadCount} новых</Badge>
            )}
          </div>
        </div>

        {messages.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Icon name="MessageSquare" size={48} />
              <p>У вас пока нет сообщений</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`p-4 cursor-pointer transition-colors hover:border-primary ${
                  !message.isRead ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => handleOpenMessage(message)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.senderType === 'admin' ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon 
                        name={message.senderType === 'admin' ? 'Shield' : 'User'} 
                        size={20} 
                        className={message.senderType === 'admin' ? 'text-primary' : 'text-muted-foreground'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">{message.sender}</h3>
                        {message.senderType === 'admin' && (
                          <Badge variant="default" className="gap-1">
                            <Icon name="Shield" size={10} />
                            Админ
                          </Badge>
                        )}
                        {!message.isRead && (
                          <Badge variant="secondary">Новое</Badge>
                        )}
                      </div>
                      <p className="font-medium text-sm mb-1">{message.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{message.preview}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {message.date}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedMessage?.senderType === 'admin' ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <Icon 
                  name={selectedMessage?.senderType === 'admin' ? 'Shield' : 'User'} 
                  size={20} 
                  className={selectedMessage?.senderType === 'admin' ? 'text-primary' : 'text-muted-foreground'}
                />
              </div>
              <div className="flex-1">
                <DialogTitle>{selectedMessage?.subject}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">{selectedMessage?.sender}</p>
                  {selectedMessage?.senderType === 'admin' && (
                    <Badge variant="default" className="gap-1">
                      <Icon name="Shield" size={10} />
                      Администрация
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border-b pb-3">
              <Icon name="Calendar" size={14} />
              <span>{selectedMessage?.date}</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-wrap">{selectedMessage?.text}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}