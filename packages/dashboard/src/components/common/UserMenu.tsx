import { useLogout } from '@/features/auth/hooks/useLogout';
import { LogOut, User, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleUserMenu } from '@/store/ui.slice';

interface UserMenuProps {
  email: string;
  plan: string | undefined;
  username: string | undefined;
}

const UserMenu = ({ email, plan = 'Free Plan', username }: UserMenuProps) => {
  const { isUserMenuOpen } = useAppSelector((state) => state.ui);
  const { handleLogout } = useLogout();
  if (!isUserMenuOpen) return null;

  return (
    <div className="absolute right-0 -bottom-1 z-50 translate-y-full mt-2 w-56 bg-dark-primary rounded-lg shadow-lg ring-1 ring-zinc-500 font-light">
      <div className="py-1">
        <div className="px-4 py-2 text-sm text-white border-b border-zinc-500">
          <p className="font-medium">{username}</p>
          <p className="text-zinc-500 text-xs">{email}</p>
          <p className="text-zinc-500 text-xs">{plan}</p>
        </div>

        <MenuItem pathname="/profile" icon={<User size={16} />}>
          Profile
        </MenuItem>
        <MenuItem pathname="/susbsription" icon={<CreditCard size={16} />}>
          Manage Subscription
        </MenuItem>

        <div className="border-t border-zinc-500" onClick={handleLogout}>
          <MenuItem icon={<LogOut size={16} />} className="text-red-600">
            Sign out
          </MenuItem>
        </div>
      </div>
    </div>
  );
};

interface MenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  pathname?: string;
}

const MenuItem = ({
  children,
  icon,
  className = '',
  pathname = '',
}: MenuItemProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(toggleUserMenu());

    navigate(pathname);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full px-4 py-2 text-sm text-left flex items-center space-x-2 hover:bg-dark-secondary text-white ${className}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default UserMenu;
