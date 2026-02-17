import React from 'react';

const MedicineCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onViewProduct, cartItems, navigateTo }) => {
    const handleImageError = (e) => {
        e.target.src = `https://via.placeholder.com/200x200?text=${product.name ? product.name.replace(/\s/g, '+') : 'No+Image'}`;
    };

    const handleCardClick = (e) => {
        // Prevent navigation if a button inside the card was clicked
        if (e.target.closest('button') || e.target.closest('a')) return;
        onViewProduct(product);
    };

    return (
        <div className="product-card" draggable="true" onClick={handleCardClick} style={{cursor: 'pointer'}}>
            <img
                src={product.image ? (product.image.startsWith('http') ? product.image : (product.image.includes('-') ? `${process.env.REACT_APP_API_URL}/uploads/${product.image}` : `/IMAGES/${product.image}`)) : `https://via.placeholder.com/200x200?text=${product.name ? product.name.replace(/\s/g, '+') : 'No+Image'}`}
                alt={product.name}
                className="product-img"
                onError={handleImageError}
            />
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                {product.type && <div className="medicine-type">{product.type}</div>}
                <div className="product-vendor"><i className="fas fa-clinic-medical"></i> <span>{product.vendor}</span></div>
                <div className="product-distance"><i className="fas fa-map-marker-alt"></i> <span>{product.distance || 'N/A'}</span></div>
                <div className="product-price-section">
                    {product.discountedPrice ? (
                        <>
                            {/* Original Price - Struck Through */}
                            <div className="product-original-price">₹{product.originalPrice}</div>

                            {/* Discounted Price - Prominent */}
                            <div className="product-price discounted">₹{product.discountedPrice}</div>

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
                        <div className="product-price">₹{product.price}</div>
                    )}
                </div>
                <div className="product-actions">
                    <button className="like-btn" onClick={() => onToggleWishlist(product)} style={{ color: isWishlisted ? 'var(--secondary)' : 'var(--gray)' }}>
                        <i className={isWishlisted ? "fas fa-heart" : "far fa-heart"}></i>
                    </button>
                    {cartItems && cartItems.some(item => (item._id || item.id) === (product._id || product.id)) ? (
                        <button className="btn go-to-cart" onClick={() => navigateTo('cart')}>Go to Cart</button>
                    ) : (
                        <button className="btn add-to-cart" onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}>Add to Cart</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicineCard;