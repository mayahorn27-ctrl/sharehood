import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/products';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const LendPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    location: '',
    images: [], // array of image URLs
    category: CATEGORIES[0] ?? 'הכל',
  });

  // Generic handler for simple text/number fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for changing a specific image URL
  const handleImageChange = (index, value) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  // Add a new empty image field
  const handleAddImage = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('New product submitted:', form);

    const lenderId = user?.id;
    const lenderName = user?.user_metadata?.full_name || user?.email || 'משתמש';
    const lenderImage = user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?u=default';

    const productData = {
      name: form.name,
      price: parseFloat(form.price),
      rating: 5.0,
      reviews: 0,
      category: form.category,
      location: form.location,
      description: form.description,
      image: form.images[0] || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800',
      lender_id: lenderId,
      lender_name: lenderName,
      lender_response_time: 'פחות משעה',
      lender_joined: 'מאי 2026',
      lender_image: lenderImage,
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        alert('המוצר הועלה בהצלחה ל-Supabase!');
      } catch (err) {
        console.error("Error inserting product into Supabase:", err);
        alert('התרחשה שגיאה בעת שמירת המוצר ב-Supabase. הנתונים הודפסו בקונסול.');
      }
    } else {
      alert('המוצר נשמר בהצלחה (סימולציה מקומית - הגדר/י קובץ .env לחיבור Supabase).');
    }

    // Reset form
    setForm({
      name: '',
      price: '',
      description: '',
      location: '',
      images: [],
      category: CATEGORIES[0] ?? 'הכל',
    });
    navigate('/board');
  };

  return (
    <div className="max-w-2xl mx-auto py-24 px-8">
      <h1 className="text-3xl font-bold text-center mb-12">העלאת פריט חדש</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-12 bg-white/80 backdrop-blur-md p-16 rounded-12 shadow-lg border border-gray-100"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            שם הפריט
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full input-field"
            placeholder="לדוגמה: מקדחה מקצועית"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            קטגוריה
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full input-field"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            מחיר ליום (₪)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full input-field"
            placeholder="לדוגמה: 40"
            min="0"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            מרחק ממך
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full input-field"
            placeholder="לדוגמה: 200 מ' ממך"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">תמונות (URL)</label>
          {form.images.map((img, idx) => (
            <input
              key={idx}
              type="url"
              value={img}
              onChange={(e) => handleImageChange(idx, e.target.value)}
              className="w-full input-field mb-2"
              placeholder="https://example.com/image.jpg"
            />
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="btn-primary mt-4"
          >
            הוסף תמונה
          </button>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            תיאור קצר
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full input-field"
            placeholder="ספרו על הפריט שלכם בקצרה..."
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="btn-primary px-24 py-12 text-lg">
            העלה פריט
          </button>
        </div>
      </form>
    </div>
  );
};

export default LendPage;
