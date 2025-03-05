import React from 'react';
import ColorPicker from './ColorPicker';

interface BackgroundControlsProps {
  baseColor: string;
  accentColor: string;
  starColor: string;
  particleDensity: number;
  animationSpeed: number;
  onBaseColorChange: (color: string) => void;
  onAccentColorChange: (color: string) => void;
  onStarColorChange: (color: string) => void;
  onDensityChange: (density: number) => void;
  onSpeedChange: (speed: number) => void;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  baseColor,
  accentColor,
  starColor,
  particleDensity,
  animationSpeed,
  onBaseColorChange,
  onAccentColorChange,
  onStarColorChange,
  onDensityChange,
  onSpeedChange
}) => {
  return (
    <div className="backdrop-blur-lg bg-black/30 rounded-xl p-4 border border-white/10 shadow-xl">
      <h3 className="text-sm font-medium mb-3 text-foreground/90">Background Settings</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3 flex-wrap">
          <ColorPicker
            label="Base Color"
            value={baseColor}
            onChange={onBaseColorChange}
            className="mb-2 mr-2"
          />
          <ColorPicker
            label="Accent Color"
            value={accentColor}
            onChange={onAccentColorChange}
            className="mb-2 mr-2"
          />
          <ColorPicker
            label="Star Color"
            value={starColor}
            onChange={onStarColorChange}
            className="mb-2"
          />
        </div>
        
        <div className="space-y-2">
          <div>
            <label className="text-xs text-foreground/70 block mb-1">Particle Density</label>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={particleDensity}
              onChange={(e) => onDensityChange(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="text-xs text-foreground/70 block mb-1">Animation Speed</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundControls;