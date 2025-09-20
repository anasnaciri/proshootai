import { NavLink } from 'react-router';
import { Folders, Grid2x2Check, Home, LayoutTemplate } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="h-100 flex flex-col bg-dark-primary border border-t-0 border-b-0 border-l-0 border-r-zinc-600 items-center justify-between">
      <nav className="h-full p-2 flex flex-col justify-start items-center gap-2  ">
        <NavLink
          className={({ isActive }) => {
            return `p-2 flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer transition-colors duration-200 text-xs font-extralight hover:text-primary-400 ${isActive ? 'text-primary-600' : 'text-zinc-400'}`;
          }}
          to={'/'}
        >
          <Home size={24} />
          <p>Home</p>
        </NavLink>
        <NavLink
          className={({ isActive }) => {
            return `p-2 flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer transition-colors duration-200 text-xs font-extralight hover:text-primary-400 ${isActive ? 'text-primary-600' : 'text-zinc-400'}`;
          }}
          to={'/projects'}
        >
          <Folders size={24} />
          <p>Projects</p>
        </NavLink>
        <NavLink
          className={({ isActive }) => {
            return `p-2 flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer transition-colors duration-200 text-xs font-extralight hover:text-primary-400 ${isActive ? 'text-primary-600' : 'text-zinc-400'}`;
          }}
          to={'/generations'}
        >
          <Grid2x2Check size={24} />
          <p>Generations</p>
        </NavLink>
        <NavLink
          className={({ isActive }) => {
            return `p-2 flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer transition-colors duration-200 text-xs font-extralight hover:text-primary-400 ${isActive ? 'text-primary-600' : 'text-zinc-400'}`;
          }}
          to={'/templates'}
        >
          <LayoutTemplate size={24} />
          <p>Templates</p>
        </NavLink>
      </nav>
      <p className="text-s mb-10 text-zinc-600">
        <a href="mailto:someone@example.com">Support</a>
      </p>
    </div>
  );
};

export default Sidebar;
