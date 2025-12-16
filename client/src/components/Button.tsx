import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-2xl font-semibold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200",
    secondary: "bg-stone-800 text-white hover:bg-stone-900 shadow-stone-300",
    outline: "bg-white border-2 border-rose-200 text-rose-500 hover:bg-rose-50"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};