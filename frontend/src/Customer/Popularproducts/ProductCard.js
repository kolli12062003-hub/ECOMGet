import React, { forwardRef, useState, useEffect } from 'react';

const ProductCard = forwardRef(({ product, onAddToCart, onToggleWishlist, isWishlisted, cartItems, navigateTo }, ref) => {
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  // Handle image source - check for uploaded files (with timestamps) vs static images
  const getImageSrc = () => {
    if (!product.image) {
      return `https://via.placeholder.com/200x200?text=${product.name.replace(/\s/g, '+')}`;
    }
    if (product.image.startsWith('http')) {
      return product.image;
    }
    // Check if it's an uploaded file (contains timestamp like "1234567890-filename.jpg")
    if (product.image.includes('-') && /^\d+-\w+\./.test(product.image)) {
      return `${process.env.REACT_APP_API_URL}/uploads/${product.image}`;
    }
    // Otherwise, it's a static image in IMAGES folder
    return `/IMAGES/${product.image}`;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric' 
    });
  };

  return (
    <div className="product-card" ref={ref}>
      <div style={{ position: 'relative' }}>
        <img src={getImageSrc()} alt={product.name} className="product-img" />
        
        {/* ✅ WARRANTY BADGE - Top Left */}
        {product.warranty && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <i className="fas fa-shield-alt" style={{ fontSize: '10px' }}></i>
            {product.warranty}
          </div>
        )}

        {/* ✅ EXPIRY DATE BADGE - Top Right */}
        {product.expiryDate && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#ff9800',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <i className="fas fa-calendar-alt" style={{ fontSize: '10px' }}></i>
            Exp: {formatDate(product.expiryDate)}
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-vendor">
          <i className="fas fa-store"></i> {product.vendor}
        </div>
        <div className="popular-product-price-section">
          {product.discountedPrice ? (
            <>
              {/* Original Price - Struck Through */}
              <div className="popular-product-original-price">₹{product.originalPrice}</div>

              {/* Discounted Price - Prominent */}
              <div className="popular-product-price discounted">₹{product.discountedPrice}</div>

              {/* Offer Badge */}
              <div className="popular-product-offer-badge">
                {product.discountPercentage ? `${product.discountPercentage}% OFF` : `₹${product.discountAmount} OFF`}
              </div>

              {/* You Save Text */}
              <div className="popular-product-save-text">
                You save ₹{product.discountAmount}
              </div>
            </>
          ) : (
            <div className="popular-product-price">₹{product.price}</div>
          )}
        </div>
        <div className="product-actions">
          <button className="like-btn" onClick={() => onToggleWishlist(product)} style={{ color: isWishlisted ? 'var(--secondary)' : 'var(--gray)' }}>
            <i className={isWishlisted ? "fas fa-heart" : "far fa-heart"}></i>
          </button>
          {cartItems && cartItems.some(item => (item._id || item.id) === (product._id || product.id)) ? (
            <button className="btn go-to-cart" onClick={() => navigateTo('cart')}>Go to Cart</button>
          ) : (
            <button className="btn add-to-cart" onClick={() => onAddToCart(product)}>Add to Cart</button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;