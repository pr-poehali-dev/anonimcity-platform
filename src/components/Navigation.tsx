import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onExistingLogin: (login: string, password: string) => void;
  onLogout: () => void;
}

export default function Navigation({ 
  isAuthenticated, 
  onLogin,
  onExistingLogin, 
  onLogout 
}: NavigationProps) {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const location = useLocation();

  const handleExistingLogin = () => {
    onExistingLogin(loginInput, passwordInput);
    setLoginDialogOpen(false);
    setLoginInput('');
    setPasswordInput('');
  };
  const menuItems = [
    { icon: 'FileText', label: 'Объявления', path: '/my-listings' },
    { icon: 'MessageSquare', label: 'Сообщения', path: '/messages' },
    { icon: 'Video', label: 'Вирт', path: '/virt' },
    { icon: 'ShoppingBag', label: 'Магазин', path: '/files' },
    { icon: 'Wallet', label: 'Кошелек', path: '/wallet' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-background" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Anonimcity
              </span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? 'default' : 'ghost'}
                    size="sm"
                    asChild
                    className="gap-2"
                  >
                    <Link to={item.path}>
                      <Icon name={item.icon as any} size={16} />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/settings">
                    <Icon name="Settings" size={18} />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/support">
                    <Icon name="HelpCircle" size={18} />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <Icon name="LogOut" size={16} />
                </Button>
              </>
            ) : (
              <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="LogIn" size={16} />
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Вход в аккаунт</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Логин</Label>
                      <Input 
                        placeholder="anon_xxxxxxxx" 
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Пароль</Label>
                      <Input 
                        type="password" 
                        placeholder="Введите пароль"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleExistingLogin} className="flex-1 gap-2">
                        <Icon name="LogIn" size={16} />
                        Войти
                      </Button>
                      <Button onClick={onLogin} variant="outline" className="flex-1 gap-2">
                        <Icon name="UserPlus" size={16} />
                        Создать новый
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
      </nav>

      {isAuthenticated && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border">
          <div className="grid grid-cols-5 gap-1 p-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center py-3 px-1 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon name={item.icon as any} size={24} />
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}