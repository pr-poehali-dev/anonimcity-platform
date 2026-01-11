import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadFileToS3 } from '@/lib/mediaUpload';

const generateId = () => `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function MarketplaceUploadDialog() {
  const { toast } = useToast();
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadPrice, setUploadPrice] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadTitle || !uploadDescription || !uploadPrice || !selectedFile) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля и выберите файл",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const cdnUrl = await uploadFileToS3(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      const newId = generateId();
      
      toast({
        title: "Контент загружен",
        description: `ID: ${newId}`,
      });

      setUploadTitle('');
      setUploadDescription('');
      setUploadPrice('');
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Не удалось загрузить файл",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Icon name="Upload" size={16} />
          Продать контент
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Загрузить контент на продажу</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Название</Label>
            <Input 
              placeholder="Например: Приватное видео" 
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea 
              placeholder="Краткое описание контента..." 
              rows={3}
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Цена (₽)</Label>
            <Input 
              type="number" 
              placeholder="500"
              value={uploadPrice}
              onChange={(e) => setUploadPrice(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label>Файл</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">Нажмите для выбора файла</p>
                    <p className="text-xs text-muted-foreground">Фото: JPG, PNG | Видео: MP4, MOV | Аудио: MP3, WAV</p>
                    <p className="text-xs text-muted-foreground mt-1">До 1GB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Загрузка...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <Button 
            className="w-full gap-2" 
            onClick={handleUpload}
            disabled={isUploading}
          >
            <Icon name="ShoppingBag" size={16} />
            {isUploading ? 'Загрузка...' : 'Выставить на продажу'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
