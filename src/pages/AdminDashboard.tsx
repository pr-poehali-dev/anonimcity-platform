import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AdminStats from '@/components/admin/AdminStats';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminDialogs, { type Category, type Listing } from '@/components/admin/AdminDialogs';
import CreateListingDialog from '@/components/admin/dialogs/CreateListingDialog';
import type { Model } from '@/components/admin/tabs/AdminContentTabs';

interface AdminDashboardProps {
  onAdminLogout: () => void;
}

export default function AdminDashboard({ onAdminLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats] = useState({
    totalUsers: 1247,
    activeListings: 342,
    totalRevenue: 125430,
    pendingModeration: 18,
    totalMessages: 5623,
    reportedContent: 7,
  });

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Эскорт услуги', description: 'Сопровождение на мероприятия', icon: 'Users', listingsCount: 142 },
    { id: 2, name: 'Виртуальное общение', description: 'Онлайн знакомства и общение', icon: 'MessageCircle', listingsCount: 89 },
    { id: 3, name: 'Массаж', description: 'Профессиональный массаж', icon: 'Heart', listingsCount: 56 },
    { id: 4, name: 'Фото/Видео услуги', description: 'Индивидуальный контент', icon: 'Camera', listingsCount: 55 },
  ]);

  const [listings, setListings] = useState<Listing[]>([
    { id: 1, title: 'Премиум эскорт услуги', description: 'VIP сопровождение', author: 'anon_x7k2p9', created: '2024-01-10 14:00', type: 'premium', category: 'Эскорт услуги', price: 15000, status: 'pending', createdByAdmin: true },
    { id: 2, title: 'Виртуальное общение', description: 'Приятное общение онлайн', author: 'anon_m3n8q1', created: '2024-01-10 13:30', type: 'regular', category: 'Виртуальное общение', price: 1500, status: 'active' },
    { id: 3, title: 'Выезд по городу', description: 'Сопровождение по Москве', author: 'anon_q2l8n3', created: '2024-01-10 12:45', type: 'premium', category: 'Эскорт услуги', price: 20000, status: 'pending', createdByAdmin: true },
    { id: 4, title: 'Расслабляющий массаж', description: 'Профессиональный массаж', author: 'anon_k3m7n2', created: '2024-01-10 11:20', type: 'regular', category: 'Массаж', price: 5000, status: 'active' },
  ]);

  const [recentUsers] = useState([
    { id: 1, login: 'anon_x7k2p9', registered: '2024-01-10 14:23', status: 'active' },
    { id: 2, login: 'anon_m3n8q1', registered: '2024-01-10 13:45', status: 'active' },
    { id: 3, login: 'anon_p9k2m7', registered: '2024-01-10 12:10', status: 'blocked' },
    { id: 4, login: 'anon_q2l8n3', registered: '2024-01-10 11:30', status: 'active' },
  ]);

  const [models, setModels] = useState<Model[]>([
    { id: 1, name: 'Анна М.', login: 'anon_x7k2p9', status: 'verified', listingsCount: 12, totalRevenue: 145000, avatar: '👩', verified: true, gender: 'female', age: 24, city: 'Москва', bio: 'Профессиональная модель', createdByAdmin: true },
    { id: 2, name: 'Мария К.', login: 'anon_m3n8q1', status: 'verified', listingsCount: 8, totalRevenue: 98000, avatar: '👱‍♀️', verified: true, gender: 'female', age: 26, city: 'Санкт-Петербург', createdByAdmin: true },
    { id: 3, name: 'Елена Р.', login: 'anon_p9k2m7', status: 'active', listingsCount: 5, totalRevenue: 67000, avatar: '👧', verified: false, gender: 'female', age: 22, city: 'Новосибирск' },
    { id: 4, name: 'Виктория С.', login: 'anon_q2l8n3', status: 'verified', listingsCount: 15, totalRevenue: 189000, avatar: '👩‍🦰', verified: true, gender: 'female', age: 28, city: 'Екатеринбург', createdByAdmin: true },
  ]);

  useEffect(() => {
    const adminModels = models.filter(m => m.createdByAdmin);
    localStorage.setItem('admin_models', JSON.stringify(adminModels));
  }, []);

  const [messages] = useState([
    { id: 1, modelId: 1, status: 'new' },
    { id: 2, modelId: 1, status: 'read' },
    { id: 3, modelId: 2, status: 'replied' },
    { id: 4, modelId: 4, status: 'new' },
    { id: 5, modelId: 1, status: 'replied' },
  ]);

  const adminModelIds = models.map(m => m.id);
  const newMessagesCount = messages.filter(m => adminModelIds.includes(m.modelId) && m.status === 'new').length;

  const [responses] = useState([
    { id: 1, listingId: 1, status: 'new' },
    { id: 2, listingId: 3, status: 'read' },
    { id: 3, listingId: 1, status: 'replied' },
    { id: 4, listingId: 3, status: 'new' },
    { id: 5, listingId: 1, status: 'replied' },
  ]);

  const adminListingIds = listings.filter(l => l.createdByAdmin).map(l => l.id);
  const newResponsesCount = responses.filter(r => adminListingIds.includes(r.listingId) && r.status === 'new').length;

  const [supportTickets, setSupportTickets] = useState<any[]>([]);

  useEffect(() => {
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    setSupportTickets(tickets);
  }, [selectedTab]);

  const newSupportTicketsCount = supportTickets.filter(t => t.status === 'new').length;

  const prevNewMessagesCount = useRef(newMessagesCount);
  const prevNewResponsesCount = useRef(newResponsesCount);

  useEffect(() => {
    const soundEnabled = localStorage.getItem('admin_sound_notifications') === 'true';
    
    if (soundEnabled) {
      if (newMessagesCount > prevNewMessagesCount.current) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eeeSwwMUKXh8LhjHAY4kte8zHksBSR3x/DdkEAKFF606OunVxILRp/g8r5sIQUrg87y2Yg2CBlou+3mnkwMDFCl4fC4YxwGOJLXvMx5LAUkd8fw3ZBAChRctOjrp1cSC0af4PK+ayEFK4PO8tmINgga6bvt555MEAxQpd/wuGMcBjiS17zMeSwFJHfH8N2QQAoUXLTo66dXEgtGn+Dyvmwfbyq==');
        audio.play().catch(() => {});
      }
      
      if (newResponsesCount > prevNewResponsesCount.current) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eeeSwwMUKXh8LhjHAY4kte8zHksBSR3x/DdkEAKFF606OunVxILRp/g8r5sIQUrg87y2Yg2CBlou+3mnkwMDFCl4fC4YxwGOJLXvMx5LAUkd8fw3ZBAChRctOjrp1cSC0af4PK+ayEFK4PO8tmINgga6bvt555MEAxQpd/wuGMcBjiS17zMeSwFJHfH8N2QQAoUXLTo66dXEgtGn+Dyvmwfbyq==');
        audio.play().catch(() => {});
      }
    }
    
    prevNewMessagesCount.current = newMessagesCount;
    prevNewResponsesCount.current = newResponsesCount;
  }, [newMessagesCount, newResponsesCount]);

  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: 'Tag' });

  const [listingDialog, setListingDialog] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingListing, setViewingListing] = useState<Listing | null>(null);
  const [selectedTab, setSelectedTab] = useState('moderation');
  const [createListingDialog, setCreateListingDialog] = useState(false);

  const handleLogout = () => {
    onAdminLogout();
    navigate('/admin/login');
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из панели администратора",
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({ title: "Ошибка", description: "Введите название категории", variant: "destructive" });
      return;
    }

    const category: Category = {
      id: Date.now(),
      name: newCategory.name,
      description: newCategory.description,
      icon: newCategory.icon,
      listingsCount: 0,
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '', icon: 'Tag' });
    setCategoryDialog(false);
    toast({ title: "Категория добавлена", description: `"${category.name}" успешно создана` });
  };

  const handleEditCategory = () => {
    if (!editingCategory || !newCategory.name) return;

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, name: newCategory.name, description: newCategory.description, icon: newCategory.icon }
        : cat
    ));
    
    setEditingCategory(null);
    setNewCategory({ name: '', description: '', icon: 'Tag' });
    setCategoryDialog(false);
    toast({ title: "Категория обновлена", description: "Изменения сохранены" });
  };

  const handleDeleteCategory = (id: number) => {
    const category = categories.find(c => c.id === id);
    setCategories(categories.filter(cat => cat.id !== id));
    toast({ title: "Категория удалена", description: `"${category?.name}" была удалена` });
  };

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setNewCategory({ name: category.name, description: category.description, icon: category.icon });
    } else {
      setEditingCategory(null);
      setNewCategory({ name: '', description: '', icon: 'Tag' });
    }
    setCategoryDialog(true);
  };

  const handleApprove = (id: number) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: 'active' as const } : l));
    toast({ title: "Объявление одобрено", description: "Объявление опубликовано на платформе" });
  };

  const handleReject = (id: number) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: 'rejected' as const } : l));
    toast({ title: "Объявление отклонено", description: "Автору отправлено уведомление", variant: "destructive" });
  };

  const handleDeleteListing = (id: number) => {
    const listing = listings.find(l => l.id === id);
    setListings(listings.filter(l => l.id !== id));
    toast({ title: "Объявление удалено", description: `"${listing?.title}" было удалено` });
  };

  const handleCreateModel = (modelData: Omit<Model, 'id' | 'listingsCount' | 'totalRevenue'>) => {
    const newModel: Model = {
      ...modelData,
      id: Date.now(),
      listingsCount: 0,
      totalRevenue: 0,
      createdByAdmin: true,
    };
    const updatedModels = [...models, newModel];
    setModels(updatedModels);
    localStorage.setItem('admin_models', JSON.stringify(updatedModels.filter(m => m.createdByAdmin)));
  };

  const handleUpdateModel = (id: number, modelData: Omit<Model, 'id' | 'listingsCount' | 'totalRevenue'>) => {
    const updatedModels = models.map(m => 
      m.id === id 
        ? { ...m, ...modelData }
        : m
    );
    setModels(updatedModels);
    localStorage.setItem('admin_models', JSON.stringify(updatedModels.filter(m => m.createdByAdmin)));
  };

  const handleDeleteModel = (id: number) => {
    const updatedModels = models.filter(m => m.id !== id);
    setModels(updatedModels);
    localStorage.setItem('admin_models', JSON.stringify(updatedModels.filter(m => m.createdByAdmin)));
  };

  const openEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setListingDialog(true);
  };

  const openViewListing = (listing: Listing) => {
    setViewingListing(listing);
    setViewDialog(true);
  };

  const handleSaveListing = () => {
    if (!editingListing) return;

    setListings(listings.map(l => l.id === editingListing.id ? editingListing : l));
    setListingDialog(false);
    setEditingListing(null);
    toast({ title: "Объявление обновлено", description: "Изменения сохранены" });
  };

  const handleCreateListing = (listingData: {
    modelId: number;
    title: string;
    description: string;
    category: string;
    price: string;
    isPremium: boolean;
    status: 'active' | 'pending';
  }) => {
    const model = models.find(m => m.id === listingData.modelId);
    if (!model) return;

    const newListing: Listing = {
      id: Date.now(),
      title: listingData.title,
      description: listingData.description,
      author: model.login,
      created: new Date().toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', ''),
      type: listingData.isPremium ? 'premium' : 'regular',
      category: listingData.category,
      price: Number(listingData.price),
      status: listingData.status,
      createdByAdmin: true,
    };

    setListings([newListing, ...listings]);
    setCreateListingDialog(false);
    toast({ 
      title: "Объявление создано", 
      description: `${listingData.isPremium ? 'Premium' : 'Обычное'} объявление "успешно создано" для ${model.name}` 
    });
  };

  const openCreateListingDialog = () => {
    setCreateListingDialog(true);
  };

  const pendingListings = listings.filter(l => l.status === 'pending');
  const activeListings = listings.filter(l => l.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-background" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Админ-панель</h1>
                <p className="text-xs text-muted-foreground">Anonimcity Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {newSupportTicketsCount > 0 && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => setSelectedTab('support')} 
                  className="gap-2 relative"
                >
                  <Icon name="Headphones" size={16} />
                  <span className="hidden md:inline">Support</span>
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {newSupportTicketsCount}
                  </span>
                </Button>
              )}
              {newMessagesCount > 0 && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => setSelectedTab('messages')} 
                  className="gap-2 relative"
                >
                  <Icon name="Mail" size={16} />
                  <span className="hidden md:inline">Новые сообщения</span>
                  <span className="md:hidden">Сообщения</span>
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {newMessagesCount}
                  </span>
                </Button>
              )}
              {newResponsesCount > 0 && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => setSelectedTab('responses')} 
                  className="gap-2 relative"
                >
                  <Icon name="MessageSquare" size={16} />
                  <span className="hidden md:inline">Новые ответы</span>
                  <span className="md:hidden">Ответы</span>
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {newResponsesCount}
                  </span>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <Icon name="LogOut" size={16} />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <AdminStats stats={{
          totalUsers: stats.totalUsers,
          activeListings: stats.activeListings,
          totalRevenue: stats.totalRevenue,
          pendingModeration: pendingListings.length,
        }} />

        <AdminTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          pendingListings={pendingListings}
          activeListings={activeListings}
          allListings={listings}
          categories={categories}
          recentUsers={recentUsers}
          openViewListing={openViewListing}
          handleApprove={handleApprove}
          handleReject={handleReject}
          openEditListing={openEditListing}
          handleDeleteListing={handleDeleteListing}
          openCategoryDialog={openCategoryDialog}
          handleDeleteCategory={handleDeleteCategory}
          models={models}
          onCreateModel={handleCreateModel}
          onUpdateModel={handleUpdateModel}
          onDeleteModel={handleDeleteModel}
          onCreateListing={openCreateListingDialog}
        />
      </div>

      <AdminDialogs
        categoryDialog={categoryDialog}
        setCategoryDialog={setCategoryDialog}
        editingCategory={editingCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddCategory={handleAddCategory}
        handleEditCategory={handleEditCategory}
        listingDialog={listingDialog}
        setListingDialog={setListingDialog}
        editingListing={editingListing}
        setEditingListing={setEditingListing}
        handleSaveListing={handleSaveListing}
        viewDialog={viewDialog}
        setViewDialog={setViewDialog}
        viewingListing={viewingListing}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />

      <CreateListingDialog
        open={createListingDialog}
        onOpenChange={setCreateListingDialog}
        models={models}
        onSubmit={handleCreateListing}
      />
    </div>
  );
}