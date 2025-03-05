import React, { useEffect } from 'react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorKeypad from './CalculatorKeypad';
import { useCalculator } from '../utils/calculatorContext';

interface CalculatorContainerProps {
  accentColor?: string;
}

const CalculatorContainer: React.FC<CalculatorContainerProps> = ({ 
  accentColor = '#9d00ff' 
}) => {
  const { addToExpression, clearExpression, calculateResult, deleteLastCharacter } = useCalculator();
  
  // Set up keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for calculator keys
      if (
        /^[0-9+\-*/.%^=]$/.test(event.key) ||
        event.key === 'Enter' ||
        event.key === 'Backspace' ||
        event.key === 'Escape' ||
        event.key === 'Delete'
      ) {
        event.preventDefault();
      }

      // Handle number and operator keys
      if (/^[0-9]$/.test(event.key)) {
        addToExpression(event.key);
      } else if (/^[+\-*/.%^]$/.test(event.key)) {
        // Map division and multiplication for consistency
        const keyMap: Record<string, string> = {
          '*': '*',
          '/': '/',
        };
        addToExpression(keyMap[event.key] || event.key);
      } else if (event.key === 'Enter' || event.key === '=') {
        calculateResult();
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        deleteLastCharacter();
      } else if (event.key === 'Escape') {
        clearExpression();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [addToExpression, calculateResult, clearExpression, deleteLastCharacter]);
  return (
    <div className="w-[380px] max-w-full p-4 relative flex flex-col items-center">
      {/* Display section - floating directly on background */}
      <CalculatorDisplay accentColor={accentColor} />
      
      {/* Calculator keypad - floating directly on background */}
      <CalculatorKeypad accentColor={accentColor} />
    </div>
  );
};

export default CalculatorContainer;