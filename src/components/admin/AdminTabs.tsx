import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import AdminListingsTabs from './tabs/AdminListingsTabs';
import AdminContentTabs from './tabs/AdminContentTabs';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminSettingsTab from './tabs/AdminSettingsTab';
import AdminMessagesTab from './tabs/AdminMessagesTab';
import type { Category, Listing } from './AdminDialogs';
import type { Model } from './tabs/AdminContentTabs';

interface AdminTabsProps {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  pendingListings: Listing[];
  activeListings: Listing[];
  categories: Category[];
  recentUsers: Array<{ id: number; login: string; registered: string; status: string }>;
  openViewListing: (listing: Listing) => void;
  handleApprove: (id: number) => void;
  handleReject: (id: number) => void;
  openEditListing: (listing: Listing) => void;
  handleDeleteListing: (id: number) => void;
  openCategoryDialog: (category?: Category) => void;
  handleDeleteCategory: (id: number) => void;
  models: Model[];
  onCreateModel: (model: Omit<Model, 'id' | 'listingsCount' | 'totalRevenue'>) => void;
  onUpdateModel: (id: number, model: Omit<Model, 'id' | 'listingsCount' | 'totalRevenue'>) => void;
  onDeleteModel: (id: number) => void;
  onCreateListing: () => void;
}

export default function AdminTabs({
  selectedTab,
  setSelectedTab,
  pendingListings,
  activeListings,
  categories,
  recentUsers,
  openViewListing,
  handleApprove,
  handleReject,
  openEditListing,
  handleDeleteListing,
  openCategoryDialog,
  handleDeleteCategory,
  models,
  onCreateModel,
  onUpdateModel,
  onDeleteModel,
  onCreateListing,
}: AdminTabsProps) {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="moderation" className="gap-2">
          <Icon name="Shield" size={16} />
          <span className="hidden sm:inline">Модерация</span>
        </TabsTrigger>
        <TabsTrigger value="listings" className="gap-2">
          <Icon name="FileText" size={16} />
          <span className="hidden sm:inline">Объявления</span>
        </TabsTrigger>
        <TabsTrigger value="categories" className="gap-2">
          <Icon name="Tag" size={16} />
          <span className="hidden sm:inline">Категории</span>
        </TabsTrigger>
        <TabsTrigger value="models" className="gap-2">
          <Icon name="User" size={16} />
          <span className="hidden sm:inline">Модели</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="gap-2">
          <Icon name="Users" size={16} />
          <span className="hidden sm:inline">Пользователи</span>
        </TabsTrigger>
        <TabsTrigger value="messages" className="gap-2">
          <Icon name="Mail" size={16} />
          <span className="hidden sm:inline">Сообщения</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Icon name="Settings" size={16} />
          <span className="hidden sm:inline">Настройки</span>
        </TabsTrigger>
      </TabsList>

      <AdminListingsTabs
        pendingListings={pendingListings}
        activeListings={activeListings}
        openViewListing={openViewListing}
        handleApprove={handleApprove}
        handleReject={handleReject}
        openEditListing={openEditListing}
        handleDeleteListing={handleDeleteListing}
        onCreateListing={onCreateListing}
      />

      <AdminContentTabs
        categories={categories}
        openCategoryDialog={openCategoryDialog}
        handleDeleteCategory={handleDeleteCategory}
        models={models}
        onCreateModel={onCreateModel}
        onUpdateModel={onUpdateModel}
        onDeleteModel={onDeleteModel}
      />

      <AdminUsersTab recentUsers={recentUsers} />

      <AdminMessagesTab models={models} />

      <AdminSettingsTab />
    </Tabs>
  );
}