import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    activeListings: number;
    totalRevenue: number;
    pendingModeration: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon name="Users" size={16} />
            Всего пользователей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground mt-1">+42 за последний месяц</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon name="FileText" size={16} />
            Активные объявления
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.activeListings}</div>
          <p className="text-xs text-muted-foreground mt-1">+15 за последний месяц</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon name="Wallet" size={16} />
            Общий доход
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</div>
          <p className="text-xs text-muted-foreground mt-1">+23% за последний месяц</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon name="AlertCircle" size={16} />
            На модерации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-500">{stats.pendingModeration}</div>
          <p className="text-xs text-muted-foreground mt-1">Требуют внимания</p>
        </CardContent>
      </Card>
    </div>
  );
}
