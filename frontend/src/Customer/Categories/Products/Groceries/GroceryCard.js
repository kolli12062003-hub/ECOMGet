import React from 'react';

const GroceryCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onViewProduct, cartItems, navigateTo }) => {
    const handleImageError = (e) => {
        e.target.src = `https://via.placeholder.com/200x200?text=${product.name.replace(/\s/g, '+')}`;
    };

    const handleCardClick = (e) => {
        // Prevent navigation if a button inside the card was clicked
        if (e.target.closest('button')) return;
        onViewProduct(product);
    };

    return (
        <div className="product-card" draggable="true" onClick={handleCardClick} style={{cursor: 'pointer'}}>
            <img 
                src={`/IMAGES/${product.image}`} 
                alt={product.name} 
                className="product-img" 
                onError={handleImageError} 
            />
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-vendor"><i className="fas fa-store"></i> <span>{product.vendor}</span></div>
                <div className="product-distance"><i className="fas fa-map-marker-alt"></i> <span>{product.distance || 'Calculating...'}</span></div>
                <div className="product-price-section">
                    {product.discountedPrice ? (
                        <>
                            {/* Original Price - Struck Through */}
                            <div className="product-original-price">₹{product.originalPrice.toLocaleString()}</div>

                            {/* Discounted Price - Prominent */}
                            <div className="product-price discounted">₹{product.discountedPrice.toLocaleString()}</div>

                            {/* Offer Badge */}
                            <div className="product-offer-badge">
                                {product.discountPercentage ? `${product.discountPercentage}% OFF` : `₹${product.discountAmount} OFF`}
                            </div>

                            {/* You Save Text */}
                            <div className="product-save-text">
                                You save ₹{product.discountAmount}
                            </div>
                        </>
                    ) : (
                        <div className="product-price">₹{product.price.toLocaleString()}</div>
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
};

export default GroceryCard;
