import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Construction, 
  Tent, 
  Utensils, 
  Sofa, 
  Radio,
  Gamepad2, 
  Baby, 
  TreePine,
  LayoutGrid
} from 'lucide-react';

const CATEGORIES_WITH_ICONS = [
  { name: "הכל", icon: LayoutGrid },
  { name: "כלי עבודה", icon: Construction },
  { name: "מחנאות", icon: Tent },
  { name: "מטבח", icon: Utensils },
  { name: "אירוח", icon: Sofa },
  { name: "אלקטרוניקה", icon: Radio },
  { name: "גיימינג", icon: Gamepad2 },
  { name: "תינוקות", icon: Baby },
  { name: "גינה", icon: TreePine },
];

const CategoryBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentCategory = searchParams.get('category') || "הכל";

  const handleCategoryClick = (categoryName) => {
    if (window.location.pathname !== '/board' && window.location.pathname !== '/') {
      navigate(`/board?category=${categoryName}`);
    } else {
      setSearchParams({ category: categoryName });
    }
  };

  return (
    <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-16">
        <div className="flex items-center gap-16 md:gap-24 overflow-x-auto py-12 no-scrollbar justify-start md:justify-center">
          {CATEGORIES_WITH_ICONS.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentCategory === cat.name;
            
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex flex-col items-center gap-8 min-w-fit transition-all group pb-8 border-b-2 ${
                  isActive 
                    ? 'border-secondary text-secondary' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                }`}
              >
                <div className={`transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                  <Icon size={24} />
                </div>
                <span className={`text-xs font-bold whitespace-nowrap`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
