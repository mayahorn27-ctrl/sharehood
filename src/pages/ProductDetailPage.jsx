import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id)) || MOCK_PRODUCTS[0];

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-4 text-secondary font-medium mb-16 hover:translate-x-4 transition-transform"
      >
        <ChevronRight size={20} />
        חזרה ללוח
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
        <div className="rounded-16 overflow-hidden shadow-xl h-96 relative group">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute top-16 left-16 bg-white/90 backdrop-blur-md px-12 py-6 rounded-full text-xs font-bold flex items-center gap-4 shadow-sm">
            <Star size={14} className="text-accent fill-accent" />
            <span>{product.rating}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-16">
            <h1 className="text-3xl font-bold mb-8">{product.name}</h1>
            <div className="flex items-center gap-8">
              <span className="text-gray-500 text-sm">({product.reviews} ביקורות)</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-primary">במלאי</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-secondary mb-24">
            ₪{product.price} <span className="text-sm font-normal text-gray-500">/ יום</span>
          </div>

          <div className="space-y-16 mb-32 bg-gray-50 p-20 rounded-12 border border-gray-100">
            <div className="flex items-center gap-12 text-gray-700">
              <MapPin size={20} className="text-secondary" />
              <span className="text-sm font-medium">{product.location}</span>
            </div>
            <div className="flex items-center gap-12 text-gray-700">
              <Clock size={20} className="text-secondary" />
              <span className="text-sm font-medium">זמן תגובה: {product.lender.responseTime}</span>
            </div>
            <div className="flex items-center gap-12 text-gray-700">
              <ShieldCheck size={20} className="text-primary" />
              <span className="text-sm font-medium">מבוטח בכיסוי Sharehood</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="btn-primary w-full py-16 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-8"
          >
            הזמן עכשיו
          </button>
        </div>
      </div>

      <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-32">
        <div className="md:col-span-2 space-y-48">
          <section>
            <h2 className="text-2xl font-bold mb-16 border-b border-gray-100 pb-8">תיאור הפריט</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
          </section>

          <section>
            <div className="flex items-center justify-between mb-24">
              <h2 className="text-2xl font-bold">ביקורות</h2>
              <div className="flex items-center gap-8 bg-accent/10 px-12 py-6 rounded-full text-accent font-bold">
                <Star size={18} className="fill-accent" />
                <span>{product.rating}</span>
                <span className="text-sm font-normal text-gray-500">({product.reviews})</span>
              </div>
            </div>

            <div className="space-y-24">
              {product.reviewsList?.map((review) => (
                <div key={review.id} className="bg-white p-24 rounded-16 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-12">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                        {review.user.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold">{review.user}</div>
                        <div className="text-xs text-gray-400">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={`${i < review.rating ? 'text-accent fill-accent' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
              {(!product.reviewsList || product.reviewsList.length === 0) && (
                <div className="text-center py-32 text-gray-400 bg-gray-50 rounded-16 border-2 border-dashed border-gray-200">
                  טרם נכתבו ביקורות למוצר זה.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-24 self-start sticky top-32">
          <div className="bg-white p-24 rounded-16 border border-gray-100 shadow-xl">
            <h2 className="text-lg font-bold mb-16">המשאיל</h2>
            <div className="flex items-center gap-16 mb-24">
              <div className="relative">
                <img src={product.lender.image} alt={product.lender.name} className="w-14 h-14 rounded-full border-2 border-secondary/20" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <div className="font-bold text-lg">{product.lender.name}</div>
                <div className="text-xs text-gray-500 italic">חבר מ-{product.lender.joined}</div>
              </div>
            </div>
            <button className="w-full border-2 border-secondary text-secondary py-10 rounded-12 font-bold hover:bg-secondary hover:text-white transition-all active:scale-95">
              שלח הודעה
            </button>
          </div>

          <div className="bg-primary/5 p-20 rounded-16 border border-primary/10">
            <h3 className="font-bold text-primary mb-8 flex items-center gap-8">
              <ShieldCheck size={18} />
              השכרה בטוחה
            </h3>
            <p className="text-xs text-primary/70 leading-relaxed">
              כל השכרה ב-Sharehood מבוטחת ומפוקחת. אנחנו דואגים לציוד שלך ולביטחון שלך.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetailPage;
