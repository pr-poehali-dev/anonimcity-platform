import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function MyListingsPage() {
  const { toast } = useToast();
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.slice(0, 5);
    setSelectedPhotos(validFiles);
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
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
        if (blob.size <= 1024 * 1024) {
          setAudioBlob(blob);
        } else {
          toast({
            title: "Файл слишком большой",
            description: "Аудио не должно превышать 1MB",
            variant: "destructive"
          });
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
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
        title: "Ошибка доступа к микрофону",
        description: "Разрешите доступ к микрофону",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= 1024 * 1024) {
        setAudioBlob(file);
      } else {
        toast({
          title: "Файл слишком большой",
          description: "Аудио не должно превышать 1MB",
          variant: "destructive"
        });
      }
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать объявление</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pb-4">
                <Tabs defaultValue="free">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="free">Бесплатное</TabsTrigger>
                    <TabsTrigger value="premium">Платное (Premium)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="free" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Псевдоним</Label>
                        <Input placeholder="Например: Анна" />
                      </div>
                      <div className="space-y-2">
                        <Label>Пол</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Женский</SelectItem>
                            <SelectItem value="male">Мужской</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Возраст</Label>
                        <Input type="number" placeholder="25" />
                      </div>
                      <div className="space-y-2">
                        <Label>Город</Label>
                        <Input placeholder="Москва" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input placeholder="Краткое описание услуги" />
                    </div>
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Textarea placeholder="Подробное описание..." rows={4} />
                    </div>
                    <Button className="w-full">Опубликовать</Button>
                  </TabsContent>
                  <TabsContent value="premium" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Псевдоним</Label>
                        <Input placeholder="Например: Анна" />
                      </div>
                      <div className="space-y-2">
                        <Label>Пол</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Женский</SelectItem>
                            <SelectItem value="male">Мужской</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Возраст</Label>
                        <Input type="number" placeholder="25" />
                      </div>
                      <div className="space-y-2">
                        <Label>Город</Label>
                        <Input placeholder="Москва" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input placeholder="Краткое описание услуги" />
                    </div>
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Textarea placeholder="Подробное описание..." rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Фото (до 5 штук)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          id="premium-photos"
                          onChange={handlePhotoSelect}
                        />
                        <label htmlFor="premium-photos" className="cursor-pointer">
                          <Icon name="Image" size={40} className="mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-1">Нажмите для выбора фото</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG до 10MB каждое</p>
                        </label>
                      </div>
                      
                      {selectedPhotos.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          {selectedPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Icon name="X" size={16} />
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {(photo.size / 1024 / 1024).toFixed(1)} MB
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Аудиоприветствие (до 30 сек, макс 1MB)</Label>
                      <div className="flex gap-2">
                        {!audioBlob ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 gap-2"
                              onClick={isRecording ? stopRecording : startRecording}
                            >
                              <Icon name={isRecording ? "Square" : "Mic"} size={18} />
                              {isRecording ? `Остановить (${recordingTime}с)` : 'Записать'}
                            </Button>
                            <div className="relative">
                              <input
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                id="audio-file"
                                onChange={handleAudioFileSelect}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() => document.getElementById('audio-file')?.click()}
                              >
                                <Icon name="Upload" size={18} />
                                Загрузить
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-2">
                                <Icon name="Music" size={18} className="text-primary" />
                                <span className="text-sm">Аудио: {(audioBlob.size / 1024).toFixed(0)} KB</span>
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
                            <audio
                              controls
                              src={URL.createObjectURL(audioBlob)}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>
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