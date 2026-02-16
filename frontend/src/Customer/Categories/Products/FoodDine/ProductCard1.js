import React from 'react';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onViewProduct, cartItems, navigateTo }) => {
    // In a real app, you might handle image errors differently
    const handleImageError = (e) => {
        e.target.src = `https://via.placeholder.com/200x200?text=${product.name.replace(/\s/g, '+')}`;
    };

    const handleCardClick = (e) => {
        // Prevent navigation if a button inside the card was clicked
        if (e.target.closest('button')) return;
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

    // ✅ Format date helper
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
        <div className="product-card" draggable="true" onClick={handleCardClick} style={{cursor: 'pointer'}}>
            <div style={{ position: 'relative' }}>
                <img
                    src={getImageSrc()}
                    alt={product.name}
                    className="product-img"
                    onError={handleImageError}
                />
                
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
                        gap: '4px',
                        zIndex: 10
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
                        gap: '4px',
                        zIndex: 10
                    }}>
                        <i className="fas fa-calendar-alt" style={{ fontSize: '10px' }}></i>
                        Exp: {formatDate(product.expiryDate)}
                    </div>
                )}
            </div>
            
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-vendor"><i className="fas fa-store"></i> <span>{product.vendor}</span></div>
                <div className="product-distance"><i className="fas fa-map-marker-alt"></i> <span>{product.distance || 'Calculating...'}</span></div>
                <div className="product-price">₹{product.price}</div>
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

export default ProductCard;