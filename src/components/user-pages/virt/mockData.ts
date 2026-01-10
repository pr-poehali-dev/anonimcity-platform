export interface VirtModel {
  id: string;
  name: string;
  age: number;
  city: string;
  status: 'online' | 'offline' | 'busy';
  rating: number;
  videoPrice?: number;
  audioPrice?: number;
  chatPrice?: number;
  avatar: string;
  description: string;
  tags: string[];
  services: ('video' | 'audio' | 'chat')[];
}

export const mockModels: VirtModel[] = [
  {
    id: '1',
    name: 'Анна',
    age: 24,
    city: 'Москва',
    status: 'online',
    rating: 4.8,
    videoPrice: 100,
    audioPrice: 60,
    chatPrice: 30,
    avatar: '👩',
    description: 'Приватные видеозвонки, аудио, переписка',
    tags: ['Видео', 'Аудио', 'Чат'],
    services: ['video', 'audio', 'chat']
  },
  {
    id: '2',
    name: 'Мария',
    age: 26,
    city: 'Санкт-Петербург',
    status: 'online',
    rating: 4.9,
    videoPrice: 150,
    audioPrice: 80,
    avatar: '👱‍♀️',
    description: 'Эксклюзивный видео и аудио контент',
    tags: ['Premium', 'Видео', 'Аудио'],
    services: ['video', 'audio']
  },
  {
    id: '3',
    name: 'Елена',
    age: 22,
    city: 'Новосибирск',
    status: 'busy',
    rating: 4.7,
    videoPrice: 80,
    chatPrice: 25,
    avatar: '🧑‍🦰',
    description: 'Видеозвонки и приятная переписка',
    tags: ['Видео', 'Чат'],
    services: ['video', 'chat']
  },
  {
    id: '4',
    name: 'София',
    age: 23,
    city: 'Казань',
    status: 'online',
    rating: 4.6,
    audioPrice: 50,
    chatPrice: 20,
    avatar: '👸',
    description: 'Аудиозвонки и переписка с голосовыми',
    tags: ['Аудио', 'Чат', 'Голосовые'],
    services: ['audio', 'chat']
  }
];
