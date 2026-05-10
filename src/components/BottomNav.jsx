import { Search, LayoutGrid, PlusCircle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="floating-nav w-[90%] max-w-md">
      <NavLink 
        to="/explore" 
        className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : 'text-gray-500 hover:text-secondary hover:bg-gray-50'}`}
      >
        <Search size={20} />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Explore</span>
      </NavLink>
      
      <NavLink 
        to="/" 
        className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : 'text-gray-500 hover:text-secondary hover:bg-gray-50'}`}
      >
        <LayoutGrid size={20} />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Board</span>
      </NavLink>

      <NavLink 
        to="/lend" 
        className={({ isActive }) => `nav-item ${isActive ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'text-primary hover:bg-primary/10'}`}
      >
        <PlusCircle size={28} />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Lend</span>
      </NavLink>

      <NavLink 
        to="/profile" 
        className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : 'text-gray-500 hover:text-secondary hover:bg-gray-50'}`}
      >
        <User size={20} />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
