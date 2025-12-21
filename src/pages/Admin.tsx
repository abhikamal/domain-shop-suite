import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminSettings from '@/components/admin/AdminSettings';
import { LayoutDashboard, ShoppingCart, Users, Package, FolderOpen, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!user || !isAdmin) { navigate('/'); return; }
    fetchData();
    
    // Set up real-time subscriptions
    const ordersChannel = supabase
      .channel('admin-orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Orders change:', payload);
          fetchOrders();
          setLastUpdate(new Date());
          toast({ title: 'Orders updated', description: 'Order data has been refreshed.' });
        }
      )
      .subscribe();

    const productsChannel = supabase
      .channel('admin-products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Products change:', payload);
          fetchProducts();
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Profiles change:', payload);
          fetchUsers();
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    const categoriesChannel = supabase
      .channel('admin-categories-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          console.log('Categories change:', payload);
          fetchCategories();
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, [user, isAdmin]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, products(name)')
      .order('created_at', { ascending: false });
    
    if (data) {
      // Fetch buyer profiles separately
      const buyerIds = [...new Set(data.map(o => o.buyer_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, phone_number, username')
        .in('user_id', buyerIds);
      
      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      const ordersWithProfiles = data.map(order => ({
        ...order,
        profiles: profilesMap.get(order.buyer_id) || null
      }));
      setOrders(ordersWithProfiles);
    }
  };

  const fetchUsers = async () => {
    const [usersRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_roles').select('*'),
    ]);
    if (usersRes.data) setUsers(usersRes.data);
    if (rolesRes.data) setUserRoles(rolesRes.data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*');
    
    if (data) {
      // Fetch seller profiles separately
      const sellerIds = [...new Set(data.map(p => p.seller_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', sellerIds);
      
      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      const productsWithProfiles = data.map(product => ({
        ...product,
        profiles: profilesMap.get(product.seller_id) || null
      }));
      setProducts(productsWithProfiles);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (data) setCategories(data);
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchUsers(), fetchProducts(), fetchCategories()]);
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-eco-dark">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <Tabs defaultValue="dashboard" className="glass-card-solid rounded-2xl p-6">
          <TabsList className="mb-6 flex-wrap h-auto gap-2">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderOpen className="h-4 w-4" /> Categories
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard orders={orders} users={users} products={products} />
          </TabsContent>
          
          <TabsContent value="orders">
            <AdminOrders orders={orders} onRefresh={fetchData} />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUsers users={users} userRoles={userRoles} onRefresh={fetchData} />
          </TabsContent>
          
          <TabsContent value="products">
            <AdminProducts products={products} categories={categories} onRefresh={fetchData} />
          </TabsContent>
          
          <TabsContent value="categories">
            <AdminCategories categories={categories} onRefresh={fetchData} />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;