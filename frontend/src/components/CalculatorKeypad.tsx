import React from 'react';
import CalculatorButton from './CalculatorButton';

interface CalculatorKeypadProps {
  accentColor?: string;
}

const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  accentColor = '#9d00ff'
}) => {
  // Define button layout
  const buttons = [
    { value: 'C', display: 'C', type: 'function' as const },
    { value: '%', display: '%', type: 'operator' as const },
    { value: '^', display: 'xʸ', type: 'operator' as const },
    { value: 'DEL', display: '⌫', type: 'function' as const },
    
    { value: '7', display: '7', type: 'number' as const },
    { value: '8', display: '8', type: 'number' as const },
    { value: '9', display: '9', type: 'number' as const },
    { value: '/', display: '÷', type: 'operator' as const },
    
    { value: '4', display: '4', type: 'number' as const },
    { value: '5', display: '5', type: 'number' as const },
    { value: '6', display: '6', type: 'number' as const },
    { value: '*', display: '×', type: 'operator' as const },
    
    { value: '1', display: '1', type: 'number' as const },
    { value: '2', display: '2', type: 'number' as const },
    { value: '3', display: '3', type: 'number' as const },
    { value: '-', display: '−', type: 'operator' as const },
    
    { value: '0', display: '0', type: 'number' as const },
    { value: '.', display: '.', type: 'number' as const },
    { value: '=', display: '=', type: 'equals' as const },
    { value: '+', display: '+', type: 'operator' as const },
  ];

  return (
    <div className="grid grid-rows-5 grid-cols-4 gap-3 flex-[2] mt-10">
      {buttons.map((button, index) => (
        <CalculatorButton
          key={index}
          value={button.value}
          display={button.display}
          type={button.type}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
};

export default CalculatorKeypad;