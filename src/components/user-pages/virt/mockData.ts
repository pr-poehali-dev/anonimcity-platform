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

export const mockModels: VirtModel[] = [];