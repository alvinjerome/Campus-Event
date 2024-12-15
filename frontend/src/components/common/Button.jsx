import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  icon,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-90 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90 focus:ring-green-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90 focus:ring-red-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={!disabled && { scale: 1.02 }}
      whileTap={!disabled && { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabledStyles}
        ${widthStyles}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button; 