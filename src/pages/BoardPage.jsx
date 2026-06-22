import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../supabaseClient';

const BoardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || "הכל";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);


      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            rating: Number(p.rating || 4.5),
            reviews: p.reviews || 0,
            category: p.category,
            location: p.location,
            description: p.description,
            image: p.image,
            lender: {
              name: p.lender_name,
              responseTime: p.lender_response_time,
              joined: p.lender_joined,
              image: p.lender_image
            }
          }));
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products from Supabase:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSearchParams({ category: cat });
  };

  const searchTerm = searchParams.get('search')?.toLowerCase() || '';
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "הכל" || p.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      (p.name && p.name.toLowerCase().includes(searchTerm)) || 
      (p.description && p.description.toLowerCase().includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-24">
      <section>
        <div className="flex justify-between items-center mb-24">
          <div>
            <h2 className="text-2xl font-bold">זמין עכשיו בקרבתך</h2>
            {loading ? (
              <p className="text-gray-500 text-sm">טוען פריטים...</p>
            ) : (
              <p className="text-gray-500 text-sm">מציג {filteredProducts.length} פריטים בקטגוריית {selectedCategory}</p>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-64 bg-white rounded-8 border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-500 mt-16 font-medium">טוען מוצרים...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-64 bg-white rounded-8 border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">לא נמצאו מוצרים בקטגוריה זו כרגע.</p>
            <button 
              onClick={() => handleCategoryChange("הכל")}
              className="text-secondary font-bold mt-8 hover:underline"
            >
              הצג את כל המוצרים
            </button>
          </div>
        )}
      </section>

      <section className="bg-primary rounded-8 p-32 text-white flex flex-col md:flex-row items-center justify-between gap-24 overflow-hidden relative shadow-xl">
        <div className="z-10">
          <h2 className="text-2xl font-bold mb-8 text-white">יש לכם ציוד שאינו בשימוש?</h2>
          <p className="opacity-90 mb-24 max-w-md text-green-50">הצטרפו לקהילה והתחילו להרוויח מהשכרת הציוד שלכם. זה פשוט, בטוח ומשתלם.</p>
          <Link to="/lend" className="bg-white text-primary px-24 py-12 rounded-8 font-bold inline-block hover:bg-gray-100 transition-all active:scale-95 shadow-md">
            העלו מוצר ראשון עכשיו
          </Link>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-24 rounded-8 border border-white/20 z-10">
          <div className="text-sm opacity-80 mb-4">רווח שבועי ממוצע</div>
          <div className="text-3xl font-bold">₪450+</div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

export default BoardPage;
