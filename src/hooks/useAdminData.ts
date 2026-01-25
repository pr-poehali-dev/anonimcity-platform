import { useState, useEffect } from 'react';
import type { Category, Listing } from '@/components/admin/AdminDialogs';
import type { Model } from '@/components/admin/tabs/AdminContentTabs';
import { getCategories, getModels, getListings } from '@/lib/api';

export function useAdminData() {
  const [stats] = useState({
    totalUsers: 1247,
    activeListings: 342,
    totalRevenue: 125430,
    pendingModeration: 18,
    totalMessages: 5623,
    reportedContent: 7,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  const [recentUsers] = useState([
    { id: 1, login: 'anon_x7k2p9', registered: '2024-01-10 14:23', status: 'active' },
    { id: 2, login: 'anon_m3n8q1', registered: '2024-01-10 13:45', status: 'active' },
    { id: 3, login: 'anon_p9k2m7', registered: '2024-01-10 12:10', status: 'blocked' },
    { id: 4, login: 'anon_q2l8n3', registered: '2024-01-10 11:30', status: 'active' },
  ]);

  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: 'Tag' });

  const [listingDialog, setListingDialog] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingListing, setViewingListing] = useState<Listing | null>(null);
  const [selectedTab, setSelectedTab] = useState('moderation');
  const [createListingDialog, setCreateListingDialog] = useState(false);

  const [messages] = useState([
    { id: 1, modelId: 1, status: 'new' },
    { id: 2, modelId: 1, status: 'read' },
    { id: 3, modelId: 2, status: 'replied' },
    { id: 4, modelId: 4, status: 'new' },
    { id: 5, modelId: 1, status: 'replied' },
  ]);

  const [responses] = useState([
    { id: 1, listingId: 1, status: 'new' },
    { id: 2, listingId: 3, status: 'read' },
    { id: 3, listingId: 1, status: 'replied' },
    { id: 4, listingId: 3, status: 'new' },
    { id: 5, listingId: 1, status: 'replied' },
  ]);

  const [supportTickets, setSupportTickets] = useState<any[]>([]);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadModels = async () => {
    setIsLoadingModels(true);
    try {
      const data = await getModels();
      setModels(data);
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const loadListingsData = async () => {
    setIsLoadingListings(true);
    try {
      const data = await getListings();
      setListings(data.map((l: any) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        author: `user_${l.user_id}`,
        created: l.created_at,
        type: 'regular',
        category: l.category,
        price: l.price,
        status: l.status || 'active',
        createdByAdmin: false
      })));
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setIsLoadingListings(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadModels();
    loadListingsData();
  }, []);

  useEffect(() => {
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    setSupportTickets(tickets);
  }, [selectedTab]);

  const adminModelIds = models.map(m => m.id);
  const newMessagesCount = messages.filter(m => adminModelIds.includes(m.modelId) && m.status === 'new').length;

  const adminListingIds = listings.filter(l => l.createdByAdmin).map(l => l.id);
  const newResponsesCount = responses.filter(r => adminListingIds.includes(r.listingId) && r.status === 'new').length;

  const newSupportTicketsCount = supportTickets.filter(t => t.status === 'new').length;

  const pendingListings = listings.filter(l => l.status === 'pending');
  const activeListings = listings.filter(l => l.status === 'active');

  return {
    stats,
    categories,
    setCategories,
    isLoadingCategories,
    listings,
    setListings,
    isLoadingListings,
    recentUsers,
    models,
    setModels,
    isLoadingModels,
    categoryDialog,
    setCategoryDialog,
    editingCategory,
    setEditingCategory,
    newCategory,
    setNewCategory,
    listingDialog,
    setListingDialog,
    editingListing,
    setEditingListing,
    viewDialog,
    setViewDialog,
    viewingListing,
    setViewingListing,
    selectedTab,
    setSelectedTab,
    createListingDialog,
    setCreateListingDialog,
    messages,
    responses,
    supportTickets,
    setSupportTickets,
    newMessagesCount,
    newResponsesCount,
    newSupportTicketsCount,
    pendingListings,
    activeListings,
    loadCategories,
    loadModels,
    loadListingsData,
  };
}
