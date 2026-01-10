import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import AdminListingsTabs from './tabs/AdminListingsTabs';
import AdminContentTabs from './tabs/AdminContentTabs';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminSettingsTab from './tabs/AdminSettingsTab';
import type { Category, Listing } from './AdminDialogs';

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
}: AdminTabsProps) {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
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
      />

      <AdminContentTabs
        categories={categories}
        openCategoryDialog={openCategoryDialog}
        handleDeleteCategory={handleDeleteCategory}
      />

      <AdminUsersTab recentUsers={recentUsers} />

      <AdminSettingsTab />
    </Tabs>
  );
}
