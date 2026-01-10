import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CallControlsProps {
  type: 'video' | 'audio';
  modelName: string;
  onEndCall: () => void;
}

export default function CallControls({ type, modelName, onEndCall }: CallControlsProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCall();
    return () => {
      stopCall();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isConnected]);

  const startCall = async () => {
    try {
      const constraints = type === 'video'
        ? { video: true, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current && type === 'video') {
        videoRef.current.srcObject = stream;
      }

      setIsConnected(true);
      toast({
        title: "Звонок начат",
        description: `Соединение с ${modelName}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка доступа",
        description: "Не удалось получить доступ к камере или микрофону",
        variant: "destructive",
      });
    }
  };

  const stopCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsConnected(false);
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        toast({
          title: audioTrack.enabled ? "Микрофон включен" : "Микрофон выключен",
        });
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current && type === 'video') {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        toast({
          title: videoTrack.enabled ? "Камера включена" : "Камера выключена",
        });
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Запись остановлена" : "Запись начата",
      description: isRecording ? "Аудио сохранено" : "Начата запись аудио",
    });
  };

  const handleEndCall = () => {
    stopCall();
    onEndCall();
    toast({
      title: "Звонок завершен",
      description: `Длительность: ${formatTime(callDuration)}`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Статус звонка */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="User" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{modelName}</h3>
                <Badge variant={isConnected ? "default" : "secondary"} className="gap-1">
                  {isConnected ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Подключено
                    </>
                  ) : (
                    <>
                      <Icon name="Loader2" size={10} className="animate-spin" />
                      Подключение...
                    </>
                  )}
                </Badge>
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {formatTime(callDuration)}
            </div>
          </div>

          {/* Видео превью */}
          {type === 'video' && (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <Icon name="VideoOff" size={64} className="text-white/50" />
                </div>
              )}
              {isRecording && (
                <Badge className="absolute top-4 right-4 gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  REC
                </Badge>
              )}
            </div>
          )}

          {/* Аудио индикатор */}
          {type === 'audio' && (
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <Icon name="Phone" size={64} className="mx-auto text-primary" />
                <p className="text-lg font-semibold">Аудиозвонок</p>
                {isRecording && (
                  <Badge className="gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Запись идет
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Элементы управления */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              size="lg"
              variant={isMuted ? "destructive" : "outline"}
              onClick={toggleMute}
              className="gap-2 rounded-full w-14 h-14 p-0"
            >
              <Icon name={isMuted ? "MicOff" : "Mic"} size={20} />
            </Button>

            {type === 'video' && (
              <Button
                size="lg"
                variant={isVideoOff ? "destructive" : "outline"}
                onClick={toggleVideo}
                className="gap-2 rounded-full w-14 h-14 p-0"
              >
                <Icon name={isVideoOff ? "VideoOff" : "Video"} size={20} />
              </Button>
            )}

            <Button
              size="lg"
              variant={isRecording ? "destructive" : "outline"}
              onClick={toggleRecording}
              className="gap-2 rounded-full w-14 h-14 p-0"
            >
              <Icon name={isRecording ? "Square" : "Circle"} size={20} />
            </Button>

            <Button
              size="lg"
              variant="destructive"
              onClick={handleEndCall}
              className="gap-2 rounded-full w-14 h-14 p-0"
            >
              <Icon name="PhoneOff" size={20} />
            </Button>
          </div>

          {/* Подсказки */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name={isMuted ? "MicOff" : "Mic"} size={14} />
              <span>Микрофон</span>
            </div>
            {type === 'video' && (
              <div className="flex items-center gap-2">
                <Icon name={isVideoOff ? "VideoOff" : "Video"} size={14} />
                <span>Камера</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Icon name="Circle" size={14} />
              <span>Запись</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="PhoneOff" size={14} />
              <span>Завершить</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
