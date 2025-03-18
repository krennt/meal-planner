import React from 'react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
  className?: string;
}

/**
 * A reusable component for controlling quantities with increment/decrement buttons
 */
export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxQuantity = 99,
  className = '',
}: QuantityControlProps) {
  // Ensure quantity is within bounds
  const safeQuantity = Math.max(minQuantity, Math.min(maxQuantity, quantity));
  
  // Handler for decrement button
  const handleDecrease = () => {
    if (safeQuantity > minQuantity) {
      onDecrease();
    }
  };
  
  // Handler for increment button
  const handleIncrease = () => {
    if (safeQuantity < maxQuantity) {
      onIncrease();
    }
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleDecrease}
        disabled={safeQuantity <= minQuantity}
        className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2.5 rounded-l transition-colors duration-200
          ${safeQuantity <= minQuantity ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
        aria-label="Decrease quantity"
        type="button"
      >
        -
      </button>
      
      <span className="bg-gray-100 py-1 px-3 select-none min-w-[30px] text-center" aria-label="Current quantity">
        {safeQuantity}
      </span>
      
      <button
        onClick={handleIncrease}
        disabled={safeQuantity >= maxQuantity}
        className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2.5 rounded-r transition-colors duration-200
          ${safeQuantity >= maxQuantity ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
        aria-label="Increase quantity"
        type="button"
      >
        +
      </button>
    </div>
  );
}
