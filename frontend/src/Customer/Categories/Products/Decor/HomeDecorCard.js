import React from 'react';

const HomeDecorCard = ({ product, onAddToCart, onToggleWishlist, onViewProduct, isWishlisted, cartItems, navigateTo }) => {
    const handleCardClick = (e) => {
        // Prevent navigation when clicking on buttons
        if (e.target.closest('button')) {
            return;
        }
        onViewProduct(product);
    };

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
            return `http://localhost:5000/uploads/${product.image}`;
        }
        // Otherwise, it's a static image in IMAGES folder
        return `/IMAGES/${product.image}`;
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <img src={getImageSrc()} alt={product.name} className="product-img" />
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-vendor">
                    <i className="fas fa-store"></i> {product.vendor}
                </p>
                <div className="product-price">
                    {product.originalPrice && <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>}
                    <span className="discounted-price">₹{product.price.toLocaleString()}</span>
                    {product.discount && <span className="discount-badge">{product.discount}% off</span>}
                </div>
                <div className="product-distance">
                    <i className="fas fa-map-marker-alt"></i> {product.distance || 'Calculating...'}
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

export default HomeDecorCard;
