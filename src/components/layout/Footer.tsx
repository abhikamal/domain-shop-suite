import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-neon/10 bg-background/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-neon-cyan flex items-center justify-center">
              <Zap className="w-4 h-4 text-background" />
            </div>
            <div>
              <span className="font-display font-bold text-foreground">HyperMart</span>
              <p className="text-xs text-muted-foreground">Your campus marketplace</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/products" className="hover:text-foreground transition-colors">Browse</Link>
            <Link to="/sell" className="hover:text-foreground transition-colors">Sell</Link>
            <Link to="/orders" className="hover:text-foreground transition-colors">Orders</Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} HyperMart. Trade smart, live better.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
