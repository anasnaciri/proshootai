import { PropsWithChildren } from 'react';

// Separate interface for IconButton props
interface IconButtonProps<T extends string> extends PropsWithChildren {
  tab: T;
  isActive: boolean;
  onClick: (tab: T) => void;
}

// Extract IconButton as a separate component
export const IconButton = <T extends string>({
  children,
  tab,
  isActive,
  onClick,
}: IconButtonProps<T>) => {
  return (
    <button
      className={`p-1 flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer transition-colors duration-200 text-xs font-extralight hover:text-primary-400 ${isActive ? 'text-primary-600' : 'text-zinc-400'}`}
      onClick={() => onClick(tab)}
      aria-label={`Switch to ${tab} tab`}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};
