import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const DoodleButton: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyles = "font-doodle text-lg transition-all duration-200 active:translate-y-1 active:shadow-none border-2 border-black rounded-sm px-6 py-2 relative";
  
  const variants = {
    primary: "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50",
    secondary: "bg-stone-200 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:bg-stone-100",
    danger: "bg-red-50 text-red-600 border-red-600 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] hover:bg-red-100"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const DoodleInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input 
      {...props}
      className={`font-hand text-xl border-b-2 border-black bg-transparent focus:outline-none focus:border-stone-500 px-2 py-1 placeholder-stone-400 w-full ${props.className || ''}`}
    />
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-paper border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.5)] p-6 max-w-md w-full relative animate-bounce-in">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-doodle hover:text-red-500"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};
