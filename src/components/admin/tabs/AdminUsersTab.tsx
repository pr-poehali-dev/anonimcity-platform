import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminUsersTabProps {
  recentUsers: Array<{ id: number; login: string; registered: string; status: string }>;
}

export default function AdminUsersTab({ recentUsers }: AdminUsersTabProps) {
  return (
    <TabsContent value="users" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Последние пользователи</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Icon name="User" size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{user.login}</p>
                    <p className="text-sm text-muted-foreground">Регистрация: {user.registered}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Icon name="MoreVertical" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
