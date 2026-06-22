import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState({
    full_name: authUser?.user_metadata?.full_name || authUser?.email || '',
    joined_at: authUser?.user_metadata?.joined_at || '',
    avatar_url: authUser?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?u=currentUser',
    email: authUser?.email || ''
  });
  const [myListings, setMyListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'bookings'

  // Fetch profile data when auth user becomes available
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      if (!isSupabaseConfigured) {
        // Fallback mock values
        setMyListings([
          { id: 101, name: "מברגה נטענת 18V", price: 35, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800" },
          { id: 102, name: "צידנית משפחתית 40L", price: 20, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800" }
        ]);
        setMyBookings([]);
        setLoading(false);
        return;
      }

      // If auth user not loaded yet, wait
      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch user profile from `users` table using Supabase Auth ID
        const userId = authUser?.id;
        const { data: userData, error: userErr } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        if (userErr) console.error('Error fetching user profile:', userErr);
        if (userData) {
          setUser({
            ...userData,
            email: authUser.email // Ensure email from auth session is shown
          });
        } else {
          // Fallback to auth session data if profile row missing
          setUser(prev => ({ ...prev, email: authUser.email }));
        }

        // 2. Fetch listings created by this user
        const { data: listingsData, error: listingsErr } = await supabase
          .from('products')
          .select('*')
          .eq('lender_id', authUser.id);
        if (listingsErr) console.error('Error fetching listings:', listingsErr);
        if (listingsData) setMyListings(listingsData);

        // 3. Fetch bookings made by this user (join product details)
        const { data: bookingsData, error: bookingsErr } = await supabase
          .from('bookings')
          .select('*, products(*)')
          .eq('user_id', authUser.id);
        if (bookingsErr) console.error('Error fetching bookings:', bookingsErr);
        if (bookingsData) {
          const mappedBookings = bookingsData.map(b => ({
            id: b.id,
            days: b.days,
            totalPrice: b.total_price,
            status: b.status,
            createdAt: new Date(b.created_at).toLocaleDateString('he-IL'),
            product: b.products ? {
              id: b.products.id,
              name: b.products.name,
              image: b.products.image,
              price: b.products.price
            } : null
          }));
          setMyBookings(mappedBookings);
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Run once auth status resolved
    if (!authLoading) fetchProfileData();
  }, [authUser, authLoading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-gray-500 mt-16 font-medium">טוען פרופיל...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-32 px-16">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-32 text-center bg-white p-24 rounded-16 border border-gray-100 shadow-sm">
        <img
          src={user.avatar_url}
          alt={user.full_name}
          className="w-24 h-24 rounded-full border-4 border-primary/10 mb-16 object-cover"
        />
        <h1 className="text-2xl font-bold">{user.full_name}</h1>
        <p className="text-gray-500 text-sm mt-4">חבר/ה מאז: {user.joined_at}</p>
        {user.email && (
          <p className="text-gray-400 text-xs mt-2">{user.email}</p>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 mb-24">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-1 pb-12 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'listings'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          המוצרים שלי ({myListings.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 pb-12 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'bookings'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          הזמנות שלי ({myBookings.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-16">
        {activeTab === 'listings' ? (
          myListings.length > 0 ? (
            myListings.map(listing => (
              <div key={listing.id} className="card flex items-center justify-between p-16 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-16">
                  <img src={listing.image} alt={listing.name} className="w-16 h-16 object-cover rounded-8" />
                  <div>
                    <h3 className="font-bold text-base">{listing.name}</h3>
                    <p className="text-sm text-gray-500">₪{listing.price} / יום</p>
                  </div>
                </div>
                <div className="bg-primary/10 text-primary text-xs font-bold px-12 py-6 rounded-full">
                  פעיל
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-48 text-gray-400 bg-gray-50 rounded-16 border-2 border-dashed border-gray-200">
              לא העלית מוצרים להשאלה עדיין.
            </div>
          )
        ) : (
          myBookings.length > 0 ? (
            myBookings.map(booking => (
              booking.product && (
                <div key={booking.id} className="card flex items-center justify-between p-16 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-16">
                    <img src={booking.product.image} alt={booking.product.name} className="w-16 h-16 object-cover rounded-8" />
                    <div>
                      <h3 className="font-bold text-base">{booking.product.name}</h3>
                      <p className="text-xs text-gray-400 mt-2">הוזמן ב-{booking.createdAt} ל-{booking.days} ימים</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-secondary text-lg">₪{booking.totalPrice}</div>
                    <div className="text-[10px] bg-green-100 text-green-700 px-8 py-2 rounded-full font-bold inline-block mt-4">
                      {booking.status}
                    </div>
                  </div>
                </div>
              )
            ))
          ) : (
            <div className="text-center py-48 text-gray-400 bg-gray-50 rounded-16 border-2 border-dashed border-gray-200">
              לא שכרת פריטים עדיין.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
