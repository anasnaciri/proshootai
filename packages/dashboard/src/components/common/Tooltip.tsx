import { Info, AlertCircle } from 'lucide-react';

export const Tooltip = ({
  children,
  content,
  position = 'top',
  icon = 'info',
  variant = 'dark',
}: {
  children?: React.ReactNode;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: 'info' | 'alert';
  variant: 'dark' | 'light' | 'accent' | 'red';
}) => {
  const icons = {
    info: <Info size={16} />,
    alert: <AlertCircle size={16} />,
  };

  const positions = {
    top: 'fixed -translate-y-full -translate-x-1/2 -mt-2',
    bottom: 'fixed translate-y-full -translate-x-1/2 mt-2',
    left: 'fixed -translate-x-full -translate-y-1/2 -ml-2',
    right: 'fixed translate-x-full -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
  };

  const variants = {
    dark: 'bg-dark-primary border border-dark-secondary text-white',
    light: 'bg-white text-gray-800 border border-gray-200',
    accent: 'bg-white text-gray-800 border border-accent-500',
    red: 'bg-red-500 text-white',
  };

  return (
    <div className="relative inline-flex items-center group z-50">
      <div className="cursor-pointer">{children || icons[icon]}</div>

      <div
        className={`
          invisible opacity-0 
          group-hover:visible group-hover:opacity-100
         
          ${positions[position]}
          ${variants[variant]}
          px-3 
          py-2 
          text-sm 
          rounded-lg 
          whitespace-nowrap 
          z-50
          shadow-lg
          transition-opacity
          duration-200
        `}
      >
        {content}
        <div
          className={`
            fixed 
            w-2 
            h-2 
            transform
            border-t-0
            border-l-0
            ${arrows[position]}
            ${variant === 'light' ? 'bg-white border border-gray-200' : variants[variant]}
          `}
        />
      </div>
    </div>
  );
};
