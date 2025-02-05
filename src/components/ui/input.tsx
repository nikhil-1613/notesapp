import React from "react";

// Directly extend React.InputHTMLAttributes if no custom props are needed
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`px-4 py-2 border rounded ${className || ""}`}
        {...props}
      />
    );
  }
);

// Set displayName for React.forwardRef components
Input.displayName = "Input";

export { Input };

// // src/components/ui/input.tsx
// import React from "react";

// export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   // You can add any custom props here if needed
// }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, ...props }, ref) => {
//     return (
//       <input
//         ref={ref}
//         className={`px-4 py-2 border rounded ${className || ""}`}
//         {...props}
//       />
//     );
//   }
// );

// // Input.displayName = "Input";
// export { Input };
// import React from "react";

// interface InputProps {
//   placeholder: string;
//   className?: string;
// }

// export const Input: React.FC<InputProps> = ({ placeholder, className }) => {
//   return (
//     <input
//       type="text"
//       placeholder={placeholder}
//       className={`px-4 py-2 border rounded-md ${className}`}
//     />
//   );
// };
