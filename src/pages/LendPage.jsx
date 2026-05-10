import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/products';

const LendPage = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New product submitted:', form);
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
