import React, { useState, useEffect, useMemo } from 'react';
import './KitchenProductDetail.css';

export const allKitchenProducts = [
    { id: 1301, name: "Non-Stick Cookware Set", price: 3999, vendor: "Kitchen Essentials", image: "nonstick.jpg", material: "Aluminum, Teflon Coating", color: "Black", capacity: "5-piece set", features: "Induction compatible, PFOA-free", otherImages: ["nonstick1.jpeg", "nonstick2.jpeg", "nonstick3.jpeg"], lat: 17.4486, lon: 78.3908,category :"Kitchen Products" },
             { id: 1302, name: "Stainless Steel Knife Set", price: 1499, vendor: "Cookware Hub", image: "Stainless Steel Knife Set.jpg", material: "Stainless Steel", color: "Silver", capacity: "6-piece set", features: "Ergonomic handles, includes sharpener", otherImages: ["Stainless Steel Knife Set1.jpeg", "Stainless Steel Knife Set2.jpeg", "Stainless Steel Knife Set3.jpeg"], lat: 17.4512, lon: 78.3855,category :"Kitchen Products" },
             { id: 1303, name: "Air Fryer", price: 7999, vendor: "Tech Kitchen", image: "Air Fryer.jpg", material: "Plastic, Metal", color: "Black", capacity: "4.1 Liters", features: "Rapid Air technology, digital display", otherImages: ["Air Fryer1.jpeg", "Air Fryer2.jpeg", "Air Fryer3.jpeg"], lat: 17.4421, lon: 78.3882,category :"Kitchen Products" },
             { id: 1304, name: "Blender", price: 3499, vendor: "Cookware Hub", image: "Blender.jpg", material: "Plastic, Glass", color: "White", capacity: "1.5 Liters", features: "Multiple speed settings, powerful motor", otherImages: ["Blender1.jpeg", "Blender2.jpeg", "Blender3.jpeg"], lat: 17.4550, lon: 78.3920,category :"Kitchen Products" },
             { id: 1305, name: "Microwave Oven", price: 9999, vendor: "Tech Kitchen", image: "Microwave Oven.jpg", material: "Metal, Glass", color: "Silver", capacity: "28 Liters", features: "Convection, grill, and microwave modes", otherImages: ["Microwave Oven1.jpeg", "Microwave Oven2.jpeg", "Microwave Oven3.jpeg"], lat: 17.4399, lon: 78.4421,category :"Kitchen Products" },
             { id: 1306, name: "Mixing Bowl Set", price: 1299, vendor: "Cookware Hub", image: "Mixing Bowl Set.jpg", material: "Stainless Steel", color: "Silver", capacity: "3-piece set", features: "Nesting design for easy storage", otherImages: ["Mixing Bowl Set1.jpeg", "Mixing Bowl Set2.jpeg", "Mixing Bowl Set3.jpeg"], lat: 17.4455, lon: 78.3800,category :"Kitchen Products" },
             { id: 1307, name: "Electric Kettle", price: 1999, vendor: "Home Appliances", image: "Electric Kettle.jpg", material: "Stainless Steel", color: "Silver", capacity: "1.7 Liters", features: "Auto shut-off, boil-dry protection", otherImages: ["Electric Kettle1.jpeg", "Electric Kettle2.jpeg", "Electric Kettle3.jpeg"], lat: 17.4480, lon: 78.3890,category :"Kitchen Products" },
             { id: 1308, name: "Cutlery Set", price: 999, vendor: "Home Depot", image: "Cutlery Set.jpg", material: "Stainless Steel", color: "Silver", capacity: "24-piece set", features: "Elegant design, rust-resistant", otherImages: ["Cutlery Set1.jpeg", "Cutlery Set2.jpeg", "Cutlery Set3.jpeg"], lat: 17.4520, lon: 78.3870,category :"Kitchen Products" },
             { id: 1309, name: "Food Processor", price: 5999, vendor: "Tech Kitchen", image: "Food Processor.jpg", material: "Plastic, Metal", color: "Black", capacity: "2.1 Liters", features: "Multiple attachments for chopping, slicing, etc.", otherImages: ["Food Processor1.jpeg", "Food Processor2.jpeg", "Food Processor3.jpeg"], lat: 17.4400, lon: 78.3850,category :"Kitchen Products" },
            { id: 1310, name: "Toaster", price: 2499, vendor: "Home Appliances", image: "Toaster.jpg", material: "Stainless Steel", color: "Silver", capacity: "2-slice", features: "Variable browning control, crumb tray", otherImages: ["Toaster1.jpeg", "Toaster2.jpeg", "Toaster3.jpeg"], lat: 17.4490, lon: 78.3950,category :"Kitchen Products" },
             { id: 1311, name: "Glassware Set", price: 1799, vendor: "Home Depot", image: "Glassware Set.jpg", material: "Glass", color: "Transparent", capacity: "12-piece set", features: "Dishwasher safe, lead-free", otherImages: ["Glassware Set1.jpeg", "Glassware Set2.jpeg", "Glassware Set3.jpeg"], lat: 17.4550, lon: 78.3920,category :"Kitchen Products" },
             { id: 1312, name: "Pressure Cooker", price: 2999, vendor: "Tech Kitchen", image: "Pressure Cooker.jpg", material: "Stainless Steel", color: "Silver", capacity: "5 Liters", features: "Induction base, safety valve", otherImages: ["Pressure Cooker1.jpeg", "Pressure Cooker2.jpeg", "Pressure Cooker3.jpeg"], lat: 17.4430, lon: 78.3860,category :"Kitchen Products" },
             { id: 1313, name: "Silicone Baking Mat", price: 799, vendor: "Kitchen Essentials", image: "Silicone Baking Mat.jpg", material: "Silicone", color: "Red", capacity: "16.5 x 11.6 inches", features: "Non-stick, reusable", otherImages: ["Silicone Baking Mat1.jpeg", "Silicone Baking Mat2.jpeg", "Silicone Baking Mat3.jpeg"], lat: 17.4500, lon: 78.3840,category :"Kitchen Products" },
             { id: 1314, name: "Coffee Maker", price: 4999, vendor: "Tech Kitchen", image: "Coffee Maker.jpg", material: "Plastic, Glass", color: "Black", capacity: "12-cup", features: "Programmable, keep warm function", otherImages: ["Coffee Maker1.jpeg", "Coffee Maker2.jpeg", "Coffee Maker3.jpeg"], lat: 17.4470, lon: 78.3910,category :"Kitchen Products" },
            { id: 1315, name: "Ceramic Dinner Set", price: 3999, vendor: "Home Depot", image: "Ceramic Dinner Set.jpg", material: "Ceramic", color: "White/Blue", capacity: "12-piece set", features: "Microwave and dishwasher safe", otherImages: ["Ceramic Dinner Set1.jpeg", "Ceramic Dinner Set2.jpeg", "Ceramic Dinner Set3.jpeg"], lat: 17.4400, lon: 78.3850,category :"Kitchen Products" }
]

const KitchenProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
            console.log('🔍 KitchenProductDetail - Rendering product:', product.name);
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
        return allKitchenProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#kitchenproduct-products" onClick={(e) => { e.preventDefault(); navigateTo('kitchenproduct-products'); }} className="back-link">&larr; Back to Kitchen Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#kitchenproduct-products" onClick={(e) => { e.preventDefault(); navigateTo('kitchenproduct-products'); }} className="back-link">&larr; Back to Kitchen Products</a>
            
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
                        <p>{product.description || 'A high-quality kitchen product to make your cooking experience easier and more enjoyable.'}</p>
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

export default KitchenProductDetail;