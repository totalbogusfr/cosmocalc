import React, { ReactNode, useEffect, useState, useRef } from 'react';

interface GlassmorphicContainerProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  glowIntensity?: number;
  blurStrength?: string;
  borderOpacity?: string;
  backgroundOpacity?: string;
  animate?: boolean;
}

const GlassmorphicContainer: React.FC<GlassmorphicContainerProps> = ({ 
  children,
  className = '',
  glowColor = '#9d00ff',
  glowIntensity = 0.25,
  blurStrength = 'backdrop-blur-xl',
  borderOpacity = 'border-white/20',
  backgroundOpacity = 'bg-black/20',
  animate = true
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D rotation effect based on mouse position
  useEffect(() => {
    if (!animate) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation based on mouse position relative to center of container
      // Limiting rotation to subtle values
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 2;
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 2;
      
      setRotation({ x: rotateX, y: rotateY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [animate]);
  
  // Style for glow effects
  const glowStyles = {
    boxShadow: `0 0 30px ${glowIntensity}rem ${glowColor}50,
                inset 0 0 15px ${glowIntensity/2}rem ${glowColor}30`,
    transform: animate ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` : 'none',
    transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
  };
  return (
    <div 
      ref={containerRef}
      className={`
        relative ${blurStrength} backdrop-filter
        dark:${backgroundOpacity}
        border dark:${borderOpacity}
        rounded-2xl
        overflow-hidden
        ${className}
      `}
      style={glowStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Inner glow/highlight effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'opacity-10'}`}
        style={{ 
          background: `radial-gradient(circle at ${50 + rotation.y * 10}% ${50 - rotation.x * 10}%, ${glowColor}30 0%, transparent 70%)` 
        }} 
      />
      
      {/* Edge highlight effect */}
      <div className="absolute inset-0 border-t border-l border-white/20 rounded-2xl pointer-events-none" />
      
      {/* Bottom edge shadow for depth */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent opacity-30 pointer-events-none" />
      
      {/* Subtle animated shimmer effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden"
        style={{ 
          background: `linear-gradient(45deg, transparent 0%, ${glowColor}60 45%, ${glowColor}60 55%, transparent 100%)`,
          backgroundSize: '200% 200%',
          animation: animate ? 'shimmer 3s ease-in-out infinite alternate' : 'none'
        }} 
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassmorphicContainer;