import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'neon' | 'cyan' | 'mixed';
  enableTilt?: boolean;
  enableGlow?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const CyberCard: React.FC<CyberCardProps> = ({
  children,
  className,
  glowColor = 'neon',
  enableTilt = true,
  enableGlow = true,
  onClick,
  style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (enableTilt) {
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    }

    if (enableGlow) {
      setGlowPosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    }
  };

  const handleMouseLeave = () => {
    setTransform('');
    setGlowPosition({ x: 50, y: 50 });
  };

  const glowColors = {
    neon: 'from-neon/30 via-neon/10 to-transparent',
    cyan: 'from-neon-cyan/30 via-neon-cyan/10 to-transparent',
    mixed: 'from-neon/20 via-neon-cyan/20 to-transparent',
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-xl border border-neon/20 bg-cyber-surface/80 backdrop-blur-sm transition-all duration-300 ease-out',
        'hover:border-neon/60 hover:shadow-[0_0_30px_rgba(0,255,128,0.3)]',
        'group cursor-pointer',
        className
      )}
      style={{ transform, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Glow effect following mouse */}
      {enableGlow && (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            `bg-radial-gradient`
          )}
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, hsl(var(--neon) / 0.3), transparent 50%)`,
          }}
        />
      )}
      
      {/* Scan line effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-neon/50 to-transparent animate-scan-line" />
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-neon/40 transition-colors group-hover:border-neon" />
      <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-neon/40 transition-colors group-hover:border-neon" />
      <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-neon/40 transition-colors group-hover:border-neon" />
      <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-neon/40 transition-colors group-hover:border-neon" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CyberCard;
