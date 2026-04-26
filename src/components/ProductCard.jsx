import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if link is wrapped
    addToCart(product);
  };

  return (
    <div className="product-card glass-card">
      <div className="product-image-container">
        <div className="product-category-badge">{product.category}</div>
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description.substring(0, 60)}...</p>
        <div className="product-footer">
          <span className="product-price text-gradient">RM {product.price.toLocaleString('ms-MY')}</span>
          <button className="btn btn-primary btn-sm add-to-cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
