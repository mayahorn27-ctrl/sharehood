import { Search, Construction, Tent, Utensils, Sofa, Radio, Gamepad2, Baby, TreePine } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
const CATEGORIES = [
  { name: "כלי עבודה", icon: Construction, color: "bg-orange-100 text-orange-600" },
  { name: "מחנאות", icon: Tent, color: "bg-green-100 text-green-600" },
  { name: "מטבח", icon: Utensils, color: "bg-red-100 text-red-600" },
  { name: "אירוח", icon: Sofa, color: "bg-blue-100 text-blue-600" },
  { name: "אלקטרוניקה", icon: Radio, color: "bg-purple-100 text-purple-600" },
  { name: "גיימינג", icon: Gamepad2, color: "bg-indigo-100 text-indigo-600" },
  { name: "תינוקות", icon: Baby, color: "bg-pink-100 text-pink-600" },
  { name: "גינה", icon: TreePine, color: "bg-emerald-100 text-emerald-600" },
];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/board?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  const handleChange = (e) => setSearchTerm(e.target.value);
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/board?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-32">
      {/* Hero Search Section */}
      <section className="text-center space-y-16 py-16">
        <h1 className="text-3xl font-bold tracking-tight">גלו ציוד בקרבתכם</h1>
        <p className="text-gray-500">חפשו בין אלפי פריטים שזמינים להשאלה מהשכנים שלכם</p>
        
        <div className="relative max-w-2xl mx-auto mt-24">
          <Search className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="מה תרצו לשכור היום?" 
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border border-gray-200 rounded-full pr-48 pl-16 py-16 shadow-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-lg"
          />
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex justify-between items-center mb-24">
          <h2 className="text-xl font-bold">דפדוף לפי קטגוריה</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
          {CATEGORIES.map((cat, index) => (
            <Link 
              key={index} 
              to={`/board?category=${cat.name}`}
              className="card group hover:border-secondary flex flex-col items-center gap-12 text-center transition-all"
            >
              <div className={`p-16 rounded-full ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon size={28} />
              </div>
              <span className="font-bold text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
