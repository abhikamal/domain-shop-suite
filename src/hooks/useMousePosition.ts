import { useState, useEffect, useCallback, RefObject } from 'react';

interface MousePosition {
  x: number;
  y: number;
  elementX: number;
  elementY: number;
  isInside: boolean;
}

export const useMousePosition = (ref?: RefObject<HTMLElement>) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    isInside: false,
  });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const { clientX, clientY } = event;
    
    if (ref?.current) {
      const rect = ref.current.getBoundingClientRect();
      const elementX = clientX - rect.left;
      const elementY = clientY - rect.top;
      const isInside = 
        elementX >= 0 && 
        elementX <= rect.width && 
        elementY >= 0 && 
        elementY <= rect.height;

      setMousePosition({
        x: clientX,
        y: clientY,
        elementX,
        elementY,
        isInside,
      });
    } else {
      setMousePosition({
        x: clientX,
        y: clientY,
        elementX: clientX,
        elementY: clientY,
        isInside: true,
      });
    }
  }, [ref]);

  const handleMouseLeave = useCallback(() => {
    setMousePosition(prev => ({ ...prev, isInside: false }));
  }, []);

  useEffect(() => {
    const element = ref?.current || window;
    
    element.addEventListener('mousemove', handleMouseMove as EventListener);
    if (ref?.current) {
      ref.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
      if (ref?.current) {
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [ref, handleMouseMove, handleMouseLeave]);

  return mousePosition;
};

export default useMousePosition;
