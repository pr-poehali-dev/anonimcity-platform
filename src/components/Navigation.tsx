import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  isAuthenticated: boolean;
  currentPage: string;
  setCurrentPage: (page: 'home' | 'listings' | 'my-listings' | 'messages' | 'profile' | 'wallet' | 'support' | 'settings') => void;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navigation({ 
  isAuthenticated, 
  currentPage, 
  setCurrentPage, 
  onLogin, 
  onLogout 
}: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-background" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Anonimcity
            </span>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {[
                { icon: 'Home', label: 'Главная', page: 'home' },
                { icon: 'Grid', label: 'Объявления', page: 'listings' },
                { icon: 'FileText', label: 'Мои объявления', page: 'my-listings' },
                { icon: 'MessageSquare', label: 'Сообщения', page: 'messages' },
                { icon: 'Wallet', label: 'Кошелек', page: 'wallet' }
              ].map((item) => (
                <Button
                  key={item.page}
                  variant={currentPage === item.page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(item.page as any)}
                  className="gap-2"
                >
                  <Icon name={item.icon as any} size={16} />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage('settings')}>
                  <Icon name="Settings" size={18} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage('support')}>
                  <Icon name="HelpCircle" size={18} />
                </Button>
                <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
                  <Icon name="LogOut" size={16} />
                  Выход
                </Button>
              </>
            ) : (
              <Button onClick={onLogin} className="gap-2">
                <Icon name="UserPlus" size={16} />
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
