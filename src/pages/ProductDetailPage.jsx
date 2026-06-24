import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, ShieldCheck, ChevronRight, X, Phone, Mail } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [hasRented, setHasRented] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);


      try {
        // Fetch product details with lender contact info
        const { data: pData, error: pErr } = await supabase
          .from('products')
          .select('*, lender:users(*)')
          .eq('id', id)
          .single();

        if (pErr) throw pErr;
        if (!pData) {
          setLoading(false);
          return;
        }

        // Fetch reviews
        const { data: rData, error: rErr } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', id);

        const reviewsList = rData ? rData.map(r => ({
          id: r.id,
          user: r.user_name,
          rating: Number(r.rating),
          date: r.date_text,
          comment: r.comment
        })) : [];

        const trueReviewCount = reviewsList.length;
        const trueRating = trueReviewCount > 0 
          ? Number((reviewsList.reduce((acc, curr) => acc + curr.rating, 0) / trueReviewCount).toFixed(1))
          : 0;

        const mappedProduct = {
          id: pData.id,
          name: pData.name,
          price: Number(pData.price),
          rating: trueReviewCount > 0 ? trueRating : "חדש",
          reviews: trueReviewCount,
          category: pData.category,
          location: pData.location,
          description: pData.description,
          image: pData.image,
          lender: {
            name: pData.lender_name,
            responseTime: pData.lender_response_time,
            joined: pData.lender_joined,
            image: pData.lender_image,
            // עדיפות: עמודות products ← לאחר מכן join עם users
            phone: pData.lender_phone || pData.lender?.phone || 'לא הוזן',
            email: pData.lender_email || pData.lender?.email || 'לא הוזן'
          },
          reviewsList
        };

        setProduct(mappedProduct);
      } catch (err) {
        console.error("Error fetching product details from Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const checkBooking = async () => {
      if (authUser && id) {
        try {
          const { data } = await supabase
            .from('bookings')
            .select('id')
            .eq('product_id', id)
            .eq('user_id', authUser.id)
            .limit(1);
          if (data && data.length > 0) {
            setHasRented(true);
          }
        } catch (err) {
          console.error("Error checking bookings:", err);
        }
      }
    };
    checkBooking();
  }, [authUser, id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return alert('נא להזין תוכן לביקורת');
    setIsSubmittingReview(true);
    
    try {
      const newReview = {
        product_id: id,
        user_name: authUser.user_metadata?.full_name || authUser.email || 'משתמש',
        rating: reviewForm.rating,
        date_text: 'היום',
        comment: reviewForm.comment
      };
      
      const { data, error } = await supabase.from('reviews').insert([newReview]).select();
      if (error) throw error;
      
      const addedReview = {
        id: data?.[0]?.id || Date.now(),
        user: newReview.user_name,
        rating: newReview.rating,
        date: newReview.date_text,
        comment: newReview.comment
      };
      
      setProduct(prev => {
        const newReviewsList = [addedReview, ...prev.reviewsList];
        const newCount = newReviewsList.length;
        const newAvg = (newReviewsList.reduce((acc, curr) => acc + curr.rating, 0) / newCount).toFixed(1);
        return {
          ...prev,
          reviewsList: newReviewsList,
          reviews: newCount,
          rating: Number(newAvg)
        };
      });
      
      setReviewForm({ rating: 5, comment: '' });
      alert('הביקורת נוספה בהצלחה!');
    } catch (err) {
      console.error("Error submitting review:", err);
      alert('אירעה שגיאה בשמירת הביקורת.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-500 mt-16 font-medium">טוען פרטי מוצר...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-64">
        <p className="text-gray-500 font-medium">המוצר לא נמצא.</p>
        <button onClick={() => navigate('/board')} className="text-secondary font-bold mt-8 hover:underline">
          חזרה ללוח
        </button>
      </div>
    );
  }

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
            onClick={() => navigate('/checkout', { state: { productId: product.id } })}
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

            {hasRented && (
              <div className="bg-gray-50 p-24 rounded-16 border border-gray-200 mb-24">
                <h3 className="font-bold text-lg mb-16 text-gray-800">השאלת פריט זה בעבר? נשמח לביקורת!</h3>
                <form onSubmit={handleSubmitReview} className="space-y-16">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-8">דירוג</label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            size={28} 
                            className={`${star <= reviewForm.rating ? 'text-accent fill-accent' : 'text-gray-300'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-8">הביקורת שלך</label>
                    <textarea
                      required
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="איך היה הציוד? איך היה המשאיל?"
                      className="input-field w-full h-24 resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="btn-primary w-full sm:w-auto px-24 py-10 rounded-8 font-bold disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'שומר...' : 'פרסם ביקורת'}
                  </button>
                </form>
              </div>
            )}

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
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="w-full border-2 border-secondary text-secondary py-10 rounded-12 font-bold hover:bg-secondary hover:text-white transition-all active:scale-95"
            >
              יצירת קשר
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

      {/* Message Modal */}
      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-16 animate-in fade-in duration-200 backdrop-blur-sm">
          <div className="bg-white rounded-24 p-32 w-full max-w-sm shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-24 border-b border-gray-100 pb-16">
              <h3 className="text-xl font-bold text-gray-800">יצירת קשר עם {product.lender.name}</h3>
              <button 
                onClick={() => setIsContactModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-8 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-20 mb-32">
              <a 
                href={`tel:${product.lender.phone}`} 
                className="flex items-center gap-16 p-16 rounded-16 bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">טלפון נייד</div>
                  <div className="font-bold text-lg text-gray-800" dir="ltr">{product.lender.phone}</div>
                </div>
              </a>

              <a 
                href={`mailto:${product.lender.email}?subject=התעניינות ב${product.name}`} 
                className="flex items-center gap-16 p-16 rounded-16 bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">אימייל</div>
                  <div className="font-bold text-gray-800 break-all" dir="ltr">{product.lender.email}</div>
                </div>
              </a>
            </div>
            
            <button 
              onClick={() => setIsContactModalOpen(false)}
              className="w-full border-2 border-gray-200 text-gray-600 py-12 rounded-16 font-bold hover:bg-gray-50 transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
