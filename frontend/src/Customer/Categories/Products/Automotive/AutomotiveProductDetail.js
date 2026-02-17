import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './AutomotiveProductDetail.css';

export const allAutomotiveProducts = [
    { id: 101, name: "Car Wax", price: 799, vendor: "Auto Shine", image: "Car Wax.jpg", description: "High-gloss carnauba wax for a brilliant, long-lasting shine and protection.", brand: "ShineX", compatibility: "All paint types", otherImages: ["Car Wax1.jpg", "Car Wax2.jpg", "Car Wax3.jpg"], lat: 17.4486, lon: 78.3908, category: "Automotive" },
    { id: 102, name: "Tire Cleaner", price: 499, vendor: "Wheel Works", image: "Tire Cleaner.jpg", description: "Powerful foam cleaner that removes brake dust and road grime, leaving tires with a deep black finish.", brand: "GripClean", compatibility: "All tire types", otherImages: ["Tire Cleaner1.jpg", "Tire Cleaner2.jpg", "Tire Cleaner3.jpg"], lat: 17.4512, lon: 78.3855, category: "Automotive" },
    { id: 103, name: "Car Air Freshener", price: 299, vendor: "Fresh Drive", image: "Car Air Freshener.jpg", description: "Long-lasting new car scent to keep your vehicle's interior smelling fresh.", brand: "AuraScent", compatibility: "Universal", otherImages: ["Car Air Freshener1.jpg", "Car Air Freshener2.jpg", "Car Air Freshener3.jpg"], lat: 17.4421, lon: 78.3882, category: "Automotive" },
    { id: 104, name: "Engine Oil", price: 999, vendor: "Motor Mate", image: "Engine Oil.jpg", description: "Synthetic 5W-30 engine oil for improved performance and engine protection.", brand: "MotorLube", compatibility: "Most gasoline engines", otherImages: ["Engine Oil1.jpg", "Engine Oil2.jpg", "Engine Oil3.jpg"], lat: 17.4550, lon: 78.3920, category: "Automotive" },
    { id: 105, name: "Car Floor Mats", price: 1499, vendor: "Auto Comfort", image: "Car Floor Mats.jpg", description: "All-weather heavy-duty rubber floor mats to protect your car's interior.", brand: "FitRight", compatibility: "Universal trim-to-fit", otherImages: ["Car Floor Mats1.jpg", "Car Floor Mats2.jpg", "Car Floor Mats3.jpg"], lat: 17.4399, lon: 78.4421, category: "Automotive" },
    { id: 106, name: "Car Battery", price: 3999, vendor: "Power Plus", image: "Car Battery.jpg", description: "Reliable 12V car battery with a 3-year warranty for consistent starting power.", brand: "DuraStart", compatibility: "Check vehicle model", otherImages: ["Car Battery1.jpg", "Car Battery2.jpg", "Car Battery3.jpg"], lat: 17.4455, lon: 78.3800, category: "Automotive" },
    { id: 107, name: "Brake Pads", price: 1999, vendor: "Stop Safe", image: "Brake Pads.jpg", description: "Set of ceramic front brake pads for quiet and reliable stopping power.", brand: "StopSure", compatibility: "Fits most sedans", otherImages: ["Brake Pads1.jpg", "Brake Pads2.jpg", "Brake Pads3.jpg"], lat: 17.4480, lon: 78.3890, category: "Automotive" },
    { id: 108, name: "Car Wash Shampoo", price: 399, vendor: "Clean Ride", image: "Car Wash Shampoo.jpg", description: "pH-neutral car wash shampoo that safely lifts dirt without stripping wax.", brand: "SudsUp", compatibility: "All paint types", otherImages: ["Car Wash Shampoo1.jpg", "Car Wash Shampoo2.jpg", "Car Wash Shampoo3.jpg"], lat: 17.4520, lon: 78.3870, category: "Automotive" },
    { id: 109, name: "Oil Filter", price: 599, vendor: "Engine Care", image: "Oil Filter.jpg", description: "High-efficiency oil filter designed to protect your engine from contaminants.", brand: "PureFlow", compatibility: "Check vehicle model", otherImages: ["Oil Filter1.jpg", "Oil Filter2.jpg", "Oil Filter3.jpg"], lat: 17.4400, lon: 78.3850, category: "Automotive" },
    { id: 110, name: "Car Seat Covers", price: 2499, vendor: "Interior Style", image: "Car Seat Covers.jpg", description: "Premium leatherette car seat covers for a stylish and protective upgrade.", brand: "CoverLuxe", compatibility: "Universal fit", otherImages: ["Car Seat Covers1.jpg", "Car Seat Covers2.jpg", "Car Seat Covers3.jpg"], lat: 17.4490, lon: 78.3950, category: "Automotive" },
    { id: 111, name: "Air Filter", price: 499, vendor: "Pure Air", image: "Air Filter.jpg", description: "Engine air filter that improves airflow and prevents harmful particles from entering the engine.", brand: "BreatheClean", compatibility: "Check vehicle model", otherImages: ["Air Filter1.jpg", "Air Filter2.jpg", "Air Filter3.jpg"], lat: 17.4550, lon: 78.3920, category: "Automotive" },
    { id: 112, name: "Car Polisher", price: 1299, vendor: "Shine Pro", image: "Car Polisher.jpg", description: "Orbital car polisher for applying wax and sealant for a swirl-free finish.", brand: "BuffMaster", compatibility: "N/A", otherImages: ["Car Polisher1.jpg", "Car Polisher2.jpg", "Car Polisher3.jpg"], lat: 17.4430, lon: 78.3860, category: "Automotive" },
    { id: 113, name: "Windshield Cleaner", price: 399, vendor: "Clear View", image: "Windshield Cleaner.jpg", description: "Streak-free glass cleaner for crystal clear visibility.", brand: "GlassGleam", compatibility: "All glass surfaces", otherImages: ["Windshield Cleaner1.jpg", "Windshield Cleaner2.jpg", "Windshield Cleaner3.jpg"], lat: 17.4500, lon: 78.3840, category: "Automotive" },
    { id: 114, name: "Car Vacuum Cleaner", price: 1999, vendor: "Clean Cabin", image: "Car Vacuum Cleaner.jpg", description: "Portable 12V car vacuum cleaner with multiple attachments for a thorough clean.", brand: "VacuPro", compatibility: "12V car outlet", otherImages: ["Car Vacuum Cleaner1.jpg", "Car Vacuum Cleaner2.jpg", "Car Vacuum Cleaner3.jpg"], lat: 17.4470, lon: 78.3910, category: "Automotive" },
    { id: 115, name: "Car Cover", price: 999, vendor: "Protect Plus", image: "Car Cover.jpg", description: "Water-resistant and UV-protective car cover for all-season protection.", brand: "ShieldAll", compatibility: "Fits sedans up to 190 inches", otherImages: ["Car Cover1.jpg", "Car Cover2.jpg", "Car Cover3.jpg"], lat: 17.4400, lon: 78.3850, category: "Automotive" }
];

const AutomotiveProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
    const [productWithDistance, setProductWithDistance] = useState(product);
    const [relatedProductsWithDistance, setRelatedProductsWithDistance] = useState([]);

    const getDistanceFromLatLonInKm = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const deg2rad = (deg) => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    useEffect(() => {
        if (product) {
            setMainImage(getImageSrc(product.image));
            console.log('🔍 AutomotiveProductDetail - Rendering product:', product.name);
            console.log('🛡️ Warranty:', product.warranty);
            console.log('📅 Expiry:', product.expiryDate);
        }
        window.scrollTo(0, 0);
    }, [product]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;

                    if (product && product.lat && product.lon) {
                        const distance = getDistanceFromLatLonInKm(userLat, userLon, product.lat, product.lon);
                        setProductWithDistance({ ...product, distance: `${distance.toFixed(1)} km away` });
                    } else {
                        setProductWithDistance({ ...product, distance: 'Distance N/A' });
                    }

                    const related = allAutomotiveProducts
                        .filter(p => p.id !== product.id)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4);
                    const relatedWithDistance = related.map(p => {
                        if (p.lat && p.lon) {
                            const distance = getDistanceFromLatLonInKm(userLat, userLon, p.lat, p.lon);
                            return { ...p, distance: `${distance.toFixed(1)} km away` };
                        }
                        return { ...p, distance: 'Distance N/A' };
                    });
                    setRelatedProductsWithDistance(relatedWithDistance);
                },
                (error) => {
                    console.warn(`Geolocation error: ${error.message}.`);
                    setProductWithDistance({ ...product, distance: 'Distance N/A' });
                    const related = allAutomotiveProducts
                        .filter(p => p.id !== product.id)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4);
                    setRelatedProductsWithDistance(related.map(p => ({ ...p, distance: 'Distance N/A' })));
                }
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
            setProductWithDistance({ ...product, distance: 'Distance N/A' });
            const related = allAutomotiveProducts
                .filter(p => p.id !== product.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            setRelatedProductsWithDistance(related.map(p => ({ ...p, distance: 'Distance N/A' })));
        }
    }, [product, getDistanceFromLatLonInKm]);

    const isInCart = useMemo(() => cartItems.some(item => item.id === product?.id), [cartItems, product]);
    const isInWishlist = useMemo(() => wishlistItems.some(item => (item._id || item.id) === (product._id || product.id)), [wishlistItems, product]);

    const thumbnailImages = useMemo(() => {
        if (!product) return [];
        const images = [getImageSrc(product.image)];
        if (product.otherImages && product.otherImages.length > 0) {
            return images.concat(product.otherImages.map(img => getImageSrc(img)));
        }
        return images;
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#automotive" onClick={(e) => { e.preventDefault(); navigateTo('automotive'); }} className="back-link">&larr; Back to Automotive</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#automotive" onClick={(e) => { e.preventDefault(); navigateTo('automotive-products'); }} className="back-link">&larr; Back to Automotive</a>

            <div className="product-detail-container">
                <div className="product-images">
                    <div className="main-image">
                        <img src={mainImage} alt={product.name} onError={(e) => console.log('Image failed to load:', mainImage)} />
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
                    <h1>{productWithDistance.name}</h1>
                    <p className="product-vendor">by {productWithDistance.vendor}</p>
                    <div className="product-price-section">
                        {productWithDistance.discountedPrice ? (
                            <>
                                {/* Original Price - Struck Through */}
                                <div className="product-original-price">₹{productWithDistance.originalPrice}</div>

                                {/* Discounted Price - Prominent */}
                                <div className="product-price discounted">₹{productWithDistance.discountedPrice}</div>

                                {/* Offer Badge */}
                                <div className="product-offer-badge">
                                    {productWithDistance.discountPercentage ? `${productWithDistance.discountPercentage}% OFF` : `₹${productWithDistance.discountAmount} OFF`}
                                </div>

                                {/* You Save Text */}
                                <div className="product-save-text">
                                    You save ₹{productWithDistance.discountAmount}
                                </div>
                            </>
                        ) : (
                            <div className="product-price">₹{productWithDistance.price}</div>
                        )}
                    </div>
                    
                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{productWithDistance.description}</p>
                    </div>

                    {productWithDistance.warranty && (
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
                            <span style={{ marginLeft: '8px', color: '#555' }}>{productWithDistance.warranty}</span>
                        </div>
                    )}

                    {productWithDistance.expiryDate && (
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
                            <span style={{ marginLeft: '8px', color: '#555' }}>{formatDate(productWithDistance.expiryDate)}</span>
                        </div>
                    )}

                    <div className="product-distance">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{productWithDistance.distance || 'Calculating...'}</span>
                    </div>
                    
                    <div className="product-specs">
                        <h3>Details</h3>
                        <div className="spec-grid">
                            <div className="spec-item">
                                <strong>Brand</strong>
                                <span>{productWithDistance.brand}</span>
                            </div>
                            <div className="spec-item">
                                <strong>Compatibility</strong>
                                <span>{productWithDistance.compatibility}</span>
                            </div>
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
                    {relatedProductsWithDistance.map(related => (
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
                                    ₹{related.price}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AutomotiveProductDetail;