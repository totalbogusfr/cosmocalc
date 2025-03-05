import React from 'react';
import { useCalculator } from '../utils/calculatorContext';
import { formatNumber } from '../utils/calculator';

interface CalculatorDisplayProps {
  accentColor?: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ 
  accentColor = '#9d00ff'
}) => {
  const { expression, result } = useCalculator();
  
  // Format the result for display
  const displayResult = typeof result === 'number' ? formatNumber(result) : result;
  
  // Use larger fixed font sizes for better visibility
  const expressionFontSize = "text-2xl md:text-3xl";
  const resultFontSize = "text-4xl md:text-5xl";
  
  return (
    <div className="flex-1 flex flex-col justify-center items-center mb-8 mt-4 p-6 rounded-xl backdrop-blur-md bg-black/10 border border-white/10 shadow-lg overflow-hidden relative">
      {/* Add subtle glow effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          boxShadow: `inset 0 0 20px ${accentColor}40`,
          background: `radial-gradient(circle at center, ${accentColor}20 0%, transparent 70%)`
        }}
      />
      {/* Light reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Expression area - shows what user is typing */}
      <div 
        className={`${expressionFontSize} font-light text-white/90 mb-3 w-full overflow-x-auto overflow-y-hidden text-center whitespace-nowrap transition-all duration-200`}
        style={{ scrollbarWidth: 'none' }}
      >
        {expression || '0'}
      </div>
      
      {/* Result area */}
      <div 
        className={`${resultFontSize} font-medium w-full overflow-x-auto overflow-y-hidden text-center whitespace-nowrap transition-all duration-200`}
        style={{
          color: result === 'Error' ? '#ff5555' : 'white',
          scrollbarWidth: 'none'
        }}
      >
        {displayResult}
      </div>
      
      {/* Accent glow when displaying a result */}
      {result !== 0 && result !== 'Error' && (
        <div 
          className="absolute bottom-0 right-0 w-full h-1/4 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 75% 75%, ${accentColor} 0%, transparent 70%)`
          }}
        />
      )}
      
      {/* Error effect */}
      {result === 'Error' && (
        <div className="absolute inset-0 border-2 border-red-500/30 pointer-events-none rounded-xl" />
      )}
    </div>
  );
};

export default CalculatorDisplay;