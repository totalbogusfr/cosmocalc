import React from 'react';
import { useCalculator } from '../utils/calculatorContext';

type ButtonType = 'number' | 'operator' | 'function' | 'equals';

interface CalculatorButtonProps {
  value: string;
  display?: string;
  type?: ButtonType;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  value,
  display,
  type = 'number',
  accentColor = '#9d00ff',
  className = '',
  onClick,
}) => {
  const { addToExpression, clearExpression, calculateResult, deleteLastCharacter } = useCalculator();

  // Define base styles for different button types
  const baseStyles = {
    number: 'bg-black/10 hover:bg-black/20 text-white/90',
    operator: 'bg-black/20 hover:bg-black/30 text-white',
    function: 'bg-black/15 hover:bg-black/25 text-white/80',
    equals: 'text-white',
  };

  // Handle button click
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    // Handle special function buttons
    switch (value) {
      case 'C':
        clearExpression();
        break;
      case '=':
        calculateResult();
        break;
      case 'DEL':
        deleteLastCharacter();
        break;
      default:
        addToExpression(value);
        break;
    }
  };

  // Custom style for equals button with gradient
  const equalsButtonStyle = type === 'equals' ? {
    background: `linear-gradient(135deg, ${accentColor}90 0%, ${accentColor}40 100%)`,
    boxShadow: `0 0 15px ${accentColor}50`,
    border: `1px solid ${accentColor}60`,
  } : {};

  return (
    <button
      className={`
        rounded-lg backdrop-blur-sm border border-white/10 
        flex items-center justify-center text-xl
        cursor-pointer transition-all duration-200
        hover:border-white/20 active:scale-95
        ${baseStyles[type]}
        ${className}
      `}
      onClick={handleClick}
      style={equalsButtonStyle}
    >
      {display || value}
    </button>
  );
};

export default CalculatorButton;