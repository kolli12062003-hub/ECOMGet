import React, { useState, useEffect, useMemo } from 'react';
import './BagProductDetail.css';

export const allBagProducts = [
     { id: 201, name: "Leather Handbag", price: 2999, vendor: "Style Trends", image: "Leather Handbag.jpg", material: "Genuine Leather", color: "Brown", capacity: "15L", features: "Multiple compartments, adjustable strap", otherImages: ["Leather Handbag1.jpg", "Leather Handbag2.jpg", "Leather Handbag3.jpg"], lat: 17.4486, lon: 78.3908, category: "Bags" },
            { id: 202, name: "Backpack", price: 1999, vendor: "Travel Gear", image: "Backpack.jpg", material: "Nylon", color: "Black", capacity: "30L", features: "Laptop sleeve, water-resistant", otherImages: ["Backpack1.jpg", "Backpack2.jpg", "Backpack3.jpg"], lat: 17.4512, lon: 78.3855, category: "Bags"},
             { id: 203, name: "Travel Duffel Bag", price: 3499, vendor: "Adventure Outfitters", image: "Travel Duffel Bag.jpg", material: "Canvas", color: "Olive Green", capacity: "50L", features: "Spacious main compartment, shoe pocket", otherImages: ["Travel Duffel Bag1.jpeg", "Travel Duffel Bag2.jpg", "Travel Duffel Bag3.jpg"], lat: 17.4421, lon: 78.3882,category: "Bags" },
             { id: 204, name: "Tote Bag", price: 1499, vendor: "Style Trends", image: "Tote Bag.jpg", material: "Canvas", color: "Beige", capacity: "20L", features: "Lightweight, foldable", otherImages: ["Tote Bag1.jpg", "Tote Bag2.jpeg", "Tote Bag3.jpg"], lat: 17.4550, lon: 78.3920,category: "Bags"},
               { id: 205, name: "Laptop Bag", price: 2499, vendor: "Tech Carry", image: "Laptop Bag.jpg", material: "Polyester", color: "Grey", capacity: "18L", features: "Padded laptop compartment, USB charging port", otherImages: ["Laptop Bag1.jpg", "Laptop Bag2.jpeg", "Laptop Bag3.jpeg"], lat: 17.4399, lon: 78.4421 ,category: "Bags"},
             { id: 206, name: "Clutch Purse", price: 999, vendor: "Fashion Hub", image: "Clutch Purse.jpg", material: "Faux Leather", color: "Red", capacity: "2L", features: "Detachable chain strap, elegant design", otherImages: ["Clutch Purse1.jpg", "Clutch Purse2.jpg", "Clutch Purse3.jpg"], lat: 17.4455, lon: 78.3800 ,category: "Bags"},
             { id: 207, name: "Gym Bag", price: 1799, vendor: "Adventure Outfitters", image: "Gym Bag.jpg", material: "Polyester", color: "Blue", capacity: "25L", features: "Separate wet/dry compartments", otherImages: ["Gym Bag1.jpg", "Gym Bag2.jpg", "Gym Bag3.jpg"], lat: 17.4480, lon: 78.3890 ,category: "Bags"},
             { id: 208, name: "Crossbody Bag", price: 1299, vendor: "Style Trends", image: "Crossbody Bag.jpg", material: "PU Leather", color: "Tan", capacity: "5L", features: "Compact, multiple pockets", otherImages: ["Crossbody Bag1.jpg", "Crossbody Bag2.jpg", "Crossbody Bag3.jpg"], lat: 17.4520, lon: 78.3870,category: "Bags" },
            { id: 209, name: "Travel Backpack", price: 3999, vendor: "Travel Gear", image: "Travel Backpack.jpg", material: "Durable Polyester", color: "Dark Blue", capacity: "45L", features: "Expandable, anti-theft design", otherImages: ["BackpackTravel1.jpg", "BackpackTravel2.jpg", "BackpackTravel3.jpg"], lat: 17.4400, lon: 78.3850,category: "Bags" },
             { id: 210, name: "Designer Handbag", price: 4999, vendor: "Fashion Hub", image: "Designer Handbag.jpg", material: "Premium Leather", color: "Black", capacity: "12L", features: "Luxury hardware, designer logo", otherImages: ["Designer Handbag1.jpg", "Designer Handbag2.jpeg", "Designer Handbag3.jpeg"], lat: 17.4490, lon: 78.3950,category: "Bags" },
             { id: 211, name: "Sling Bag", price: 1599, vendor: "Style Trends", image: "Sling Bag.jpg", material: "Canvas", color: "Grey", capacity: "8L", features: "Adjustable strap, front zip pocket", otherImages: ["Sling Bag1.jpg", "Sling Bag2.jpeg", "Sling Bag3.jpeg"], lat: 17.4550, lon: 78.3920,category: "Bags" },
             { id: 212, name: "Luggage Set", price: 7999, vendor: "Adventure Outfitters", image: "Luggage Set.jpg", material: "ABS Hard-shell", color: "Silver", capacity: "3-piece set", features: "Spinner wheels, TSA lock", otherImages: ["Luggage Set1.jpeg", "Luggage Set2.jpeg", "Luggage Set3.jpeg"], lat: 17.4430, lon: 78.3860,category: "Bags" },
             { id: 213, name: "Wallet", price: 799, vendor: "Fashion Hub", image: "Wallet.jpg", material: "Leather", color: "Black", capacity: "N/A", features: "RFID blocking, multiple card slots", otherImages: ["Wallet1.jpeg", "Wallet2.jpeg", "Wallet3.jpeg"], lat: 17.4500, lon: 78.3840,category: "Bags" },
             { id: 214, name: "Messenger Bag", price: 2199, vendor: "Tech Carry", image: "Messenger Bag.jpg", material: "Canvas", color: "Khaki", capacity: "15L", features: "Fits 15-inch laptop, vintage look", otherImages: ["Messenger Bag1.jpeg", "Messenger Bag2.jpeg", "Messenger Bag3.jpeg"], lat: 17.4470, lon: 78.3910,category: "Bags"},
            { id: 215, name: "Trolley Bag", price: 5999, vendor: "Travel Gear", image: "Trolley Bag.jpg", material: "Polycarbonate", color: "Blue", capacity: "60L", features: "Lightweight, 360-degree wheels", otherImages: ["Trolley Bag1.jpg", "Trolley Bag2.jpg", "Trolley Bag3.jpg"], lat: 17.4400, lon: 78.3850,category: "Bags" }
];

const BagProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
    const getImageSrc = (image) => {
        if (!image) return 'https://via.placeholder.com/200x150?text=No+Image';
        if (image.startsWith('http://') || image.startsWith('https://')) return image;
        if (image.includes('-') && /^\d+-\w+\./.test(image)) return `${process.env.REACT_APP_API_URL}/uploads/${image}`;
        return `/IMAGES/${image}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        if (product) {
            setMainImage(getImageSrc(product.image));
            console.log('🔍 BagProductDetail - Rendering product:', product.name);
            console.log('🛡️ Warranty:', product.warranty);
            console.log('📅 Expiry:', product.expiryDate);
        }
        window.scrollTo(0, 0);
    }, [product]);

    const isInCart = useMemo(() => cartItems && cartItems.some(item => (item._id || item.id) === (product._id || product.id)), [cartItems, product]);
    const isInWishlist = useMemo(() => wishlistItems.some(item => (item._id || item.id) === (product._id || product.id)), [wishlistItems, product]);

    const thumbnailImages = useMemo(() => {
        if (!product) return [];
        const images = [getImageSrc(product.image)];
        if (product.otherImages && product.otherImages.length > 0) {
            return images.concat(product.otherImages.map(img => getImageSrc(img)));
        }
        return images;
    }, [product]);

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return allBagProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#bag-products" onClick={(e) => { e.preventDefault(); navigateTo('bag-products'); }} className="back-link">&larr; Back to Bags Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#bag-products" onClick={(e) => { e.preventDefault(); navigateTo('bag-products'); }} className="back-link">&larr; Back to Bags Products</a>
            
            <div className="product-detail-container">
                <div className="product-images">
                    <div className="main-image">
                        <img src={mainImage} alt={product.name} />
                    </div>
                    <div className="thumbnail-track">
                        {thumbnailImages.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className={`thumbnail ${mainImage === imgSrc ? 'active' : ''}`}
                                onClick={() => setMainImage(imgSrc)}
                                onError={(e) => e.target.src = 'https://via.placeholder.com/80x80?text=No+Img'}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-details">
                    <h1>{product.name}</h1>
                    <p className="product-vendor">by {product.vendor}</p>
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
                    
                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description || `A stylish and durable bag, perfect for your everyday needs. Made with high-quality ${product.material}.`}</p>
                    </div>

                    {product.warranty && (
                        <div className="product-warranty" style={{
                            marginTop: '15px',
                            padding: '12px',
                            backgroundColor: '#e8f5e9',
                            borderLeft: '4px solid #4CAF50',
                            borderRadius: '4px'
                        }}>
                            <strong style={{ color: '#2e7d32' }}>
                                <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
                                Warranty:
                            </strong>
                            <span style={{ marginLeft: '8px', color: '#555' }}>{product.warranty}</span>
                        </div>
                    )}

                    {product.expiryDate && (
                        <div className="product-expiry" style={{
                            marginTop: '15px',
                            padding: '12px',
                            backgroundColor: '#fff3e0',
                            borderLeft: '4px solid #ff9800',
                            borderRadius: '4px'
                        }}>
                            <strong style={{ color: '#e65100' }}>
                                <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                                Expiry Date:
                            </strong>
                            <span style={{ marginLeft: '8px', color: '#555' }}>{formatDate(product.expiryDate)}</span>
                        </div>
                    )}

                    <div className="product-distance">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{product.distance || 'Distance N/A'}</span>
                    </div>
                    
                    <div className="product-specs">
                        <h3>Specifications</h3>
                        <div className="spec-grid">
                            <div className="spec-item"><strong>Material</strong><span>{product.material || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Color</strong><span>{product.color || 'N/A'}</span></div>
                        </div>
                    </div>
                    
                    <div className="product-actions">
                        {isInCart ? (
                             <button onClick={() => navigateTo('cart')} className="btn go-to-cart">Go to Cart</button>
                        ) : (
                            <button className="btn" onClick={() => onAddToCart(product)}>Add to Cart</button>
                        )}
                        <button 
                            className={`wishlist-heart-btn ${isInWishlist ? 'active' : ''}`} 
                            title="Add to Wishlist"
                            onClick={() => onToggleWishlist(product)}
                        >
                            <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"}></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="related-products-section">
                <h2>Related Products</h2>
                <div className="related-product-grid">
                    {relatedProducts.map(related => (
                        <div key={related.id} className="related-product-card" onClick={() => onViewProduct(related)} style={{cursor: 'pointer'}}>
                            <img
                                src={getImageSrc(related.image)}
                                alt={related.name}
                                onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=No+Img'}
                            />
                            <div className="related-product-info">
                                <h4>{related.name}</h4>
                                <p style={{fontSize: '14px', color: 'var(--gray)'}}>{related.vendor}</p>
                                <div className="product-price" style={{fontSize: '18px', marginTop: '10px'}}>
                                    ₹{related.price.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BagProductDetail;