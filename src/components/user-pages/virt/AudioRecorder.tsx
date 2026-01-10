import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AudioRecording {
  id: string;
  name: string;
  duration: number;
  url: string;
  createdAt: Date;
}

export default function AudioRecorder() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newRecording: AudioRecording = {
          id: Date.now().toString(),
          name: `Запись ${recordings.length + 1}`,
          duration: recordingTime,
          url: audioUrl,
          createdAt: new Date(),
        };

        setRecordings(prev => [newRecording, ...prev]);
        setRecordingTime(0);

        toast({
          title: "Запись сохранена",
          description: `Длительность: ${formatTime(recordingTime)}`,
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Запись начата",
        description: "Говорите в микрофон",
      });
    } catch (error) {
      toast({
        title: "Ошибка доступа",
        description: "Не удалось получить доступ к микрофону",
        variant: "destructive",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const playRecording = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (!recording) return;

    if (playingId === id) {
      audioRefs.current[id]?.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        audioRefs.current[playingId]?.pause();
      }

      if (!audioRefs.current[id]) {
        const audio = new Audio(recording.url);
        audio.onended = () => setPlayingId(null);
        audioRefs.current[id] = audio;
      }

      audioRefs.current[id].play();
      setPlayingId(id);
    }
  };

  const deleteRecording = (id: string) => {
    if (playingId === id) {
      audioRefs.current[id]?.pause();
      setPlayingId(null);
    }
    setRecordings(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Запись удалена",
    });
  };

  const downloadRecording = (recording: AudioRecording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `${recording.name}.webm`;
    a.click();
    toast({
      title: "Запись загружена",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Панель записи */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Mic" size={20} />
            Запись аудио с микрофона
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Индикатор записи */}
          <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              {isRecording ? (
                <>
                  <div className="relative">
                    <Icon name="Mic" size={48} className="mx-auto text-primary" />
                    {!isPaused && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold tabular-nums">{formatTime(recordingTime)}</p>
                    <Badge variant={isPaused ? "secondary" : "default"}>
                      {isPaused ? "Пауза" : "Запись идет"}
                    </Badge>
                  </div>
                </>
              ) : (
                <>
                  <Icon name="Mic" size={48} className="mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Нажмите кнопку для начала записи</p>
                </>
              )}
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="flex items-center justify-center gap-3">
            {!isRecording ? (
              <Button
                size="lg"
                onClick={startRecording}
                className="gap-2 rounded-full px-8"
              >
                <Icon name="Circle" size={20} className="text-red-500" />
                Начать запись
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={pauseRecording}
                  className="gap-2 rounded-full w-14 h-14 p-0"
                >
                  <Icon name={isPaused ? "Play" : "Pause"} size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={stopRecording}
                  className="gap-2 rounded-full w-14 h-14 p-0"
                >
                  <Icon name="Square" size={20} />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Список записей */}
      {recordings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Music" size={20} />
              Мои записи ({recordings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => playRecording(recording.id)}
                    className="rounded-full w-10 h-10 p-0 flex-shrink-0"
                  >
                    <Icon name={playingId === recording.id ? "Pause" : "Play"} size={16} />
                  </Button>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{recording.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{formatTime(recording.duration)}</span>
                      <span>•</span>
                      <span>{recording.createdAt.toLocaleString('ru-RU')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadRecording(recording)}
                      className="gap-2"
                    >
                      <Icon name="Download" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteRecording(recording.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
