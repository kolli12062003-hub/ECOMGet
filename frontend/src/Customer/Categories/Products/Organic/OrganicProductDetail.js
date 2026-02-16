import React, { useState, useEffect, useMemo } from 'react';
import './OrganicProductDetail.css';

export const allOrganicProducts = [
    { id: 1601, name: "Organic Tomatoes", price: 80, vendor: "FarmFresh", image: "Organic Tomatoes.jpg", type: "Vegetable", weight: "1kg", features: "Pesticide-free, vine-ripened", otherImages: ["Organic Tomatoes1.jpg", "Organic Tomatoes2.jpg", "Organic Tomatoes3.jpg"], lat: 17.4486, lon: 78.3908, category: "Organic Veggies&Fruits" },
    { id: 1602, name: "Organic Carrots", price: 60, vendor: "GreenHarvest", image: "Organic Carrots.jpg", type: "Vegetable", weight: "500g", features: "Fresh, crunchy, nutrient-rich", otherImages: ["Organic Carrots1.jpg", "Organic Carrots2.jpg", "Organic Carrots3.jpg"], lat: 17.4512, lon: 78.3855, category: "Organic Veggies&Fruits" },
    { id: 1603, name: "Organic Apples", price: 150, vendor: "OrchardPure", image: "Organic Apples.jpg", type: "Fruit", weight: "1kg", features: "Sweet, juicy, no chemicals", otherImages: ["Organic Apples1.jpg", "Organic Apples2.jpg", "Organic Apples3.jpg"], lat: 17.4421, lon: 78.3882, category: "Organic Veggies&Fruits" },
    { id: 1604, name: "Organic Spinach", price: 40, vendor: "LeafyGreens", image: "Organic Spinach.jpg", type: "Vegetable", weight: "200g", features: "Tender leaves, iron-rich", otherImages: ["Organic Spinach1.jpg", "Organic Spinach2.jpg", "Organic Spinach3.jpg"], lat: 17.4550, lon: 78.3920, category: "Organic Veggies&Fruits" },
    { id: 1605, name: "Organic Bananas", price: 50, vendor: "TropicalFresh", image: "Organic Bananas.jpg", type: "Fruit", weight: "1kg", features: "Naturally ripened, potassium-rich", otherImages: ["Organic Bananas1.jpg", "Organic Bananas2.jpg", "Organic Bananas3.jpg"], lat: 17.4399, lon: 78.4421, category: "Organic Veggies&Fruits" },
    { id: 1606, name: "Organic Bell Peppers", price: 120, vendor: "ColorVeggies", image: "Organic Bell Peppers.jpg", type: "Vegetable", weight: "500g", features: "Mixed colors, vitamin C rich", otherImages: ["Organic Bell Peppers1.jpg", "Organic Bell Peppers2.jpg", "Organic Bell Peppers3.jpg"], lat: 17.4455, lon: 78.3800, category: "Organic Veggies&Fruits" },
    { id: 1607, name: "Organic Avocados", price: 200, vendor: "CreamyFruit", image: "Organic Avocados.jpg", type: "Fruit", weight: "2 pieces", features: "Creamy, healthy fats", otherImages: ["Organic Avocados1.jpg", "Organic Avocados2.jpg", "Organic Avocados3.jpg"], lat: 17.4480, lon: 78.3890, category: "Organic Veggies&Fruits" },
    { id: 1608, name: "Organic Cucumbers", price: 30, vendor: "CoolCrunch", image: "Organic Cucumbers.jpg", type: "Vegetable", weight: "500g", features: "Hydrating, low calories", otherImages: ["Organic Cucumbers1.jpg", "Organic Cucumbers2.jpg", "Organic Cucumbers3.jpg"], lat: 17.4520, lon: 78.3870, category: "Organic Veggies&Fruits" },
    { id: 1609, name: "Organic Strawberries", price: 180, vendor: "BerrySweet", image: "Organic Strawberries.jpg", type: "Fruit", weight: "250g", features: "Sweet, antioxidant-rich", otherImages: ["Organic Strawberries1.jpg", "Organic Strawberries2.jpg", "Organic Strawberries3.jpg"], lat: 17.4400, lon: 78.3850, category: "Organic Veggies&Fruits" },
    { id: 1610, name: "Organic Broccoli", price: 90, vendor: "GreenCrown", image: "Organic Broccoli.jpg", type: "Vegetable", weight: "500g", features: "Nutrient-dense, florets", otherImages: ["Organic Broccoli1.jpg", "Organic Broccoli2.jpg", "Organic Broccoli3.jpg"], lat: 17.4490, lon: 78.3950, category: "Organic Veggies&Fruits" },
    { id: 1611, name: "Organic Blueberries", price: 250, vendor: "BlueBerry", image: "Organic Blueberries.jpg", type: "Fruit", weight: "125g", features: "Antioxidant powerhouse", otherImages: ["Organic Blueberries1.jpg", "Organic Blueberries2.jpg", "Organic Blueberries3.jpg"], lat: 17.4550, lon: 78.3920, category: "Organic Veggies&Fruits" },
    { id: 1612, name: "Organic Potatoes", price: 40, vendor: "EarthRoot", image: "Organic Potatoes.jpg", type: "Vegetable", weight: "1kg", features: "Starchy, versatile", otherImages: ["Organic Potatoes1.jpg", "Organic Potatoes2.jpg", "Organic Potatoes3.jpg"], lat: 17.4430, lon: 78.3860, category: "Organic Veggies&Fruits" },
    { id: 1613, name: "Organic Lettuce", price: 50, vendor: "LeafyGreens", image: "Organic Lettuce.jpg", type: "Vegetable", weight: "200g", features: "Crisp, salad ready", otherImages: ["Organic Lettuce1.jpg", "Organic Lettuce2.jpg", "Organic Lettuce3.jpg"], lat: 17.4500, lon: 78.3840, category: "Organic Veggies&Fruits" },
    { id: 1614, name: "Organic Oranges", price: 100, vendor: "CitrusSun", image: "Organic Oranges.jpg", type: "Fruit", weight: "1kg", features: "Juicy, vitamin C", otherImages: ["Organic Oranges1.jpg", "Organic Oranges2.jpg", "Organic Oranges3.jpg"], lat: 17.4470, lon: 78.3910, category: "Organic Veggies&Fruits" },
    { id: 1615, name: "Organic Zucchini", price: 70, vendor: "SquashFarm", image: "Organic Zucchini.jpg", type: "Vegetable", weight: "500g", features: "Mild flavor, versatile", otherImages: ["Organic Zucchini1.jpg", "Organic Zucchini2.jpg", "Organic Zucchini3.jpg"], lat: 17.4400, lon: 78.3850, category: "Organic Veggies&Fruits" }
];

const OrganicProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
            console.log('🔍 OrganicProductDetail - Rendering product:', product.name);
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
        return allOrganicProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#organic-products" onClick={(e) => { e.preventDefault(); navigateTo('organic-products'); }} className="back-link">&larr; Back to Organic Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#organic-products" onClick={(e) => { e.preventDefault(); navigateTo('organic-products'); }} className="back-link">&larr; Back to Organic Products</a>
            
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
                        <p>{product.description || 'Fresh and organic, straight from the farm. This high-quality produce is perfect for a healthy lifestyle.'}</p>
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
                        <i className="fas fa-map-marker-alt" />
                        <span>{product.distance || 'Distance N/A'}</span>
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
}

export default OrganicProductDetail;