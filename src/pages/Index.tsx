import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { ArrowRight, Zap, Shield, Sparkles, TrendingUp, Users, Package } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon_url: string | null;
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (!error && data) {
        setCategories(data);
      }
      setLoading(false);
    };

    if (user) {
      fetchCategories();
    }
  }, [user]);

  if (authLoading || !user) {
    return null;
  }

  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '50K+', label: 'Items Traded', icon: Package },
    { value: '₹5L+', label: 'Saved by Students', icon: TrendingUp },
  ];

  return (
    <Layout>
      {/* Hero Section - Asymmetric Split Design */}
      <section className="min-h-[85vh] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-bl from-neon/10 via-transparent to-transparent" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-neon/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(0,255,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,128,0.03) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon/30 bg-neon/5 backdrop-blur-sm animate-fade-in">
                <Zap className="w-4 h-4 text-neon" />
                <span className="text-sm font-medium text-neon">Campus-Only Marketplace</span>
              </div>

              {/* Main headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="text-foreground">Trade Smarter.</span>
                <br />
                <span className="bg-gradient-to-r from-neon via-neon-cyan to-neon bg-clip-text text-transparent">
                  Live Better.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Your campus hub for buying, selling, and discovering pre-loved treasures. 
                <span className="text-neon-cyan"> One student's old is another's gold.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link 
                  to="/products" 
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neon to-neon-cyan text-background font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,128,0.4)] hover:scale-105"
                >
                  Explore Market
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  to="/sell" 
                  className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-neon/50 text-neon font-bold rounded-xl transition-all duration-300 hover:bg-neon/10 hover:border-neon"
                >
                  Start Selling
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-neon/10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neon/10">
                      <stat.icon className="w-5 h-5 text-neon" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-xl text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Featured Categories Bento Grid */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="grid grid-cols-2 gap-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className={`${i === 0 ? 'col-span-2 h-40' : 'h-32'} rounded-2xl bg-cyber-surface/50 border border-neon/10 animate-pulse`} />
                  ))
                ) : (
                  <>
                    {/* Large featured category */}
                    {categories[0] && (
                      <Link
                        to={`/products?category=${encodeURIComponent(categories[0].name)}`}
                        className="col-span-2 h-40 rounded-2xl bg-gradient-to-br from-neon/20 to-neon-cyan/10 border border-neon/20 p-6 flex items-end justify-between group hover:border-neon/50 transition-all duration-300 overflow-hidden relative"
                      >
                        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                          <img src={categories[0].icon_url || ''} alt="" className="w-24 h-24" />
                        </div>
                        <div>
                          <span className="text-xs text-neon uppercase tracking-wider">Popular</span>
                          <h3 className="text-2xl font-display font-bold text-foreground mt-1">{categories[0].name}</h3>
                        </div>
                        <ArrowRight className="w-6 h-6 text-neon transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                    
                    {/* Smaller category cards */}
                    {categories.slice(1, 5).map((category, i) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        className={`h-32 rounded-2xl bg-cyber-surface/30 border border-neon/10 p-4 flex flex-col justify-between group hover:border-neon/30 hover:bg-cyber-surface/50 transition-all duration-300 ${i === 3 ? 'bg-gradient-to-br from-neon-cyan/10 to-transparent' : ''}`}
                      >
                        <img src={category.icon_url || ''} alt="" className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium text-foreground text-sm">{category.name}</span>
                      </Link>
                    ))}
                  </>
                )}
              </div>
              
              {/* See all categories link */}
              <Link 
                to="/products" 
                className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon transition-colors"
              >
                View all categories
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section - Horizontal Cards */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon/5 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Why <span className="text-neon">HyperMart</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built by students, for students. A trusted space to trade within your campus community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Verified Community',
                description: 'Trade with confidence. Only verified students from your campus can access the marketplace.',
                gradient: 'from-neon/20',
              },
              {
                icon: Zap,
                title: 'Instant Listings',
                description: 'List your items in seconds. Snap, describe, price, and publish - it\'s that simple.',
                gradient: 'from-neon-cyan/20',
              },
              {
                icon: Sparkles,
                title: 'Zero Platform Fees',
                description: 'Keep 100% of your sales. We believe in enabling students, not taxing them.',
                gradient: 'from-neon/20',
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className={`group p-8 rounded-3xl bg-gradient-to-br ${feature.gradient} to-transparent border border-neon/10 hover:border-neon/30 transition-all duration-500`}
              >
                <div className="w-14 h-14 rounded-2xl bg-neon/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-neon" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon/20 via-neon-cyan/10 to-neon/20" />
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,255,128,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,255,255,0.1) 0%, transparent 50%)`
            }} />
            
            <div className="relative z-10 py-16 px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Ready to declutter & earn?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Turn your unused items into cash. Join thousands of students already trading on HyperMart.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/sell" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-bold rounded-xl transition-all duration-300 hover:bg-foreground/90"
                >
                  List Your First Item
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-2 px-8 py-4 border border-foreground/20 text-foreground font-medium rounded-xl transition-all duration-300 hover:bg-foreground/5"
                >
                  Browse Deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
