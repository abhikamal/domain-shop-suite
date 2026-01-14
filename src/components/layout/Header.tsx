import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart, Package, LogOut, Settings, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-neon/10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon to-neon-cyan flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,255,128,0.3)] transition-shadow">
            <Zap className="w-5 h-5 text-background" />
          </div>
          <span className="text-xl md:text-2xl font-display font-bold text-foreground">
            Hyper<span className="text-neon">Mart</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-neon/5">
            Home
          </Link>
          <Link to="/products" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-neon/5">
            Browse
          </Link>
          
          {user && (
            <>
              <Link to="/cart" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-neon/5 flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4" />
                Cart
              </Link>
              <Link to="/orders" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-neon/5 flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                Orders
              </Link>
            </>
          )}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-neon/10">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-neon/20">
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wishlist')} className="cursor-pointer">
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer">
                  <Package className="w-4 h-4 mr-2" />
                  Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/sell')} className="cursor-pointer">
                  <Package className="w-4 h-4 mr-2" />
                  Sell Items
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              to="/auth" 
              className="px-6 py-2.5 bg-gradient-to-r from-neon to-neon-cyan text-background font-semibold rounded-xl text-sm hover:shadow-[0_0_20px_rgba(0,255,128,0.3)] transition-all"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-neon/10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-2 animate-fade-in border-t border-neon/10 pt-4">
          <Link to="/" className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-neon/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-neon/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>Browse</Link>
          {user ? (
            <>
              <Link to="/cart" className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-neon/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>Cart</Link>
              <Link to="/orders" className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-neon/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
              <Link to="/wishlist" className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-neon/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
              <Link to="/profile" className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-neon/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              <Link to="/sell" className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-neon/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>Sell Items</Link>
              {isAdmin && (
                <Link to="/admin" className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-neon/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout} className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-neon/10 transition-colors text-left text-destructive">Logout</button>
            </>
          ) : (
            <Link to="/auth" className="px-4 py-3 text-sm font-semibold text-center rounded-xl bg-gradient-to-r from-neon to-neon-cyan text-background" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
