import Avatar from './Avatar';
import Logo from './Logo';
import { useAuth } from 'react-oidc-context';
import UserMenu from './UserMenu';
import { useAppDispatch } from '../../store/hooks';
import { toggleUserMenu } from '../../store/ui.slice';

const Header = () => {
  const auth = useAuth();
  const username = auth.user?.profile.name as string;
  const email = auth.user?.profile.email as string;

  const dispatch = useAppDispatch();

  const handleToggleMenu = () => {
    dispatch(toggleUserMenu());
  };

  return (
    <div className="w-screen py-3 px-5 flex justify-between items-center bg-dark-primary border border-b-zinc-500 border-t-0 border-x-0 text-white">
      <Logo link="../" />
      <div className="relative flex gap-2 text-zinc-500 text-xs md:text-sm">
        <button onClick={handleToggleMenu}>
          <Avatar name={username} />
        </button>
        <UserMenu email={email} username={username} plan={undefined} />
      </div>
    </div>
  );
};

export default Header;
