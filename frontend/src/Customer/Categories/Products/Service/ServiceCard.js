import React from 'react';
import './Services1.css'; // Assuming ServiceCard uses styles from Services1.css
const ServiceCard = ({ service, onAddToCart, onToggleWishlist, isWishlisted, onViewProduct, cartItems, navigateTo }) => {
    if (!service) {
        return null; // or return a loading placeholder
    }

    const handleImageError = (e) => {
        e.target.src = `https://via.placeholder.com/200x200?text=${service.name.replace(/\s/g, '+')}`;
    };

    // Handle image source - check for uploaded files (with timestamps) vs static images
    const getImageSrc = () => {
        if (!service.image) {
            return `https://via.placeholder.com/200x200?text=${service.name.replace(/\s/g, '+')}`;
        }
        if (service.image.startsWith('http')) {
            return service.image;
        }
        // Check if it's an uploaded file (contains timestamp like "1234567890-filename.jpg")
        if (service.image.includes('-') && /^\d+-\w+\./.test(service.image)) {
            return `${process.env.REACT_APP_API_URL}/uploads/${service.image}`;
        }
        // Otherwise, it's a static image in IMAGES folder
        return `/IMAGES/${service.image}`;
    };

    const handleCardClick = (e) => {
        // Prevent navigation if a button inside the card was clicked
        if (e.target.closest('button')) return;
        onViewProduct(service);
    };

    return (
        <div className="product-card" draggable="true" onClick={handleCardClick} style={{cursor: 'pointer'}}>
            <img
                src={getImageSrc()}
                alt={service.name}
                className="product-img"
                onError={handleImageError}
            />
            <div className="product-info">
                <h3 className="product-title">{service.name}</h3>
                <div className="product-vendor"><i className="fas fa-store"></i> <span>{service.vendor}</span></div>
                <div className="product-distance"><i className="fas fa-map-marker-alt"></i> <span>{service.distance || 'Calculating...'}</span></div>
                <div className="product-price-section">
                    {service.discountedPrice ? (
                        <>
                            {/* Original Price - Struck Through */}
                            <div className="product-original-price">₹{service.originalPrice}</div>

                            {/* Discounted Price - Prominent */}
                            <div className="product-price discounted">₹{service.discountedPrice}</div>

                            {/* Offer Badge */}
                            <div className="product-offer-badge">
                                {service.discountPercentage ? `${service.discountPercentage}% OFF` : `₹${service.discountAmount} OFF`}
                            </div>

                            {/* You Save Text */}
                            <div className="product-save-text">
                                You save ₹{service.discountAmount}
                            </div>
                        </>
                    ) : (
                        <div className="product-price">₹{service.price}</div>
                    )}
                </div>
                <div className="product-actions">
                    <button className="like-btn" onClick={() => onToggleWishlist(service)} style={{ color: isWishlisted ? 'var(--secondary)' : 'var(--gray)' }}>
                        <i className={isWishlisted ? "fas fa-heart" : "far fa-heart"}></i>
                    </button>
                    {cartItems && cartItems.some(item => (item._id || item.id) === (service._id || service.id)) ? (
                        <button className="btn go-to-cart" onClick={() => navigateTo('cart')}>Go to Cart</button>
                    ) : (
                        <button className="btn add-to-cart" onClick={() => onAddToCart(service)}>Add to Cart</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;