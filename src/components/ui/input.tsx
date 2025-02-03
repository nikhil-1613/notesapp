import React from "react";

interface InputProps {
  placeholder: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ placeholder, className }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`px-4 py-2 border rounded-md ${className}`}
    />
  );
};
