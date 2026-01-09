import React, { useRef } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { cn } from '@/lib/utils';

interface MouseSpotlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightSize?: number;
  spotlightColor?: string;
}

const MouseSpotlight: React.FC<MouseSpotlightProps> = ({
  children,
  className,
  spotlightSize = 600,
  spotlightColor = 'hsl(142, 100%, 50%)',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { elementX, elementY, isInside } = useMousePosition(containerRef);

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute transition-opacity duration-500"
        style={{
          width: spotlightSize,
          height: spotlightSize,
          left: elementX - spotlightSize / 2,
          top: elementY - spotlightSize / 2,
          background: `radial-gradient(circle, ${spotlightColor}15 0%, transparent 60%)`,
          opacity: isInside ? 1 : 0,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default MouseSpotlight;
