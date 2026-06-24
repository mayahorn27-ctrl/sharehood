import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link 
      to={`/product/${product.id}`}
      className="card group flex flex-col h-full hover:border-secondary transition-all"
    >
      <div className="relative h-48 -m-16 mb-16 overflow-hidden rounded-t-8 bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-[12px] left-[12px] bg-white/90 backdrop-blur-md px-[8px] py-[4px] rounded-full text-xs font-bold flex items-center gap-1 shadow-sm border border-white/20 z-10">
          <Star size={12} className="text-accent fill-accent" />
          <span>{product.rating}</span>
        </div>
        <div className="absolute top-[12px] right-[12px] bg-primary/90 backdrop-blur-md px-[8px] py-[4px] rounded-full text-[10px] text-white font-bold uppercase tracking-wider z-10">
          {product.category}
        </div>
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-8">
          <h3 className="text-base font-bold text-text group-hover:text-secondary transition-colors line-clamp-1">{product.name}</h3>
        </div>
        
        <div className="flex items-center gap-4 text-gray-500 mb-16 mt-auto">
          <MapPin size={14} className="text-secondary" />
          <span className="text-xs">{product.location}</span>
        </div>
        
        <div className="flex items-center justify-between pt-12 border-t border-gray-100 mt-auto">
          <div className="text-lg font-bold text-secondary">₪{product.price} <span className="text-[10px] font-normal text-gray-400">/ יום</span></div>
          <div className="text-xs font-bold text-primary px-12 py-4 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-white transition-all">השאלה</div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
