import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

interface Listing {
  id: number;
  title: string;
  price: string;
  category: string;
  status: 'active' | 'pending' | 'inactive';
  isPremium: boolean;
  createdAt: string;
  views: number;
  inquiries: number;
}

interface ModelProfileStatsProps {
  totalRevenue: number;
  listings: Listing[];
}

export default function ModelProfileStats({ totalRevenue, listings }: ModelProfileStatsProps) {
  return (
    <TabsContent value="stats" className="space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Общая выручка</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalRevenue.toLocaleString()} ₽</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Всего просмотров</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{listings.reduce((sum, l) => sum + l.views, 0)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Запросов получено</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{listings.reduce((sum, l) => sum + l.inquiries, 0)}</p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
