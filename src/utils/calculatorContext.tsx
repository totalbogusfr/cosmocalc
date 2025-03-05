import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { evaluateExpression } from './calculator';

type CalculatorContextType = {
  expression: string;
  result: string | number;
  setExpression: (expression: string) => void;
  clearExpression: () => void;
  addToExpression: (value: string) => void;
  calculateResult: () => void;
  deleteLastCharacter: () => void;
};

// Create the context with an undefined value
const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

interface CalculatorProviderProps {
  children: ReactNode;
}

// Provider component that makes calculator context available to any child component
export const CalculatorProvider: React.FC<CalculatorProviderProps> = ({ children }) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | number>(0);

  // Evaluate the expression whenever it changes
  useEffect(() => {
    if (expression) {
      const result = evaluateExpression(expression);
      setResult(result);
    } else {
      setResult(0);
    }
  }, [expression]);

  // Clear the expression
  const clearExpression = useCallback(() => {
    setExpression('');
  }, []);

  // Add a character to the expression
  const addToExpression = useCallback((value: string) => {
    setExpression(prev => {
      // Handle special cases for operators
      const lastChar = prev.slice(-1);
      const operators = ['+', '-', '*', '/', '\u00d7', '\u00f7', '%', '^'];
      
      // If last character is an operator and new value is also an operator,
      // replace the last operator
      if (operators.includes(lastChar) && operators.includes(value)) {
        return prev.slice(0, -1) + value;
      }
      
      // Handle percentage operations appropriately
      if (value === '%' && /\d$/.test(prev)) {
        // If there's a number before the %, treat it as multiplying by 0.01
        return prev + value;
      }

      // Handle decimal point - prevent double decimal points in the same number
      if (value === '.') {
        // Split by operators to get the current number being entered
        const parts = prev.split(/[+\-*/^]/);
        const currentNumber = parts[parts.length - 1];
        
        // If current number already has a decimal point, don't add another
        if (currentNumber.includes('.')) {
          return prev;
        }
      }
      
      return prev + value;
    });
  }, []);

  // Calculate final result and set it as the new expression
  const calculateResult = useCallback(() => {
    const calculatedResult = evaluateExpression(expression);
    if (calculatedResult !== 'Error') {
      setExpression(calculatedResult.toString());
    }
  }, [expression]);

  // Delete the last character from the expression
  const deleteLastCharacter = useCallback(() => {
    setExpression(prev => prev.slice(0, -1));
  }, []);

  // Value to be provided to consumers of this context
  const value = {
    expression,
    result,
    setExpression,
    clearExpression,
    addToExpression,
    calculateResult,
    deleteLastCharacter,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

// Custom hook to use calculator context
export const useCalculator = (): CalculatorContextType => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};