import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { createListing } from '@/lib/api';

type Service = 'Секс Выезд' | 'Секс Апартаменты' | 'Ужин' | 'Вечеринка' | 'Виртуальный секс';
type ListingType = 'Индивидуалка' | 'Агенство';

const SERVICES: Service[] = ['Секс Выезд', 'Секс Апартаменты', 'Ужин', 'Вечеринка', 'Виртуальный секс'];

interface CreateListingProps {
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
}

export default function CreateListing({ generatedCredentials }: CreateListingProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<ListingType>('Индивидуалка');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleServiceToggle = (service: Service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить доступ к микрофону',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive",
      });
      return;
    }

    if (!generatedCredentials?.user_id) {
      toast({
        title: "Ошибка",
        description: "Необходимо авторизоваться",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createListing(generatedCredentials.user_id, {
        title,
        description,
        category: type,
        price: price ? parseFloat(price) : undefined,
        currency: 'RUB',
        location: 'Москва',
        images: uploadedImages,
      });

      if (result.success) {
        toast({
          title: "Объявление создано",
          description: "Ваше объявление опубликовано",
        });
        navigate('/my-listings');
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось создать объявление",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать объявление",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Plus" size={24} />
              Создать объявление
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок *</Label>
                <Input
                  id="title"
                  placeholder="Краткое описание услуги"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  placeholder="Подробное описание услуги, условия, особенности..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена</Label>
                <Input
                  id="price"
                  placeholder="Например: 5000 ₽/час"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Тип</Label>
                <RadioGroup value={type} onValueChange={(value) => setType(value as ListingType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Индивидуалка" id="individual" />
                    <Label htmlFor="individual" className="cursor-pointer">Индивидуалка</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Агенство" id="agency" />
                    <Label htmlFor="agency" className="cursor-pointer">Агенство</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Услуги</Label>
                <div className="space-y-2">
                  {SERVICES.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={service} className="cursor-pointer font-normal">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-accent/10">
                <Checkbox
                  id="premium"
                  checked={isPremium}
                  onCheckedChange={(checked) => setIsPremium(checked as boolean)}
                />
                <Label htmlFor="premium" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Icon name="Crown" size={18} className="text-yellow-500" />
                    <span>Премиум объявление (500 ₽)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Выделенное размещение в топе списка
                  </p>
                </Label>
              </div>

              {isPremium && (
                <div className="space-y-4 p-4 border rounded-lg bg-primary/5">
                  <div className="space-y-2">
                    <Label>Фотографии</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      ))}
                      {uploadedImages.length < 5 && (
                        <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <Icon name="Plus" size={20} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-1">Добавить</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Максимум 5 фотографий</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Голосовое приветствие (до 30 сек)</Label>
                    {!audioBlob ? (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={isRecording ? 'destructive' : 'outline'}
                          className="flex-1 gap-2"
                          onClick={isRecording ? stopRecording : startRecording}
                        >
                          <Icon name={isRecording ? 'Square' : 'Mic'} size={16} />
                          {isRecording ? `Остановить (${recordingTime}с)` : 'Записать аудио'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                        <Icon name="CheckCircle" size={20} className="text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Аудио записано</p>
                          <p className="text-xs text-muted-foreground">{recordingTime} секунд</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeAudio}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 gap-2" disabled={isSubmitting}>
                  <Icon name={isSubmitting ? "Loader2" : "Send"} size={16} className={isSubmitting ? "animate-spin" : ""} />
                  {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}