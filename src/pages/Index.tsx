import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import MouseSpotlight from '@/components/MouseSpotlight';
import CyberCard from '@/components/CyberCard';

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
  const heroRef = useRef<HTMLDivElement>(null);

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

  return (
    <Layout>
      {/* Hero Section with Cyber Grid */}
      <MouseSpotlight className="min-h-[70vh] flex items-center">
        <section 
          ref={heroRef}
          className="relative w-full py-16 md:py-24 px-4 overflow-hidden cyber-grid animate-grid-move"
        >
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 border border-neon/20 rotate-45 animate-float opacity-30" />
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-neon-cyan/20 rotate-12 animate-float opacity-30" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-neon rounded-full animate-pulse-glow" />
          <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
          
          {/* Scan Line Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-neon to-transparent animate-scan-line" />
          </div>

          <div className="container mx-auto max-w-5xl text-center relative z-10">
            {/* Glitch Title */}
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 glitch-text text-neon neon-text-glow"
              data-text="EVERY ITEM DESERVES A SECOND CHANCE"
            >
              <span className="bg-gradient-to-r from-neon via-neon-cyan to-neon bg-clip-text text-transparent animate-flicker">
                EVERY ITEM DESERVES A
              </span>
              <br />
              <span className="text-neon-cyan">SECOND CHANCE</span>
            </h1>
            
            {/* Subtitle with fade in */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Your campus-exclusive <span className="text-neon">cyberpunk marketplace</span> to buy, sell, or give away pre-loved items and promote sustainability.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Link to="/products" className="cyber-button">
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  Buy Items
                </span>
              </Link>
              <Link to="/sell" className="cyber-button-outline">
                <span className="flex items-center gap-2">
                  <span className="text-xl">🔮</span>
                  Sell Items
                </span>
              </Link>
            </div>

            {/* Decorative bottom line */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-neon" />
              <div className="w-3 h-3 border border-neon rotate-45" />
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-neon-cyan" />
            </div>
          </div>
        </section>
      </MouseSpotlight>

      {/* Categories Section */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neon mb-2">
              BROWSE CATEGORIES
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-neon to-neon-cyan" />
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl border border-neon/20 bg-cyber-surface/50 animate-pulse">
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <div className="w-16 h-16 bg-neon/10 rounded-full mb-4" />
                    <div className="h-4 bg-neon/10 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CyberCard 
                    className="aspect-square animate-fade-in"
                    glowColor={index % 2 === 0 ? 'neon' : 'cyan'}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className="relative mb-4">
                        <img
                          src={category.icon_url || 'https://img.icons8.com/ios-filled/100/00ff80/box.png'}
                          alt={category.name}
                          className="w-14 h-14 md:w-16 md:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(0,255,128,0.8)]"
                        />
                      </div>
                      <h3 className="font-display font-semibold text-foreground group-hover:text-neon transition-colors text-center">
                        {category.name}
                      </h3>
                    </div>
                  </CyberCard>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 relative">
        {/* Background accents */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neon-cyan mb-2">
              WHY CHOOSE US
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-neon-cyan to-neon" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🌱',
                title: 'SUSTAINABLE',
                description: 'Give pre-loved items a new home and reduce waste on campus.',
                color: 'neon' as const,
              },
              {
                icon: '🔒',
                title: 'CAMPUS EXCLUSIVE',
                description: 'Trade safely within your verified college community.',
                color: 'cyan' as const,
              },
              {
                icon: '💎',
                title: 'SAVE CREDITS',
                description: 'Find incredible deals on books, gadgets, and more.',
                color: 'mixed' as const,
              },
            ].map((feature, index) => (
              <CyberCard
                key={feature.title}
                className="animate-fade-in"
                glowColor={feature.color}
                enableTilt={true}
              >
                <div className="p-8 text-center">
                  {/* Top accent line */}
                  <div className={`h-1 w-full mb-6 bg-gradient-to-r ${
                    feature.color === 'neon' 
                      ? 'from-neon/50 via-neon to-neon/50' 
                      : feature.color === 'cyan'
                      ? 'from-neon-cyan/50 via-neon-cyan to-neon-cyan/50'
                      : 'from-neon/50 via-neon-cyan to-neon/50'
                  }`} />
                  
                  <div className="text-5xl mb-4 animate-float" style={{ animationDelay: `${index * 200}ms` }}>
                    {feature.icon}
                  </div>
                  
                  <h3 className={`font-display font-bold text-xl mb-3 ${
                    feature.color === 'neon' 
                      ? 'text-neon' 
                      : feature.color === 'cyan'
                      ? 'text-neon-cyan'
                      : 'bg-gradient-to-r from-neon to-neon-cyan bg-clip-text text-transparent'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <CyberCard className="overflow-hidden" glowColor="mixed" enableTilt={false}>
            <div className="p-8 md:p-12 text-center relative">
              {/* Background pattern */}
              <div className="absolute inset-0 cyber-grid opacity-20" />
              
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 relative z-10">
                <span className="text-neon">READY TO</span>{' '}
                <span className="text-neon-cyan">START TRADING?</span>
              </h2>
              
              <p className="text-muted-foreground mb-8 relative z-10">
                Join the campus marketplace revolution. Buy, sell, and save.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link to="/products" className="cyber-button">
                  <span className="relative z-10">EXPLORE NOW</span>
                </Link>
              </div>
            </div>
          </CyberCard>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
