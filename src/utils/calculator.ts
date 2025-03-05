/**
 * A simple calculator utility that can evaluate mathematical expressions
 */

export type OperationType = '+' | '-' | '*' | '/' | '^' | '%';
export type OperandType = number | string;

/**
 * Evaluates a mathematical expression string and returns the result
 * This function safely evaluates mathematical expressions using Function constructor
 * with security checks to prevent code injection
 * @param expression The expression to evaluate
 * @returns The calculated result or an error message
 */
export function evaluateExpression(expression: string): number | string {
  // Replace all × with *, ÷ with /, and ^ with ** for JavaScript evaluation
  const normalizedExpression = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\^/g, '**')
    .replace(/%/g, '*0.01');
  
  try {
    // Clean the expression
    const cleanedExpression = normalizedExpression.trim();
    
    // Safety check - only allow numbers and operators
    if (!/^[0-9+\-*/()%. ]*$/.test(cleanedExpression)) {
      return 'Error';
    }
    
    // For empty expressions, return 0
    if (!cleanedExpression) {
      return 0;
    }
    
    // Evaluate the expression
    // eslint-disable-next-line no-new-func
    const result = Function('return ' + cleanedExpression)();
    
    // If result is not a finite number, return error
    if (typeof result !== 'number' || !isFinite(result)) {
      return 'Error';
    }
    
    return result;
  } catch (error) {
    // If evaluation fails, return error
    return 'Error';
  }
}

/**
 * Formats a number for display in the calculator
 * @param num The number to format
 * @returns The formatted number as a string
 */
export function formatNumber(num: number | string): string {
  if (typeof num !== 'number' || !isFinite(num)) {
    return String(num);
  }
  
  // Convert to string and split on decimal point
  const parts = num.toString().split('.');
  
  // Format the integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Join back with decimal point if it exists
  return parts.join('.');
}

/**
 * Determines appropriate font size for calculator display based on content length
 * @param expressionLength Length of the expression or result string
 * @returns CSS class name for the font size
 */
export function getDisplayFontSize(expressionLength: number): string {
  if (expressionLength > 20) {
    return 'text-lg';
  } else if (expressionLength > 15) {
    return 'text-xl';
  } else if (expressionLength > 10) {
    return 'text-2xl';
  } else {
    return 'text-3xl';
  }
}

/**
 * Determines appropriate font size for the input expression
 * @param expressionLength Length of the expression string
 * @returns CSS class name for the font size
 */
export function getInputFontSize(expressionLength: number): string {
  if (expressionLength > 25) {
    return 'text-sm';
  } else if (expressionLength > 20) {
    return 'text-base';
  } else if (expressionLength > 15) {
    return 'text-lg';
  } else {
    return 'text-xl';
  }
}