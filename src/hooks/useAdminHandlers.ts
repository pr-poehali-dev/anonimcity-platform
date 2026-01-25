import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { Category, Listing } from '@/components/admin/AdminDialogs';
import type { Model } from '@/components/admin/tabs/AdminContentTabs';
import { createCategory, updateCategory, deleteCategory, createModel, updateModel, deleteModel } from '@/lib/api';

interface UseAdminHandlersProps {
  categories: Category[];
  models: Model[];
  listings: Listing[];
  setModels: (models: Model[]) => void;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  newCategory: { name: string; description: string; icon: string };
  setNewCategory: (category: { name: string; description: string; icon: string }) => void;
  setCategoryDialog: (open: boolean) => void;
  editingListing: Listing | null;
  setEditingListing: (listing: Listing | null) => void;
  setListingDialog: (open: boolean) => void;
  setViewingListing: (listing: Listing | null) => void;
  setViewDialog: (open: boolean) => void;
  setCreateListingDialog: (open: boolean) => void;
  loadCategories: () => Promise<void>;
  loadListingsData: () => Promise<void>;
  onAdminLogout: () => void;
}

export function useAdminHandlers(props: UseAdminHandlersProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    props.onAdminLogout();
    navigate('/admin/login');
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из панели администратора",
    });
  };

  const handleAddCategory = async () => {
    if (!props.newCategory.name) {
      toast({ title: "Ошибка", description: "Введите название категории", variant: "destructive" });
      return;
    }

    const result = await createCategory(props.newCategory.name, props.newCategory.icon, '');
    
    if (result.success) {
      await props.loadCategories();
      props.setNewCategory({ name: '', description: '', icon: 'Tag' });
      props.setCategoryDialog(false);
      toast({ title: "Категория добавлена", description: `"${props.newCategory.name}" успешно создана` });
    } else {
      toast({ title: "Ошибка", description: result.error, variant: "destructive" });
    }
  };

  const handleEditCategory = async () => {
    if (!props.editingCategory || !props.newCategory.name) return;

    const result = await updateCategory(props.editingCategory.id, props.newCategory.name, props.newCategory.icon, '');
    
    if (result.success) {
      await props.loadCategories();
      props.setEditingCategory(null);
      props.setNewCategory({ name: '', description: '', icon: 'Tag' });
      props.setCategoryDialog(false);
      toast({ title: "Категория обновлена", description: "Изменения сохранены" });
    } else {
      toast({ title: "Ошибка", description: result.error, variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const category = props.categories.find(c => c.id === id);
    const success = await deleteCategory(id);
    
    if (success) {
      await props.loadCategories();
      toast({ title: "Категория удалена", description: `"${category?.name}" была удалена` });
    } else {
      toast({ title: "Ошибка", description: "Не удалось удалить категорию", variant: "destructive" });
    }
  };

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      props.setEditingCategory(category);
      props.setNewCategory({ name: category.name, description: category.description, icon: category.icon });
    } else {
      props.setEditingCategory(null);
      props.setNewCategory({ name: '', description: '', icon: 'Tag' });
    }
    props.setCategoryDialog(true);
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/283b32ee-5900-4830-aac0-199572d71a89`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Action': 'approve'
        },
        body: JSON.stringify({ listing_id: id, status: 'active' })
      });
      
      if (response.ok) {
        await props.loadListingsData();
        toast({ title: "Объявление одобрено", description: "Объявление опубликовано на платформе" });
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось одобрить объявление", variant: "destructive" });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/283b32ee-5900-4830-aac0-199572d71a89?id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Action': 'delete'
        }
      });
      
      if (response.ok) {
        await props.loadListingsData();
        toast({ title: "Объявление отклонено", description: "Автору отправлено уведомление", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось отклонить объявление", variant: "destructive" });
    }
  };

  const handleDeleteListing = async (id: number) => {
    const listing = props.listings.find(l => l.id === id);
    
    try {
      const response = await fetch(`https://functions.poehali.dev/283b32ee-5900-4830-aac0-199572d71a89?id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Action': 'delete'
        }
      });
      
      if (response.ok) {
        await props.loadListingsData();
        toast({ title: "Объявление удалено", description: `"${listing?.title}" было удалено` });
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось удалить объявление", variant: "destructive" });
    }
  };

  const handleCreateModel = (modelData: Omit<Model, 'id' | 'listingsCount' | 'totalRevenue'>) => {
    const newModel: Model = {
      ...modelData,
      id: Date.now(),
      listingsCount: 0,
      totalRevenue: 0,
      createdByAdmin: true,
    };
    const updatedModels = [...props.models, newModel];
    props.setModels(updatedModels);
    localStorage.setItem('admin_models', JSON.stringify(updatedModels.filter(m => m.createdByAdmin)));
  };

  const handleUpdateModel = (id: number, modelData: Omit<Model, 'id' | 'listingsCount' | 'totalRevenue'>) => {
    const updatedModels = props.models.map(m => 
      m.id === id 
        ? { ...m, ...modelData }
        : m
    );
    props.setModels(updatedModels);
    localStorage.setItem('admin_models', JSON.stringify(updatedModels.filter(m => m.createdByAdmin)));
  };

  const handleDeleteModel = (id: number) => {
    const updatedModels = props.models.filter(m => m.id !== id);
    props.setModels(updatedModels);
    localStorage.setItem('admin_models', JSON.stringify(updatedModels.filter(m => m.createdByAdmin)));
  };

  const openEditListing = (listing: Listing) => {
    props.setEditingListing(listing);
    props.setListingDialog(true);
  };

  const openViewListing = (listing: Listing) => {
    props.setViewingListing(listing);
    props.setViewDialog(true);
  };

  const handleSaveListing = async () => {
    if (!props.editingListing) return;

    try {
      const response = await fetch('https://functions.poehali.dev/283b32ee-5900-4830-aac0-199572d71a89', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Action': 'update'
        },
        body: JSON.stringify({
          id: props.editingListing.id,
          title: props.editingListing.title,
          description: props.editingListing.description,
          price: props.editingListing.price
        })
      });

      if (response.ok) {
        await props.loadListingsData();
        props.setListingDialog(false);
        props.setEditingListing(null);
        toast({ title: "Объявление обновлено", description: "Изменения сохранены" });
      } else {
        throw new Error('Failed to update listing');
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось обновить объявление", variant: "destructive" });
    }
  };

  const handleCreateListing = async (listingData: {
    modelId: number;
    title: string;
    description: string;
    category: string;
    price: string;
    isPremium: boolean;
    status: 'active' | 'pending';
  }) => {
    const model = props.models.find(m => m.id === listingData.modelId);
    if (!model) return;

    try {
      const response = await fetch('https://functions.poehali.dev/283b32ee-5900-4830-aac0-199572d71a89', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': String(model.id)
        },
        body: JSON.stringify({
          title: listingData.title,
          description: listingData.description,
          category: listingData.category,
          price: Number(listingData.price),
          currency: 'RUB',
          location: '',
          images: []
        })
      });

      if (response.ok) {
        await props.loadListingsData();
        props.setCreateListingDialog(false);
        toast({ 
          title: "Объявление создано", 
          description: `${listingData.isPremium ? 'Premium' : 'Обычное'} объявление успешно создано для ${model.name}` 
        });
      } else {
        throw new Error('Failed to create listing');
      }
    } catch (error) {
      toast({ 
        title: "Ошибка", 
        description: "Не удалось создать объявление", 
        variant: "destructive" 
      });
    }
  };

  const openCreateListingDialog = () => {
    props.setCreateListingDialog(true);
  };

  return {
    handleLogout,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    openCategoryDialog,
    handleApprove,
    handleReject,
    handleDeleteListing,
    handleCreateModel,
    handleUpdateModel,
    handleDeleteModel,
    openEditListing,
    openViewListing,
    handleSaveListing,
    handleCreateListing,
    openCreateListingDialog,
  };
}
