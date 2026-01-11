import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { createApplication } from '@/lib/api';

export default function ModelRegistrationDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [videoPrice, setVideoPrice] = useState('');
  const [audioPrice, setAudioPrice] = useState('');
  const [chatPrice, setChatPrice] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setUploadedPhoto(null);
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
      console.error('Ошибка доступа к микрофону:', error);
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const playAudio = () => {
    if (!audioBlob) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.onended = () => setIsPlaying(false);
      audio.play();
      audioRef.current = audio;
      setIsPlaying(true);
    }
  };

  const handleSubmit = async () => {
    if (!nickname || !age || !city) {
      toast({
        title: "Заполните обязательные поля",
        description: "Укажите псевдоним, возраст и город",
        variant: "destructive",
      });
      return;
    }

    if (!videoPrice && !audioPrice && !chatPrice) {
      toast({
        title: "Укажите цены",
        description: "Заполните хотя бы одну цену для услуг",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createApplication({
        name: nickname,
        age: parseInt(age),
        city,
        telegram: '',
        experience: `${gender}|video:${videoPrice}|audio:${audioPrice}|chat:${chatPrice}|desc:${description}|photo:${uploadedPhoto ? 'yes' : 'no'}|audio:${audioBlob ? 'yes' : 'no'}`
      });

      if (result.success) {
        toast({
          title: "Заявка отправлена!",
          description: "Администратор рассмотрит вашу заявку в течение 24 часов",
        });
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось отправить заявку",
          variant: "destructive",
        });
        return;
      }

      // Очищаем форму
      setNickname('');
      setAge('');
      setCity('');
      setVideoPrice('');
      setAudioPrice('');
      setChatPrice('');
      setDescription('');
      setUploadedPhoto(null);
      setAudioBlob(null);
      setRecordingTime(0);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить заявку. Попробуйте снова",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Icon name="Plus" size={16} />
          Стать моделью
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Регистрация как модель</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Псевдоним *</Label>
            <Input 
              placeholder="Например: Анна" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Возраст *</Label>
              <Input 
                type="number" 
                placeholder="25" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Город *</Label>
              <Input 
                placeholder="Москва" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Пол</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={gender === 'female' ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setGender('female')}
              >
                <Icon name="User" size={16} />
                Женщина
              </Button>
              <Button
                type="button"
                variant={gender === 'male' ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setGender('male')}
              >
                <Icon name="User" size={16} />
                Мужчина
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Фото профиля</Label>
            {!uploadedPhoto ? (
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Нажмите для загрузки фото</span>
                <span className="text-xs text-muted-foreground mt-1">JPG, PNG до 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            ) : (
              <div className="relative group">
                <img src={uploadedPhoto} alt="Profile" className="w-full h-40 object-cover rounded-lg" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={removePhoto}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Аудио приветствие (до 30 сек)</Label>
            {!audioBlob ? (
              <Button
                type="button"
                variant={isRecording ? 'destructive' : 'outline'}
                className="w-full gap-2"
                onClick={isRecording ? stopRecording : startRecording}
              >
                <Icon name={isRecording ? 'Square' : 'Mic'} size={16} />
                {isRecording ? `Остановить (${recordingTime}с)` : 'Записать аудио приветствие'}
              </Button>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={playAudio}
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="text-primary" />
                </Button>
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
          
          <div className="space-y-3">
            <Label>Предоставляемые услуги и цены (₽/мин)</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Видеозвонки" 
                  value={videoPrice}
                  onChange={(e) => setVideoPrice(e.target.value)}
                />
                <Icon name="Video" size={18} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Аудиозвонки" 
                  value={audioPrice}
                  onChange={(e) => setAudioPrice(e.target.value)}
                />
                <Icon name="Phone" size={18} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Переписка" 
                  value={chatPrice}
                  onChange={(e) => setChatPrice(e.target.value)}
                />
                <Icon name="MessageCircle" size={18} className="text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Описание услуг</Label>
            <Textarea 
              placeholder="Расскажите о себе и своих услугах..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Требования:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Возраст 18+</li>
                  <li>Стабильное интернет-соединение</li>
                  <li>Для видео/аудио: веб-камера и микрофон</li>
                </ul>
              </div>
            </div>
          </div>
          <Button 
            className="w-full gap-2" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Icon name={isSubmitting ? "Loader2" : "Send"} size={16} className={isSubmitting ? "animate-spin" : ""} />
            {isSubmitting ? "Отправка..." : "Отправить заявку"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}