import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import CategoryBar from './CategoryBar';
import { Search, Bell, UserCircle, X, Leaf } from 'lucide-react';

const Layout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Show category bar on home, board, and explore pages
  const showCategoryBar = ['/', '/board', '/explore'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Overlay for Mobile */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[100] p-24 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-16 mb-32">
            <div className="relative flex-1">
              <Search className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input 
                autoFocus
                type="text" 
                placeholder="מה תרצו לשכור היום?" 
                className="w-full bg-gray-100 border-none rounded-full pr-52 pl-16 py-16 text-lg outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <button onClick={() => setIsSearchOpen(false)} className="p-12 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <X size={28} />
            </button>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-20 uppercase tracking-widest">חיפושים פופולריים</h3>
            <div className="flex flex-wrap gap-12">
              {["מקדחה", "אוהל", "מיקסר", "מקרן", "אופניים"].map(term => (
                <button key={term} className="px-20 py-10 bg-gray-50 border border-gray-100 rounded-full text-sm font-medium hover:bg-white hover:border-secondary hover:text-secondary transition-all shadow-sm">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="glass-header sticky top-0 z-50 px-16 md:px-48 h-20 flex items-center justify-between gap-24">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-12 transition-all hover:opacity-80 active:scale-95 flex-shrink-0">
          <div className="w-12 h-12 bg-primary rounded-16 flex items-center justify-center shadow-xl shadow-primary/30">
            <Leaf size={24} className="text-white" />
          </div>
          <div className="flex flex-col -gap-4 hidden sm:flex">
            <span className="text-primary text-2xl font-black tracking-tighter leading-none">Sharehood</span>
            <span className="text-[10px] text-primary/60 font-bold uppercase tracking-[0.2em] leading-none">Community First</span>
          </div>
        </Link>
        
        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-auto">
          <div className="relative w-full group">
            <Search className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="מה תרצו לשכור היום? (למשל: מקדחה, אוהל...)" 
              className="w-full bg-gray-50/50 border border-gray-200 rounded-full pr-48 pl-20 py-12 text-sm focus:ring-4 focus:ring-secondary/10 focus:bg-white focus:border-secondary transition-all outline-none shadow-inner"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-8 md:gap-20 flex-shrink-0">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-10 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <Search size={24} />
          </button>
          
          
          <Link to="/profile" className="flex items-center gap-12 p-6 pr-16 rounded-full bg-gray-50 border border-gray-100 hover:border-secondary/30 transition-all group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm group-hover:scale-110 transition-transform">
              <UserCircle size={28} />
            </div>
            <span className="text-sm font-bold text-gray-700 hidden md:block">החשבון שלי</span>
          </Link>
        </div>
      </header>

      {showCategoryBar && <CategoryBar />}
      
      <main className={`max-w-7xl mx-auto px-16 pb-32 mb-32 ${showCategoryBar ? 'pt-8' : 'pt-24 md:pt-40'}`}>
        <Outlet />
      </main>


      <BottomNav />
    </div>
  );
};

export default Layout;
