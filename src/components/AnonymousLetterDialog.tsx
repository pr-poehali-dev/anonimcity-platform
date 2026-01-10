import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function AnonymousLetterDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [recipientGender, setRecipientGender] = useState<'female' | 'male'>('female');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!recipient || !message) {
      toast({
        title: "Заполните все поля",
        description: "Укажите получателя и текст письма",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const letter = {
        id: Date.now(),
        recipient,
        recipientGender,
        message,
        sentAt: new Date().toISOString(),
      };

      const existingLetters = JSON.parse(localStorage.getItem('anonymous_letters') || '[]');
      localStorage.setItem('anonymous_letters', JSON.stringify([...existingLetters, letter]));

      toast({
        title: "Письмо отправлено",
        description: `Анонимное письмо доставлено пользователю ${recipient}`,
      });

      setRecipient('');
      setMessage('');
      setOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить письмо. Попробуйте снова",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icon name="Mail" size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Mail" size={20} />
            Анонимное письмо
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">Полная анонимность</p>
                <p className="text-muted-foreground">Расскажи  о своей самой развратной фантазии. 
Поделись самым сокровенным секретом.  Никаких ограничений и табу нет .</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Получатель</Label>
            <div className="flex gap-3 mb-3">
              <Button
                type="button"
                variant={recipientGender === 'female' ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setRecipientGender('female')}
              >
                <Icon name="User" size={16} />
                Девушке
              </Button>
              <Button
                type="button"
                variant={recipientGender === 'male' ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setRecipientGender('male')}
              >
                <Icon name="User" size={16} />
                Мужчине
              </Button>
            </div>
            <Input
              placeholder="anon_xxxxxxxx"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Текст письма</Label>
            <Textarea
              placeholder="Напишите ваше анонимное сообщение..."
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {message.length} / 1000 символов
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSend}
              disabled={isSending}
              className="flex-1 gap-2"
            >
              <Icon name={isSending ? "Loader2" : "Send"} size={16} className={isSending ? "animate-spin" : ""} />
              {isSending ? "Отправка..." : "Отправить анонимно"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}