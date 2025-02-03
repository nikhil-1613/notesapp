import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "outline" | "filled";
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "filled", className, onClick }) => {
  const baseStyles = "px-4 py-2 rounded-md font-semibold transition-all";

  const variantStyles = variant === "outline" 
    ? "border border-gray-400 text-gray-700 hover:bg-gray-100" 
    : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
