import React, { useState, useEffect, useMemo } from 'react';
import './PetfoodProductDetail.css';

export const allPetfoodProducts = [
    { "id": 1401, "name": "Dry Dog Food", "price": 799, "vendor": "Pet Nutrition", "category": "Pet Food", "image": "Dry Dog Food.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 50, "description": "High-quality dry dog food with balanced nutrition for adult dogs" },
    { "id": 1402, "name": "Wet Cat Food", "price": 499, "vendor": "Feline Feast", "category": "Pet Food", "image": "Wet Cat Food.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 40, "description": "Tasty wet cat food in gravy, perfect for feline nutrition" },
    { "id": 1403, "name": "Puppy Kibble", "price": 899, "vendor": "Puppy Palace", "category": "Pet Food", "image": "Puppy Kibble.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 35, "description": "Nutritious kibble specially formulated for growing puppies" },
    { "id": 1404, "name": "Senior Dog Food", "price": 749, "vendor": "Pet Nutrition", "category": "Pet Food", "image": "Senior Dog Food.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 30, "description": "Specialized food for senior dogs with joint support ingredients" },
    { "id": 1405, "name": "Grain-Free Cat Food", "price": 999, "vendor": "Feline Feast", "category": "Pet Food", "image": "Grain-Free Cat Food.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 25, "description": "Grain-free cat food for sensitive feline digestive systems" },
    { "id": 1406, "name": "Dog Treats", "price": 399, "vendor": "Pet Treats Co.", "category": "Pet Food", "image": "Dog Treats.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 60, "description": "Delicious dog treats for training and rewards" },
    { "id": 1407, "name": "Cat Treats", "price": 349, "vendor": "Feline Feast", "category": "Pet Food", "image": "Cat Treats.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 55, "description": "Tasty cat treats to pamper your feline friend" },
    { "id": 1408, "name": "Puppy Wet Food", "price": 599, "vendor": "Puppy Palace", "category": "Pet Food", "image": "Puppy Wet Food.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 45, "description": "Soft wet food ideal for puppies transitioning to solid food" },
    { "id": 1409, "name": "Senior Cat Food", "price": 799, "vendor": "Feline Feast", "category": "Pet Food", "image": "Senior Cat Food.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 28, "description": "Nutrient-rich food for senior cats with added vitamins" },
    { "id": 1410, "name": "Dog Dental Chews", "price": 499, "vendor": "Pet Treats Co.", "category": "Pet Food", "image": "Dog Dental Chews.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 40, "description": "Dental chews that help clean teeth and freshen breath" },
    { "id": 1411, "name": "Kitten Food", "price": 699, "vendor": "Feline Feast", "category": "Pet Food", "image": "Kitten Food.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 32, "description": "Specialized nutrition for growing kittens" },
    { "id": 1412, "name": "Grain-Free Dog Food", "price": 999, "vendor": "Pet Nutrition", "category": "Pet Food", "image": "Grain-Free Dog Food.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 20, "description": "Grain-free dog food for dogs with grain sensitivities" },
    { "id": 1413, "name": "Cat Dental Treats", "price": 399, "vendor": "Feline Feast", "category": "Pet Food", "image": "Cat Dental Treats.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 38, "description": "Dental treats that promote oral health in cats" },
    { "id": 1414, "name": "Adult Dog Food", "price": 849, "vendor": "Pet Nutrition", "category": "Pet Food", "image": "Adult Dog Food.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 42, "description": "Balanced adult dog food for daily nutrition" },
    { "id": 1415, "name": "Fish Food Flakes", "price": 299, "vendor": "Aquatic Pets", "category": "Pet Food", "image": "Fish Food Flakes.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 70, "description": "Nutritious flakes for tropical fish and aquarium pets" }
];

const PetfoodProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
            console.log('🔍 PetfoodProductDetail - Rendering product:', product.name);
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
        return allPetfoodProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#petfood-products" onClick={(e) => { e.preventDefault(); navigateTo('petfood-products'); }} className="back-link">&larr; Back to Pet Food Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#petfood-products" onClick={(e) => { e.preventDefault(); navigateTo('petfood-products'); }} className="back-link">&larr; Back to Pet Food Products</a>
            
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
                        <p>{product.description || 'Nutritious and delicious food for your beloved pet. Made with high-quality ingredients to ensure their health and happiness.'}</p>
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
                <h2>You might also like</h2>
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

export default PetfoodProductDetail;