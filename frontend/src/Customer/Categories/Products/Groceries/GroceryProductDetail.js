import React, { useState, useEffect, useMemo } from 'react';
import './GroceryProductDetail.css';

export const allGroceryProducts = [
    { id: 901, name: "Organic Rice", price: 199, vendor: "Fresh Farms", image: "Organic Rice.jpg", otherImages: ["Organic Rice1.jpg", "Organic Rice2.jpg", "Organic Rice3.jpg"], lat: 17.4486, lon: 78.3908, category: "Grocery" },
    { id: 902, name: "Whole Wheat Flour", price: 149, vendor: "Pure Grains", image: "Whole Wheat Flour.jpg", otherImages: ["Whole Wheat Flour1.jpg", "Whole Wheat Flour2.jpg", "Whole Wheat Flour3.jpg"], lat: 17.4512, lon: 78.3855, category: "Grocery" },
    { id: 903, name: "Olive Oil", price: 499, vendor: "Healthy Oils", image: "Olive Oil.jpg", otherImages: ["Olive Oil1.jpg", "Olive Oil2.jpg", "Olive Oil3.jpg"], lat: 17.4421, lon: 78.3882, category: "Grocery" },
    { id: 904, name: "Fresh Apples", price: 299, vendor: "Orchard Fresh", image: "Fresh Apples.jpg", otherImages: ["Fresh Apples1.jpg", "Fresh Apples2.jpg", "Fresh Apples3.jpg"], lat: 17.4550, lon: 78.3920, category: "Grocery" },
    { id: 905, name: "Milk", price: 59, vendor: "Dairy Delight", image: "Milk.jpg", otherImages: ["Milk1.jpg", "Milk2.jpg", "Milk3.jpg"], lat: 17.4399, lon: 78.4421, category: "Grocery" },
    { id: 906, name: "Organic Honey", price: 399, vendor: "Sweet Harvest", image: "Organic Honey.jpg", otherImages: ["Organic Honey1.jpg", "Organic Honey2.jpg", "Organic Honey3.jpg"], lat: 17.4455, lon: 78.3800, category: "Grocery" },
    { id: 907, name: "Fresh Tomatoes", price: 99, vendor: "Green Veggie", image: "Fresh Tomatoes.jpg", otherImages: ["Fresh Tomatoes1.jpg", "Fresh Tomatoes2.jpg", "Fresh Tomatoes3.jpg"], lat: 17.4480, lon: 78.3890, category: "Grocery" },
    { id: 908, name: "Pasta", price: 149, vendor: "Italiano Foods", image: "Pasta.jpg", otherImages: ["Pasta1.jpg", "Pasta2.jpg", "Pasta3.jpg"], lat: 17.4520, lon: 78.3870, category: "Grocery" },
    { id: 909, name: "Almonds", price: 599, vendor: "Nutty Delights", image: "Almonds.jpg", otherImages: ["Almonds1.jpg", "Almonds2.jpg", "Almonds3.jpg"], lat: 17.4400, lon: 78.3850, category: "Grocery" },
    { id: 910, name: "Green Tea", price: 249, vendor: "Pure Leaf", image: "Green Tea (100g).jpg", otherImages: ["Green Tea (100g)1.jpg", "Green Tea (100g)2.jpg", "Green Tea (100g)3.jpg"], lat: 17.4490, lon: 78.3950, category: "Grocery" },
    { id: 911, name: "Fresh Spinach", price: 79, vendor: "Green Grocer", image: "Fresh Spinach.jpg", otherImages: ["Fresh Spinach1.jpg", "Fresh Spinach2.jpg", "Fresh Spinach3.jpg"], lat: 17.4550, lon: 78.3920, category: "Grocery" },
    { id: 912, name: "Butter", price: 199, vendor: "Creamy Dairy", image: "Butter.jpg", otherImages: ["Butter1.jpg", "Butter2.jpg", "Butter3.jpg"], lat: 17.4430, lon: 78.3860, category: "Grocery" },
    { id: 913, name: "Oats", price: 299, vendor: "Healthy Grains", image: "Oats.jpg", otherImages: ["Oats1.jpg", "Oats2.jpg", "Oats3.jpg"], lat: 17.4500, lon: 78.3840, category: "Grocery" },
    { id: 914, name: "Fresh Bananas", price: 99, vendor: "Fruit Basket", image: "Fresh Bananas.jpg", otherImages: ["Fresh Bananas1.jpg", "Fresh Bananas2.jpg", "Fresh Bananas3.jpg"], lat: 17.4470, lon: 78.3910, category: "Grocery" },
    { id: 915, name: "Canned Beans", price: 149, vendor: "Pantry Staples", image: "Canned Beans.jpg", otherImages: ["Canned Beans1.jpg", "Canned Beans2.jpg", "Canned Beans3.jpg"], lat: 17.4400, lon: 78.3850, category: "Grocery" }
];

const GroceryProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
    const getImageSrc = (image) => {
        if (!image) return 'https://via.placeholder.com/200x150?text=No+Image';
        if (image.startsWith('http://') || image.startsWith('https://')) return image;
        if (image.includes('-') && /^\d+-\w+\./.test(image)) return `http://localhost:5000/uploads/${image}`;
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
            console.log('🔍 GroceryProductDetail - Rendering product:', product.name);
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
        return allGroceryProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#groceries-products" onClick={(e) => { e.preventDefault(); navigateTo('groceries-products'); }} className="back-link">&larr; Back to Groceries Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#groceries-products" onClick={(e) => { e.preventDefault(); navigateTo('groceries-products'); }} className="back-link">&larr; Back to Groceries Products</a>
            
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
                    <div className="product-price">₹{product.price.toLocaleString()}</div>
                    
                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description || 'High-quality grocery item, perfect for your daily needs. Fresh and sourced from the best suppliers.'}</p>
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

export default GroceryProductDetail;