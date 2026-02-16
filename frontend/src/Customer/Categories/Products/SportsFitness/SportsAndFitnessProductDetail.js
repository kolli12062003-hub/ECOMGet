import React, { useState, useEffect, useMemo } from 'react';
import './SportsAndFitnessProductDetail.css';

export const allSportsAndFitnessProducts = [
    { id: 1401, name: "Treadmill", price: 29999, vendor: "FitTech", image: "Treadmill.jpg", type: "Cardio Equipment", material: "Steel, Plastic", color: "Black", capacity: "Motorized", features: "Speed control, heart rate monitor", otherImages: ["Treadmill1.jpg", "Treadmill2.jpg", "Treadmill3.jpg"], lat: 17.4486, lon: 78.3908, category: "Sports & Fitness" },
    { id: 1402, name: "Yoga Mat", price: 1499, vendor: "ZenFitness", image: "Yoga Mat.jpg", type: "Yoga Accessory", material: "Rubber", color: "Purple", capacity: "6mm thick", features: "Non-slip surface, eco-friendly", otherImages: ["Yoga Mat1.jpg", "Yoga Mat2.jpg", "Yoga Mat3.jpg"], lat: 17.4512, lon: 78.3855, category: "Sports & Fitness" },
    { id: 1403, name: "Dumbbell Set", price: 4999, vendor: "PowerLift", image: "Dumbbell Set.jpg", type: "Strength Training", material: "Cast Iron", color: "Black", capacity: "5-20kg set", features: "Adjustable weights, ergonomic grip", otherImages: ["Dumbbell Set1.jpg", "Dumbbell Set2.jpg", "Dumbbell Set3.jpg"], lat: 17.4421, lon: 78.3882, category: "Sports & Fitness" },
    { id: 1404, name: "Resistance Bands", price: 999, vendor: "FlexFit", image: "Resistance Bands.jpg", type: "Resistance Training", material: "Latex", color: "Assorted", capacity: "Set of 5", features: "Different resistance levels, portable", otherImages: ["Resistance Bands1.jpg", "Resistance Bands2.jpg", "Resistance Bands3.jpg"], lat: 17.4550, lon: 78.3920, category: "Sports & Fitness" },
    { id: 1405, name: "Stationary Bike", price: 19999, vendor: "CyclePro", image: "Stationary Bike.jpg", type: "Cardio Equipment", material: "Steel, Plastic", color: "White", capacity: "Magnetic resistance", features: "LCD display, adjustable seat", otherImages: ["Stationary Bike1.jpg", "Stationary Bike2.jpg", "Stationary Bike3.jpg"], lat: 17.4399, lon: 78.4421, category: "Sports & Fitness" },
    { id: 1406, name: "Kettlebell", price: 2499, vendor: "IronCore", image: "Kettlebell.jpg", type: "Strength Training", material: "Cast Iron", color: "Black", capacity: "16kg", features: "Ergonomic handle, durable finish", otherImages: ["Kettlebell1.jpg", "Kettlebell2.jpg", "Kettlebell3.jpg"], lat: 17.4455, lon: 78.3800, category: "Sports & Fitness" },
    { id: 1407, name: "Fitness Tracker", price: 3999, vendor: "HealthBand", image: "Fitness Tracker.jpg", type: "Wearable", material: "Plastic, Silicone", color: "Black", capacity: "Water resistant", features: "Heart rate monitor, step counter", otherImages: ["Fitness Tracker1.jpg", "Fitness Tracker2.jpg", "Fitness Tracker3.jpg"], lat: 17.4480, lon: 78.3890, category: "Sports & Fitness" },
    { id: 1408, name: "Jump Rope", price: 499, vendor: "SpeedJump", image: "Jump Rope.jpg", type: "Cardio Accessory", material: "Plastic, Steel", color: "Red", capacity: "Adjustable length", features: "Speed bearings, comfortable handles", otherImages: ["Jump Rope1.jpg", "Jump Rope2.jpg", "Jump Rope3.jpg"], lat: 17.4520, lon: 78.3870, category: "Sports & Fitness" },
    { id: 1409, name: "Exercise Ball", price: 1299, vendor: "BalanceFit", image: "Exercise Ball.jpg", type: "Stability Training", material: "PVC", color: "Blue", capacity: "65cm", features: "Anti-burst, non-slip surface", otherImages: ["Exercise Ball1.jpg", "Exercise Ball2.jpg", "Exercise Ball3.jpg"], lat: 17.4400, lon: 78.3850, category: "Sports & Fitness" },
    { id: 1410, name: "Weight Bench", price: 7999, vendor: "GymPro", image: "Weight Bench.jpg", type: "Strength Training", material: "Steel", color: "Black", capacity: "Adjustable incline", features: "Padded seat, sturdy frame", otherImages: ["Weight Bench1.jpg", "Weight Bench2.jpg", "Weight Bench3.jpg"], lat: 17.4490, lon: 78.3950, category: "Sports & Fitness" },
    { id: 1411, name: "Running Shoes", price: 5999, vendor: "RunFast", image: "Running Shoes.jpg", type: "Footwear", material: "Mesh, Rubber", color: "Blue", capacity: "Size 8-12", features: "Cushioned sole, breathable", otherImages: ["Running Shoes1.jpg", "Running Shoes2.jpg", "Running Shoes3.jpg"], lat: 17.4550, lon: 78.3920, category: "Sports & Fitness" },
    { id: 1412, name: "Sports Water Bottle", price: 799, vendor: "HydroFit", image: "Sports Water Bottle.jpg", type: "Hydration", material: "Plastic", color: "Green", capacity: "1 Liter", features: "Leak-proof, BPA-free", otherImages: ["Sports Water Bottle1.jpg", "Sports Water Bottle2.jpg", "Sports Water Bottle3.jpg"], lat: 17.4430, lon: 78.3860, category: "Sports & Fitness" },
    { id: 1413, name: "Gym Gloves", price: 699, vendor: "LiftSafe", image: "Gym Gloves.jpg", type: "Protective Gear", material: "Leather", color: "Black", capacity: "One size", features: "Grip enhancement, wrist support", otherImages: ["Gym Gloves1.jpg", "Gym Gloves2.jpg", "Gym Gloves3.jpg"], lat: 17.4500, lon: 78.3840, category: "Sports & Fitness" },
    { id: 1414, name: "Elliptical Trainer", price: 34999, vendor: "FitTech", image: "Elliptical Trainer.jpg", type: "Cardio Equipment", material: "Steel, Plastic", color: "Silver", capacity: "Magnetic resistance", features: "LCD console, heart rate sensors", otherImages: ["Elliptical Trainer1.jpg", "Elliptical Trainer2.jpg", "Elliptical Trainer3.jpg"], lat: 17.4470, lon: 78.3910, category: "Sports & Fitness" },
    { id: 1415, name: "Tennis Racket", price: 3999, vendor: "CourtMaster", image: "Tennis Racket.jpg", type: "Racket Sports", material: "Graphite", color: "White", capacity: "Oversized head", features: "Lightweight, powerful", otherImages: ["Tennis Racket1.jpg", "Tennis Racket2.jpg", "Tennis Racket3.jpg"], lat: 17.4400, lon: 78.3850, category: "Sports & Fitness" }
];

const SportsAndFitnessProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
    // Handle image source - check for uploaded files (with timestamps) vs static images
    const getImageSrc = (image) => {
        if (!image) {
            console.log('No image provided for product');
            return 'https://via.placeholder.com/200x150?text=No+Image';
        }

        // Check if image is already a full URL (uploaded via admin)
        if (image.startsWith('http://') || image.startsWith('https://')) {
            console.log('Using full URL image:', image);
            return image;
        }

        // Check if image is an uploaded file (contains timestamp like "1234567890-filename.jpg")
        if (image.includes('-') && /^\d+-\w+\./.test(image)) {
            const uploadPath = `http://localhost:5000/uploads/${image}`;
            console.log('Using uploaded image path:', uploadPath);
            return uploadPath;
        }

        // Otherwise, it's a static image
        const staticPath = `/IMAGES/${image}`;
        console.log('Using static image path:', staticPath);
        return staticPath;
    };

    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        if (product) {
            setMainImage(getImageSrc(product.image));
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
        return allSportsAndFitnessProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#sports-fitness-products" onClick={(e) => { e.preventDefault(); navigateTo('sports-fitness-products'); }} className="back-link">&larr; Back to Sports & Fitness</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a
                href="#sports-fitness-products"
                onClick={(e) => { e.preventDefault(); navigateTo('sports-fitness-products'); }}
                className="back-link"
            >
                &larr; Back to Sports & Fitness
            </a>
            
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
                        <p>High-quality gear to help you achieve your fitness goals. Durable, reliable, and designed for performance.</p>
                    </div>
                    <div className="product-distance">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{product.distance || 'Distance N/A'}</span>
                    </div>
                    <div className="product-specs">
                        <h3>Details</h3>
                        <div className="spec-grid">
                            <div className="spec-item"><strong>Brand</strong><span>{product.brand || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Type</strong><span>{product.type || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Best For</strong><span>{product.use || 'N/A'}</span></div>
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

export default SportsAndFitnessProductDetail;
