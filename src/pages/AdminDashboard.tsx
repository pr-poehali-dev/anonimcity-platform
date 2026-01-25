import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import AdminStats from '@/components/admin/AdminStats';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminDialogs from '@/components/admin/AdminDialogs';
import CreateListingDialog from '@/components/admin/dialogs/CreateListingDialog';
import { useAdminData } from '@/hooks/useAdminData';
import { useAdminHandlers } from '@/hooks/useAdminHandlers';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

interface AdminDashboardProps {
  onAdminLogout: () => void;
}

export default function AdminDashboard({ onAdminLogout }: AdminDashboardProps) {
  const data = useAdminData();
  
  const handlers = useAdminHandlers({
    categories: data.categories,
    models: data.models,
    listings: data.listings,
    setModels: data.setModels,
    editingCategory: data.editingCategory,
    setEditingCategory: data.setEditingCategory,
    newCategory: data.newCategory,
    setNewCategory: data.setNewCategory,
    setCategoryDialog: data.setCategoryDialog,
    editingListing: data.editingListing,
    setEditingListing: data.setEditingListing,
    setListingDialog: data.setListingDialog,
    setViewingListing: data.setViewingListing,
    setViewDialog: data.setViewDialog,
    setCreateListingDialog: data.setCreateListingDialog,
    loadCategories: data.loadCategories,
    loadListingsData: data.loadListingsData,
    onAdminLogout,
  });

  useAdminNotifications(data.newMessagesCount, data.newResponsesCount);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Админ-панель</h1>
              <p className="text-sm text-muted-foreground">Anonimcity Platform</p>
            </div>
          </div>
          <Button variant="outline" onClick={handlers.handleLogout} className="gap-2">
            <Icon name="LogOut" size={16} />
            Выход
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AdminStats stats={data.stats} />
        <AdminTabs
          selectedTab={data.selectedTab}
          setSelectedTab={data.setSelectedTab}
          pendingListings={data.pendingListings}
          activeListings={data.activeListings}
          categories={data.categories}
          isLoadingCategories={data.isLoadingCategories}
          models={data.models}
          isLoadingModels={data.isLoadingModels}
          recentUsers={data.recentUsers}
          newMessagesCount={data.newMessagesCount}
          newResponsesCount={data.newResponsesCount}
          newSupportTicketsCount={data.newSupportTicketsCount}
          supportTickets={data.supportTickets}
          openViewListing={handlers.openViewListing}
          handleApprove={handlers.handleApprove}
          handleReject={handlers.handleReject}
          openEditListing={handlers.openEditListing}
          handleDeleteListing={handlers.handleDeleteListing}
          onCreateListing={handlers.openCreateListingDialog}
          openCategoryDialog={handlers.openCategoryDialog}
          handleDeleteCategory={handlers.handleDeleteCategory}
          handleCreateModel={handlers.handleCreateModel}
          handleUpdateModel={handlers.handleUpdateModel}
          handleDeleteModel={handlers.handleDeleteModel}
        />
      </main>

      <AdminDialogs
        categoryDialog={data.categoryDialog}
        setCategoryDialog={data.setCategoryDialog}
        editingCategory={data.editingCategory}
        newCategory={data.newCategory}
        setNewCategory={data.setNewCategory}
        handleAddCategory={handlers.handleAddCategory}
        handleEditCategory={handlers.handleEditCategory}
        listingDialog={data.listingDialog}
        setListingDialog={data.setListingDialog}
        editingListing={data.editingListing}
        setEditingListing={data.setEditingListing}
        handleSaveListing={handlers.handleSaveListing}
        viewDialog={data.viewDialog}
        setViewDialog={data.setViewDialog}
        viewingListing={data.viewingListing}
      />

      <CreateListingDialog
        open={data.createListingDialog}
        onOpenChange={data.setCreateListingDialog}
        models={data.models}
        categories={data.categories}
        onCreateListing={handlers.handleCreateListing}
      />
    </div>
  );
}
