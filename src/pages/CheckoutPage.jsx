import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Smartphone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

// ── Inline logos ─────────────────────────────────────────────────────────────
const BitLogo = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 48, height: 30, borderRadius: 7,
    background: '#FF4D00', color: '#fff',
    fontWeight: 900, fontSize: 14, fontFamily: 'sans-serif',
  }}>bit</span>
);

const PayBoxLogo = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 68, height: 30, borderRadius: 7,
    background: '#1A237E', color: '#fff',
    fontWeight: 900, fontSize: 11, fontFamily: 'sans-serif', letterSpacing: '0.5px',
  }}>PayBox</span>
);

const PAYMENT_METHODS = [
  { id: 'bit', label: 'Bit', Logo: BitLogo, color: '#FF4D00' },
  { id: 'paybox', label: 'PayBox', Logo: PayBoxLogo, color: '#1A237E' },
];

// ── Site owner phone for service fee collection ───────────────────────────────
const SITE_OWNER_PHONE = '0523215466'; // 🔧 שנה למספר שלך!

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, loading: authLoading } = useAuth();
  const productId = location.state?.productId || 1;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('bit');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [paymentModal, setPaymentModal] = useState(null); // { phone, amount, method, productName }
  const [form, setForm] = useState({ fullName: '', phone: '', email: '' });

  const serviceFee = 5;

  // Pre-fill form from logged-in user
  useEffect(() => {
    if (authUser) {
      setForm(f => ({
        ...f,
        fullName: authUser.user_metadata?.full_name || '',
        email: authUser.email || '',
      }));
    }
  }, [authUser]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products').select('*').eq('id', productId).single();
        if (error) throw error;
        setProduct(data
          ? { id: data.id, name: data.name, price: Number(data.price), image: data.image }
          : null);
      } catch (err) {
        console.error("Error fetching product for checkout:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const pricePerDay = product ? product.price : 40;
  const total = pricePerDay * days + serviceFee;

  const handlePayment = async () => {
    if (!product) return alert('לא ניתן לבצע הזמנה לפני טעינת המוצר.');
    if (!authUser) return alert('אנא היכנס/י לפני שמירת ההזמנה.');
    if (!recipientPhone.trim()) {
      return alert(`הכנס/י את מספר ה-${paymentMethod === 'bit' ? 'Bit' : 'PayBox'} של המשאיל/ה.`);
    }

    // Save booking
    try {
      await supabase.from('users').upsert([{
        id: authUser.id,
        full_name: form.fullName || authUser.email,
        email: authUser.email,
        phone: form.phone,
        avatar_url: authUser.user_metadata?.avatar_url || null,
        response_time: 'פחות משעה',
        location: 'לא ידוע',
        joined_at: new Date().toISOString(),
      }], { onConflict: 'id' });

      const { error } = await supabase.from('bookings').insert([{
        product_id: product.id, user_id: authUser.id,
        days, total_price: total, status: 'אושר',
      }]);
      if (error) throw error;
    } catch (err) {
      return alert(`שגיאה בשמירת ההזמנה: ${err.message}`);
    }

    // Show payment instructions modal
    setPaymentModal({
      phone: recipientPhone,
      lenderPhone: recipientPhone,
      rentalAmount: pricePerDay * days,
      serviceFee,
      amount: total,
      method: paymentMethod,
      productName: product.name,
    });
  };

  if (authLoading) return (
    <div className="flex flex-col items-center justify-center py-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p className="text-gray-500 mt-16 font-medium">טוען פרטי משתמש...</p>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p className="text-gray-500 mt-16 font-medium">טוען פרטי הזמנה...</p>
    </div>
  );

  const activeMethod = PAYMENT_METHODS.find(m => m.id === paymentMethod);

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Payment Instructions Modal ─────────────────────────────────── */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-16 py-24 overflow-y-auto">
          <div className="bg-white rounded-24 shadow-2xl max-w-md w-full p-28 text-center" dir="rtl">
            <div className="text-5xl mb-12">
              {paymentModal.method === 'bit' ? '🟠' : '🔵'}
            </div>
            <h2 className="text-2xl font-bold mb-6">ההזמנה אושרה! ✅</h2>
            <p className="text-gray-500 text-sm mb-20">
              יש לבצע <strong>שני תשלומים</strong> דרך{' '}
              <strong>{paymentModal.method === 'bit' ? 'Bit' : 'PayBox'}</strong>
            </p>

            {/* ── תשלום 1: שכירות למשאיל ───────────────────────── */}
            <div className="rounded-16 p-16 mb-14 text-right border-2"
              style={{
                background: paymentModal.method === 'bit' ? '#FFF3EE' : '#E8EAF6',
                borderColor: paymentModal.method === 'bit' ? '#FF4D00' : '#1A237E',
              }}
            >
              <div className="flex items-center gap-8 mb-10">
                <span className="text-base font-black" style={{ color: paymentModal.method === 'bit' ? '#FF4D00' : '#1A237E' }}>
                  תשלום 1 — שכירות למשאיל/ה
                </span>
              </div>
              <div className="space-y-8 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">מוצר</span>
                  <span className="font-bold">{paymentModal.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">סכום</span>
                  <span className="font-bold text-lg">₪{paymentModal.rentalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">טלפון</span>
                  <span className="font-bold font-mono text-lg">{paymentModal.lenderPhone}</span>
                </div>
              </div>
            </div>

            {/* ── תשלום 2: עמלת שירות לאתר ──────────────────────── */}
            <div className="rounded-16 p-16 mb-20 text-right border-2 border-gray-300 bg-gray-50">
              <div className="flex items-center gap-8 mb-10">
                <span className="text-base font-black text-gray-700">תשלום 2 — עמלת שירות לאתר</span>
              </div>
              <div className="space-y-8 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">עמלת Sharehood</span>
                  <span className="font-bold text-lg">₪{paymentModal.serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">טלפון</span>
                  <span className="font-bold font-mono text-lg">{SITE_OWNER_PHONE}</span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <ol className="text-right text-sm text-gray-600 space-y-6 mb-24 list-none">
              <li>1️⃣ פתח/י <strong>{paymentModal.method === 'bit' ? 'Bit' : 'PayBox'}</strong> ושלח/י <strong>₪{paymentModal.rentalAmount}</strong> ל-<strong>{paymentModal.lenderPhone}</strong></li>
              <li>2️⃣ שלח/י <strong>₪{paymentModal.serviceFee}</strong> ל-<strong>{SITE_OWNER_PHONE}</strong> (עמלת Sharehood)</li>
              <li>3️⃣ לאחר שני התשלומים – לחץ/י "סיימתי"</li>
            </ol>

            <button
              onClick={() => { setPaymentModal(null); navigate('/profile'); }}
              className="w-full py-14 rounded-12 font-bold text-white transition-all active:scale-95"
              style={{ background: paymentModal.method === 'bit' ? '#FF4D00' : '#1A237E' }}
            >
              ✅ סיימתי את שני התשלומים
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-32">סיכום הזמנה</h1>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-32">
        <div className="md:col-span-2 space-y-24">

          {/* Personal Details */}
          <section className="card">
            <h2 className="text-xl font-bold mb-16 flex items-center gap-8">
              <User size={20} className="text-secondary" />
              פרטים אישיים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">שם מלא</label>
                <input type="text" className="input-field w-full"
                  value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">מספר טלפון</label>
                <input type="tel" className="input-field w-full"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-sm font-medium text-gray-700">אימייל</label>
                <input type="email" className="input-field w-full"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
          </section>

          {/* Date Selection */}
          <section className="card">
            <h2 className="text-xl font-bold mb-16 flex items-center gap-8">
              <Calendar size={20} className="text-secondary" />
              תאריכי השאלה
            </h2>
            <div className="flex items-center gap-16">
              <div className="flex-1 space-y-4">
                <label className="text-sm font-medium text-gray-700">כמה ימים?</label>
                <select value={days} onChange={e => setDays(parseInt(e.target.value))} className="input-field w-full">
                  {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} ימים</option>)}
                </select>
              </div>
              <div className="flex-1 bg-blue-50 p-16 rounded-8 border border-blue-100">
                <div className="text-xs text-secondary font-bold uppercase mb-4">תאריך איסוף משוער</div>
                <div className="text-lg font-bold">היום, 16:00</div>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="card">
            <h2 className="text-xl font-bold mb-20 flex items-center gap-8">
              <Smartphone size={20} className="text-secondary" />
              אמצעי תשלום
            </h2>

            {/* Selector */}
            <div className="flex gap-12 mb-24">
              {PAYMENT_METHODS.map(({ id, label, Logo, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  className="flex-1 flex flex-col items-center gap-10 py-20 px-12 rounded-12 border-2 transition-all"
                  style={{
                    borderColor: paymentMethod === id ? color : '#e5e7eb',
                    background: paymentMethod === id ? `${color}10` : '#fff',
                  }}
                >
                  <Logo />
                  <span className="text-sm font-bold" style={{ color: paymentMethod === id ? color : '#6b7280' }}>
                    {label}
                  </span>
                  {paymentMethod === id && (
                    <span className="text-[10px] font-bold px-8 py-2 rounded-full text-white"
                      style={{ background: color }}>✓ נבחר</span>
                  )}
                </button>
              ))}
            </div>

            {/* Recipient phone */}
            <div className="space-y-6">
              <label className="text-sm font-medium text-gray-700">
                מספר {paymentMethod === 'bit' ? 'Bit' : 'PayBox'} של המשאיל/ה
              </label>
              <input
                type="tel"
                className="input-field w-full"
                placeholder="לדוגמה: 050-1234567"
                value={recipientPhone}
                onChange={e => setRecipientPhone(e.target.value)}
              />
              <p className="text-xs text-gray-400">
                {paymentMethod === 'bit'
                  ? '✓ לאחר האישור תועבר/י לאפליקציית Bit לביצוע התשלום'
                  : '✓ לאחר האישור תועבר/י לאפליקציית PayBox לביצוע התשלום'}
              </p>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-24">
          <section className="card sticky top-24">
            <h2 className="text-xl font-bold mb-24">סיכום תשלום</h2>

            {product && (
              <div className="flex items-center gap-12 mb-20 pb-20 border-b border-gray-100">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-8" />
                <div>
                  <h3 className="font-bold text-sm leading-snug">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-2">₪{product.price} / יום</p>
                </div>
              </div>
            )}

            <div className="space-y-16 mb-24 pb-24 border-b border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-600">₪{pricePerDay} x {days} ימים</span>
                <span className="font-medium">₪{pricePerDay * days}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">עמלת שירות</span>
                <span className="font-medium">₪{serviceFee}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-32">
              <span className="text-lg font-bold">סה"כ לתשלום</span>
              <span className="text-2xl font-bold text-primary">₪{total}</span>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={!product || authLoading}
              className="w-full py-16 text-lg font-bold rounded-12 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              style={{ background: activeMethod?.color, color: '#fff' }}
            >
              {paymentMethod === 'bit' ? '💸 שלם עם Bit' : '💳 שלם עם PayBox'}
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-16">
              בלחיצה תועבר/י לאפליקציית התשלום לאישור סופי
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
