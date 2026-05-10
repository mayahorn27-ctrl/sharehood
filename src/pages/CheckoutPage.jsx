import { useState } from 'react';
import { Calendar, CreditCard, User, Mail, Phone } from 'lucide-react';

const CheckoutPage = () => {
  const [days, setDays] = useState(1);
  const pricePerDay = 40;
  const serviceFee = 5;
  const total = (pricePerDay * days) + serviceFee;

  return (
    <div className="max-w-4xl mx-auto">
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
                <input type="text" className="input-field w-full" placeholder="ישראל ישראלי" />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">מספר טלפון</label>
                <input type="tel" className="input-field w-full" placeholder="050-0000000" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-sm font-medium text-gray-700">אימייל</label>
                <input type="email" className="input-field w-full" placeholder="israel@example.com" />
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
                <select 
                  value={days} 
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="input-field w-full"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(n => (
                    <option key={n} value={n}>{n} ימים</option>
                  ))}
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
            <h2 className="text-xl font-bold mb-16 flex items-center gap-8">
              <CreditCard size={20} className="text-secondary" />
              אמצעי תשלום
            </h2>
            <div className="border-2 border-primary bg-green-50 p-16 rounded-8 flex items-center justify-between">
              <div className="flex items-center gap-16">
                <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                <div>
                  <div className="font-bold">Visa מסתיים ב-4242</div>
                  <div className="text-xs text-gray-500">תוקף 12/26</div>
                </div>
              </div>
              <button className="text-secondary text-sm font-bold">שנה</button>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-24">
          <section className="card sticky top-24">
            <h2 className="text-xl font-bold mb-24">סיכום תשלום</h2>
            
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

            <button className="btn-primary w-full py-16 text-lg shadow-lg">
              בצע תשלום
            </button>
            
            <p className="text-[10px] text-gray-400 text-center mt-16">
              בלחיצה על "בצע תשלום" את/ה מאשר/ת את תנאי השימוש של Sharehood
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
