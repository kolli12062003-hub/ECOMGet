import React from 'react';
import ProductCard from '../Popularproducts/ProductCard'; // Import ProductCard from the Popularproducts folder
import '../../ProductList.css'; // Corrected path to the CSS file in the src directory

const AllProductsList = React.forwardRef(({ allProducts, onAddToCart, wishlistItems, onViewProduct, onAddToWishlist, cartItems, navigateTo }, ref) => {
  const isProductInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId);
  };

  return (
    <section className="all-products-section" ref={ref}> {/* Attach the ref here */}
      <div className="container">
        <div className="section-title">
          <h2>All Products</h2>
        </div>
        {allProducts.length > 0 ? (
          <div className="all-products-grid">
            {allProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onAddToWishlist} // App.js passes onAddToWishlist, ProductCard expects onToggleWishlist
                onViewProduct={onViewProduct}
                isWishlisted={isProductInWishlist(product.id)}
                // cartItems and navigateTo are not directly used by ProductCard for rendering,
                // but onAddToCart might use them indirectly.
              />
            ))}
          </div>
        ) : (
          <p>No products to display right now.</p>
        )}
      </div>
    </section>
  );
});

export default AllProductsList;