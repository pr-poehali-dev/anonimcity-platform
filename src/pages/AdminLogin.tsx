import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onAdminLogin: (login: string, password: string) => void;
}

export default function AdminLogin({ onAdminLogin }: AdminLoginProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login || !password) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    const ADMIN_CREDENTIALS = {
      login: 'admin',
      password: 'admin123'
    };

    if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
      onAdminLogin(login, password);
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
            <Icon name="Shield" size={32} className="text-background" />
          </div>
          <CardTitle className="text-2xl">Панель администратора</CardTitle>
          <CardDescription>
            Вход доступен только администраторам платформы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Логин администратора</Label>
              <Input
                id="login"
                placeholder="admin"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full gap-2">
              <Icon name="LogIn" size={16} />
              Войти в панель
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full gap-2"
              onClick={() => navigate('/')}
            >
              <Icon name="ArrowLeft" size={16} />
              Вернуться на главную
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
