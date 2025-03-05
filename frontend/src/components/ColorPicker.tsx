import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  value, 
  onChange,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label className="text-xs text-foreground/70">{label}</label>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-full cursor-pointer opacity-0 absolute inset-0 z-10"
        />
        <div 
          className="w-8 h-8 rounded-full border border-white/20 shadow-md"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
};

export default ColorPicker;