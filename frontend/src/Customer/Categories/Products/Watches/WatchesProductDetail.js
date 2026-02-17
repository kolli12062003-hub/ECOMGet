import React, { useState, useEffect, useMemo } from 'react';
import './WatchesProductDetail.css';

export const allWatchesProducts = [
    { id: 2001, name: "Mens Minimalist Watch", price: 4999, vendor: "TimeTrend", image: "Mens Minimalist Watch.jpg", type: "Analog", strapMaterial: "Leather", caseMaterial: "Stainless Steel", waterResistance: "3 ATM", otherImages: ["Mens Minimalist Watch1.jpg", "Mens Minimalist Watch2.jpg", "Mens Minimalist Watch3.jpg"], lat: 17.4486, lon: 78.3908, category: "Watches", subcategory: "Men's Watches" },
    { id: 2002, name: "Hybrid Smartwatch", price: 7999, vendor: "TechTime", image: "Hybrid Smartwatch.jpg", type: "Hybrid", strapMaterial: "Silicone", caseMaterial: "Aluminum", waterResistance: "5 ATM", otherImages: ["Hybrid Smartwatch1.jpg", "Hybrid Smartwatch2.jpg", "Hybrid Smartwatch3.jpg"], lat: 17.4512, lon: 78.3855, category: "Watches", subcategory: "Men's Watches" },
    { id: 2003, name: "Sports Watch", price: 3499, vendor: "ActiveWear", image: "Sports Watch.jpg", type: "Digital", strapMaterial: "Rubber", caseMaterial: "Resin", waterResistance: "10 ATM", otherImages: ["Sports Watch1.jpg", "Sports Watch2.jpg", "Sports Watch3.jpg"], lat: 17.4421, lon: 78.3882, category: "Watches", subcategory: "Men's Watches" },
    { id: 2004, name: "Gold Watch", price: 12999, vendor: "EliteTime", image: "Gold Watch.jpg", type: "Analog", strapMaterial: "Stainless Steel", caseMaterial: "Gold Plated", waterResistance: "5 ATM", otherImages: ["Gold Watch1.jpg", "Gold Watch2.jpg", "Gold Watch3.jpg"], lat: 17.4550, lon: 78.3920, category: "Watches", subcategory: "Men's Watches" },
    { id: 2005, name: "Fitness Tracker Watch", price: 5999, vendor: "FitZone", image: "Fitness Tracker Watch.jpg", type: "Smartwatch", strapMaterial: "Silicone", caseMaterial: "Plastic", waterResistance: "5 ATM", otherImages: ["Fitness Tracker Watch1.jpg", "Fitness Tracker Watch2.jpg", "Fitness Tracker Watch3.jpg"], lat: 17.4399, lon: 78.4421, category: "Watches", subcategory: "Men's Watches" },
    { id: 2006, name: "Pilot Chronograph", price: 6499, vendor: "AeroTime", image: "Pilot Chronograph.jpg", type: "Analog", strapMaterial: "Leather", caseMaterial: "Stainless Steel", waterResistance: "10 ATM", otherImages: ["Pilot Chronograph1.jpg", "Pilot Chronograph2.jpg", "Pilot Chronograph3.jpg"], lat: 17.4455, lon: 78.3800, category: "Watches", subcategory: "Men's Watches" },
    { id: 2007, name: "Dive Watch", price: 8499, vendor: "OceanTime", image: "Dive Watch.jpg", type: "Analog", strapMaterial: "Rubber", caseMaterial: "Stainless Steel", waterResistance: "20 ATM", otherImages: ["Dive Watch1.jpg", "Dive Watch2.jpg", "Dive Watch3.jpg"], lat: 17.4480, lon: 78.3890, category: "Watches", subcategory: "Men's Watches" },
    { id: 2008, name: "Hybrid Smartwatch", price: 9999, vendor: "TechTrend", image: "Hybrid Smartwatch.jpg", type: "Hybrid", strapMaterial: "Silicone", caseMaterial: "Titanium", waterResistance: "5 ATM", otherImages: ["Hybrid Smartwatch1.jpg", "Hybrid Smartwatch2.jpg", "Hybrid Smartwatch3.jpg"], lat: 17.4520, lon: 78.3870, category: "Watches", subcategory: "Men's Watches" },
    { id: 2009, name: "Rose Watch", price: 6999, vendor: "ChicTime", image: "Rose Watch.jpg", type: "Analog", strapMaterial: "Rose Gold Steel", caseMaterial: "Rose Gold Steel", waterResistance: "3 ATM", otherImages: ["Rose Watch1.jpg", "Rose Watch2.jpg", "Rose Watch3.jpg"], lat: 17.4400, lon: 78.3850, category: "Watches", subcategory: "Women's Watches" },
    { id: 2010, name: "Crystal Smartwatch", price: 8999, vendor: "TechStyle", image: "Crystal Smartwatch.jpg", type: "Smartwatch", strapMaterial: "Silicone", caseMaterial: "Aluminum", waterResistance: "5 ATM", otherImages: ["Crystal Smartwatch1.jpg", "Crystal Smartwatch2.jpg", "Crystal Smartwatch3.jpg"], lat: 17.4490, lon: 78.3950, category: "Watches", subcategory: "Women's Watches" },
    { id: 2011, name: "Minimalist Silver Watch", price: 4499, vendor: "SimpleTime", image: "Minimalist Silver Watch.jpg", type: "Analog", strapMaterial: "Stainless Steel", caseMaterial: "Stainless Steel", waterResistance: "3 ATM", otherImages: ["Minimalist Silver Watch1.jpg", "Minimalist Silver Watch2.jpg", "Minimalist Silver Watch3.jpg"], lat: 17.4550, lon: 78.3920, category: "Watches", subcategory: "Women's Watches" },
    { id: 2012, name: "Diamond Accent Watch", price: 14999, vendor: "LuxeTime", image: "Diamond Accent Watch.jpg", type: "Analog", strapMaterial: "Stainless Steel", caseMaterial: "Stainless Steel", waterResistance: "5 ATM", otherImages: ["Diamond Accent Watch1.jpg", "Diamond Accent Watch2.jpg", "Diamond Accent Watch3.jpg"], lat: 17.4430, lon: 78.3860, category: "Watches", subcategory: "Women's Watches" },
    { id: 2013, name: "Fitness Band", price: 3999, vendor: "FitChic", image: "Fitness Band.jpg", type: "Smartwatch", strapMaterial: "Silicone", caseMaterial: "Plastic", waterResistance: "5 ATM", otherImages: ["Fitness Band1.jpg", "Fitness Band2.jpg", "Fitness Band3.jpg"], lat: 17.4500, lon: 78.3840, category: "Watches", subcategory: "Women's Watches" },
    { id: 2014, name: "Pearl Elegance Watch", price: 7999, vendor: "GraceTime", image: "Pearl Elegance Watch.jpg", type: "Analog", strapMaterial: "Pearl", caseMaterial: "Stainless Steel", waterResistance: "3 ATM", otherImages: ["Pearl Elegance Watch1.jpg", "Pearl Elegance Watch2.jpg", "Pearl Elegance Watch3.jpg"], lat: 17.4470, lon: 78.3910, category: "Watches", subcategory: "Women's Watches" },
    { id: 2015, name: "Rose Quartz Smartwatch", price: 10999, vendor: "TechChic", image: "Rose Quartz Smartwatch.jpg", type: "Smartwatch", strapMaterial: "Silicone", caseMaterial: "Aluminum", waterResistance: "5 ATM", otherImages: ["Rose Quartz Smartwatch1.jpg", "Rose Quartz Smartwatch2.jpg", "Rose Quartz Smartwatch3.jpg"], lat: 17.4400, lon: 78.3850, category: "Watches", subcategory: "Women's Watches" },
    { id: 2016, name: "Floral Accent Watch", price: 5499, vendor: "BloomTime", image: "Floral Accent Watch.jpg", type: "Analog", strapMaterial: "Leather", caseMaterial: "Stainless Steel", waterResistance: "3 ATM", otherImages: ["Floral Accent Watch1.jpg", "Floral Accent Watch2.jpg", "Floral Accent Watch3.jpg"], lat: 17.4486, lon: 78.3908, category: "Watches", subcategory: "Women's Watches" },
    { id: 2017, name: "Cartoon Watch", price: 1499, vendor: "KidsTime", image: "Cartoon Watch.jpg", type: "Digital", strapMaterial: "Rubber", caseMaterial: "Plastic", waterResistance: "1 ATM", otherImages: ["Cartoon Watch1.jpg", "Cartoon Watch2.jpg", "Cartoon Watch3.jpg"], lat: 17.4512, lon: 78.3855, category: "Watches", subcategory: "Kids' Watches" },
    { id: 2018, name: "Smart Watch", price: 2999, vendor: "TechKids", image: "Smart Watch.jpg", type: "Smartwatch", strapMaterial: "Silicone", caseMaterial: "Plastic", waterResistance: "3 ATM", otherImages: ["Smart Watch1.jpg", "Smart Watch2.jpg", "Smart Watch3.jpg"], lat: 17.4421, lon: 78.3882, category: "Watches", subcategory: "Kids' Watches" },
    { id: 2019, name: "Colorful Digital Watch", price: 999, vendor: "FunTime", image: "Colorful Digital Watch.jpg", type: "Digital", strapMaterial: "Silicone", caseMaterial: "Plastic", waterResistance: "1 ATM", otherImages: ["Colorful Digital Watch1.jpg", "Colorful Digital Watch2.jpg", "Colorful Digital Watch3.jpg"], lat: 17.4550, lon: 78.3920, category: "Watches", subcategory: "Kids' Watches" },
    { id: 2020, name: "Superhero Watch", price: 1999, vendor: "HeroTime", image: "Superhero Watch.jpg", type: "Analog", strapMaterial: "Nylon", caseMaterial: "Plastic", waterResistance: "3 ATM", otherImages: ["Superhero Watch1.jpg", "Superhero Watch2.jpg", "Superhero Watch3.jpg"], lat: 17.4399, lon: 78.4421, category: "Watches", subcategory: "Kids' Watches" },
    { id: 2021, name: "Learning Watch", price: 2499, vendor: "EduTime", image: "Learning Watch.jpg", type: "Digital", strapMaterial: "Silicone", caseMaterial: "Plastic", waterResistance: "1 ATM", otherImages: ["Learning Watch1.jpg", "Learning Watch2.jpg", "Learning Watch3.jpg"], lat: 17.4455, lon: 78.3800, category: "Watches", subcategory: "Kids' Watches" },
    { id: 2022, name: "Animal Print Watch", price: 1799, vendor: "WildTime", image: "Animal Print Watch.jpg", type: "Analog", strapMaterial: "Faux Leather", caseMaterial: "Stainless Steel", waterResistance: "3 ATM", otherImages: ["Animal Print Watch1.jpg", "Animal Print Watch2.jpg", "Animal Print Watch3.jpg"], lat: 17.4480, lon: 78.3890, category: "Watches", subcategory: "Kids' Watches" },
    { id: 2023, name: "Glow Digital Watch", price: 1299, vendor: "BrightTime", image: "Glow Digital Watch.jpg", type: "Digital", strapMaterial: "Silicone", caseMaterial: "Plastic", waterResistance: "1 ATM", otherImages: ["Glow Digital Watch1.jpg", "Glow Digital Watch2.jpg", "Glow Digital Watch3.jpg"], lat: 17.4520, lon: 78.3870, category: "Watches", subcategory: "Kids' Watches" },
    { id: 2024, name: "Adventure Smartwatch", price: 3499, vendor: "ExploreTime", image: "Adventure Smartwatch.jpg", type: "Smartwatch", strapMaterial: "Nylon", caseMaterial: "Resin", waterResistance: "10 ATM", otherImages: ["Adventure Smartwatch1.jpg", "Adventure Smartwatch2.jpg", "Adventure Smartwatch3.jpg"], lat: 17.4400, lon: 78.3850, category: "Watches", subcategory: "Kids' Watches" }
];

const WatchesProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
            console.log('🔍 WatchesProductDetail - Rendering product:', product.name);
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
        return allWatchesProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#watches-products" onClick={(e) => { e.preventDefault(); navigateTo('watches-products'); }} className="back-link">&larr; Back to Watches</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#watches-products" onClick={(e) => { e.preventDefault(); navigateTo('watches-products'); }} className="back-link">&larr; Back to Watches</a>
            
            <div className="product-detail-container">
                <div className="product-images">
                    <div className="main-image">
                        <img src={mainImage} alt={product.name} onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image'} />
                    </div>
                    <div className="thumbnail-track">
                        {thumbnailImages.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className={`thumbnail ${mainImage === imgSrc ? 'active' : ''}`}
                                onClick={() => setMainImage(imgSrc)}
                                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No'}
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
                        <p>{product.description || 'An elegant timepiece that combines style and precision. Perfect for any occasion, from formal events to everyday wear.'}</p>
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
                        <h3>Details</h3>
                        <div className="spec-grid">
                            <div className="spec-item"><strong>Style</strong><span>{product.style || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Movement</strong><span>{product.movement || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Color</strong><span>{product.color || 'N/A'}</span></div>
                        </div>
                    </div>

                    <div className="product-actions">
                        {isInCart ? (
                            <button className="btn go-to-cart" onClick={() => navigateTo('cart')}>Go to Cart</button>
                        ) : (
                            <button className="btn" onClick={() => onAddToCart(product)}>Add to Cart</button>
                        )}

                        <button className={`wishlist-heart-btn ${isInWishlist ? 'active' : ''}`} title="Add to Wishlist" onClick={() => onToggleWishlist(product)}>
                            <i className={isInWishlist ? 'fas fa-heart' : 'far fa-heart'} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="related-products-section">
                <h2>Related Products</h2>
                <div className="related-product-grid">
                    {relatedProducts.map(related => (
                        <div key={related.id} className="related-product-card" onClick={() => onViewProduct(related)} style={{cursor: 'pointer'}}>
                            <img src={getImageSrc(related.image)} alt={related.name} onError={(e)=> e.currentTarget.src='https://via.placeholder.com/200x200?text=No+Image'} />
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

export default WatchesProductDetail;