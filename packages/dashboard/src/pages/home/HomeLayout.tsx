import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router';
const HomeLayout = () => {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
