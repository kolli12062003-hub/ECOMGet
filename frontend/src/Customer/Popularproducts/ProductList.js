import React from 'react';
import ProductCard from './ProductCard';

// Mock data based on your add1.html
const products = [
    { "id": 1, "name": "Fresh Garden Salad", "price": 1099, "vendor": "Green Cafe", "category": "Food", "image": "Fresh Garden Salad.jpg" },
    { "id": 2, "name": "Classic Beef Burger", "price": 849, "vendor": "Burger Heaven", "category": "Food", "image": "Classic Beef Burger.jpg" },
    { "id": 3, "name": "Synthetic Engine Oil", "price": 2499, "vendor": "AutoCare", "category": "Automotive", "image": "Synthetic Engine Oil.jpg" },
    { "id": 4, "name": "Vitamin Supplements", "price": 1299, "vendor": "HealthPlus", "category": "Medicines", "image": "Vitamin Supplements.jpg" },
    { "id": 5, "name": "Gold Diamond Ring", "price": 24999, "vendor": "Sparkle Jewellers", "category": "Jewellery", "image": "Gold Diamond Ring.jpg" },
    { "id": 6, "name": "Designer Summer Dress", "price": 4199, "vendor": "Fashion Hub", "category": "Clothing", "image": "Designer Summer Dress.jpg" },
    { "id": 7, "name": "Luxury Skincare Set", "price": 7499, "vendor": "Beauty Palace", "category": "Beauty Products", "image": "Luxury Skincare Set.jpg" },
    { "id": 8, "name": "Silver Pearl Necklace", "price": 10899, "vendor": "Elegance Jewels", "category": "Jewellery", "image": "Silver Pearl Necklace.jpg" }
];

const ProductList = ({ onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo }) => {
  return (
    <section className="section products" id="products">
      <div className="container">
        <div className="section-title">
          <h2>Popular Products</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => {
            const isWishlisted = wishlistItems.some(item => item.id === product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                cartItems={cartItems}
                isWishlisted={isWishlisted}
                navigateTo={navigateTo}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductList;