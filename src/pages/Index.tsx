import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { ArrowRight, Zap, Shield, Sparkles, TrendingUp, Users, Package, CheckCircle } from 'lucide-react';

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
      {/* Hero Section - Matching Reference Design */}
      <section className="min-h-[85vh] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(0,173,181,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,173,181,0.03) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm animate-fade-in">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Campus-Only Marketplace</span>
              </div>

              {/* Main headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="text-foreground">Trade Smarter.</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Live Better.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Your campus hub for buying, selling, and discovering pre-loved treasures. 
                <span className="text-primary"> One student's old is another's gold.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link 
                  to="/products" 
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,173,181,0.4)] hover:scale-105"
                >
                  Explore Market
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  to="/sell" 
                  className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-muted-foreground/30 text-muted-foreground font-bold rounded-xl transition-all duration-300 hover:bg-muted/10 hover:border-muted-foreground/50"
                >
                  Start Selling
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-primary/10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-xl text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Value Props Cards (like reference image) */}
            <div className="relative animate-fade-in space-y-4" style={{ animationDelay: '0.3s' }}>
              {/* Verified Community Card - Teal glow */}
              <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-primary/20 transition-all duration-300 hover:border-primary/40" style={{ boxShadow: '0 0 30px rgba(0, 173, 181, 0.1)' }}>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-orbitron font-bold text-foreground mb-2">Verified Community</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Trade with confidence. Only verified students from your campus can access the marketplace.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant Listings Card - Purple glow */}
              <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-secondary/20 transition-all duration-300 hover:border-secondary/40" style={{ boxShadow: '0 0 30px rgba(106, 5, 127, 0.1)' }}>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-secondary/10">
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-orbitron font-bold text-foreground mb-2">Instant Listings</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      List your items in seconds. Snap, describe, price, and publish - it's that simple.
                    </p>
                  </div>
                </div>
              </div>

              {/* Zero Platform Fees Card - Orange glow */}
              <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-accent/20 transition-all duration-300 hover:border-accent/40" style={{ boxShadow: '0 0 30px rgba(255, 87, 34, 0.1)' }}>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-accent/10">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-orbitron font-bold text-foreground mb-2">Zero Platform Fees</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Keep 100% of your sales. We believe in enabling students, not taxing them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-foreground mb-4">
              Browse <span className="text-primary">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find what you're looking for across our popular categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-card/50 border border-primary/10 animate-pulse" />
              ))
            ) : (
              categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="h-32 rounded-2xl bg-card/40 backdrop-blur-sm border border-primary/10 p-4 flex flex-col items-center justify-center gap-3 group hover:border-primary/30 hover:bg-card/60 transition-all duration-300"
                  style={{ boxShadow: '0 0 20px rgba(0, 173, 181, 0.05)' }}
                >
                  {category.icon_url && (
                    <img src={category.icon_url} alt="" className="w-10 h-10 opacity-60 group-hover:opacity-100 transition-opacity" />
                  )}
                  <span className="font-medium text-foreground text-sm text-center">{category.name}</span>
                </Link>
              ))
            )}
          </div>

          {/* See all categories link */}
          <div className="text-center mt-8">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              View all categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20" />
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,173,181,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(106,5,127,0.15) 0%, transparent 50%)`
            }} />
            
            <div className="relative z-10 py-16 px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-foreground mb-4">
                Ready to declutter & earn?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Turn your unused items into cash. Join thousands of students already trading on HyperMart.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/sell" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,173,181,0.4)]"
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
