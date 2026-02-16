import React, { useState, useEffect, useMemo, useCallback } from 'react';

export const allServicesProducts = [
    { id: 1801, name: "Smartphone Screen Repair", price: 2999, vendor: "TechFix", image: "smartphonerepair.jpg", timing: "Mon-Sat, 10 AM - 7 PM", otherImages: ["smartphonerepair1.jpg", "smartphonerepair2.jpg", "smartphonerepair3.jpg"], lat: 17.4486, lon: 78.3908, category: "Services" },
    { id: 1802, name: "Laptop Repair", price: 4999, vendor: "GadgetCare", image: "laptop repair.jpg", timing: "Mon-Fri, 9 AM - 6 PM", otherImages: ["laptop repair1.jpg", "laptop repair2.jpg", "laptop repair3.jpg"], lat: 17.4512, lon: 78.3855, category: "Services" },
    { id: 1803, name: "Tablet Repair", price: 3999, vendor: "DeviceMasters", image: "tablet repair.jpg", timing: "Mon-Sat, 11 AM - 8 PM", otherImages: ["tablet repair1.jpg", "tablet repair2.jpg", "tablet repair3.jpg"], lat: 17.4421, lon: 78.3882, category: "Services" },
    { id: 1804, name: "Smartwatch Repair", price: 2499, vendor: "RepairPro", image: "smartwatch repair.jpg", timing: "Tue-Sun, 10 AM - 6 PM", otherImages: ["smartwatch repair1.jpg", "smartwatch repair2.jpg", "smartwatch repair3.jpg"], lat: 17.4550, lon: 78.3920, category: "Services" },
    { id: 1805, name: "AC Repair", price: 1999, vendor: "CoolFix", image: "ac repair.jpg", timing: "Mon-Sun, 9 AM - 9 PM", otherImages: ["ac repair1.jpg", "ac repair2.jpg", "ac repair3.jpg"], lat: 17.4399, lon: 78.4421, category: "Services" },
    { id: 1806, name: "Washing Machine Repair", price: 3499, vendor: "WashTech", image: "washing machine repair.jpg", timing: "Mon-Sat, 9 AM - 7 PM", otherImages: ["washing machine repair1.jpg", "washing machine repair2.jpg", "washing machine repair3.jpg"], lat: 17.4455, lon: 78.3800, category: "Services" },
    { id: 1807, name: "Refrigerator Repair", price: 2999, vendor: "FridgeMasters", image: "refrigerator repair.jpg", timing: "Mon-Sun, 8 AM - 8 PM", otherImages: ["refrigerator repair1.jpg", "refrigerator repair2.jpg", "refrigerator repair3.jpg"], lat: 17.4480, lon: 78.3890, category: "Services" },
    { id: 1808, name: "Microwave Repair", price: 1499, vendor: "OvenFix", image: "microwave repair.jpg", timing: "Mon-Fri, 10 AM - 5 PM", otherImages: ["microwave repair1.jpg", "microwave repair2.jpg", "microwave repair3.jpg"], lat: 17.4520, lon: 78.3870, category: "Services" },
    { id: 1809, name: "Home Cleaning", price: 1999, vendor: "CleanMasters", image: "home cleaning.jpg", timing: "Mon-Sun, 8 AM - 6 PM", otherImages: ["home cleaning1.jpg", "home cleaning2.jpg", "home cleaning3.jpg"], lat: 17.4400, lon: 78.3850, category: "Services" },
    { id: 1810, name: "Office Cleaning", price: 3499, vendor: "OfficeShine", image: "office cleaning.jpg", timing: "Mon-Fri, 6 PM - 10 PM", otherImages: ["office cleaning1.jpg", "office cleaning2.jpg", "office cleaning3.jpg"], lat: 17.4490, lon: 78.3950, category: "Services" },
    { id: 1811, name: "Carpet Cleaning", price: 2499, vendor: "CarpetPro", image: "carpet cleaning.jpg", timing: "Mon-Sat, 9 AM - 5 PM", otherImages: ["carpet cleaning1.jpg", "carpet cleaning2.jpg", "carpet cleaning3.jpg"], lat: 17.4550, lon: 78.3920, category: "Services" },
    { id: 1812, name: "Window Cleaning", price: 1799, vendor: "WindowGlow", image: "window cleaning.jpg", timing: "Mon-Fri, 9 AM - 4 PM", otherImages: ["window cleaning1.jpg", "window cleaning2.jpg", "window cleaning3.jpeg"], lat: 17.4430, lon: 78.3860, category: "Services" },
    { id: 1813, name: "Deep Cleaning", price: 2999, vendor: "DeepCleaners", image: "deep cleaning.jpg", timing: "Mon-Sun, 9 AM - 7 PM", otherImages: ["deep cleaning1.jpg", "deep cleaning2.jpg", "deep cleaning3.jpg"], lat: 17.4500, lon: 78.3840, category: "Services" },
    { id: 1814, name: "Bathroom Cleaning", price: 1499, vendor: "BathSpark", image: "bathroom cleaning.jpg", timing: "Mon-Sat, 10 AM - 6 PM", otherImages: ["bathroom cleaning1.jpg", "bathroom cleaning2.jpg", "bathroom cleaning3.jpg"], lat: 17.4470, lon: 78.3910, category: "Services" },
    { id: 1815, name: "Kitchen Cleaning", price: 1999, vendor: "KitchenBright", image: "kitchen cleaning.jpeg", timing: "Mon-Sat, 10 AM - 6 PM", otherImages: ["kitchen cleaning1.jpeg", "kitchen cleaning2.jpeg", "kitchen cleaning3.jpeg"], lat: 17.4400, lon: 78.3850, category: "Services" },
    { id: 1816, name: "Sofa Cleaning", price: 2499, vendor: "SofaFresh", image: "sofa cleaning.jpeg", timing: "Mon-Sun, 9 AM - 5 PM", otherImages: ["sofa cleaning1.jpeg", "sofa cleaning2.jpeg", "sofa cleaning3.jpeg"], lat: 17.4486, lon: 78.3908, category: "Services" },
    { id: 1817, name: "Salon at Home", price: 1999, vendor: "BeautyHome", image: "salon at home.jpeg", timing: "Mon-Sun, 10 AM - 8 PM", otherImages: ["salon at home2.jpeg", "salon at home.jpeg", "salon at home2.jpeg"], lat: 17.4512, lon: 78.3855, category: "Services" },
    { id: 1818, name: "Spa at Home", price: 2999, vendor: "SpaRelax", image: "spa at home.jpeg", timing: "Mon-Sun, 11 AM - 9 PM", otherImages: ["spa at home1.jpeg", "spa at home2.jpeg", "spa at home3.jpeg"], lat: 17.4421, lon: 78.3882, category: "Services" },
    { id: 1819, name: "Massage Therapy", price: 2499, vendor: "MassagePro", image: "massage therapy.jpeg", timing: "Mon-Sun, 10 AM - 10 PM", otherImages: ["massage therapy1.jpeg", "massage therapy2.jpeg", "massage therapy3.jpeg"], lat: 17.4550, lon: 78.3920, category: "Services" },
    { id: 1820, name: "Haircut for Men", price: 999, vendor: "HairStyle", image: "haircut men.jpg", timing: "Tue-Sun, 10 AM - 9 PM", otherImages: ["haircut men1.jpeg", "haircut men2.jpeg", "haircut men3.jpeg"], lat: 17.4399, lon: 78.4421, category: "Services" },
    { id: 1821, name: "Manicure", price: 1499, vendor: "NailArt", image: "manicure.jpeg", timing: "Mon-Sat, 11 AM - 7 PM", otherImages: ["manicure1.jpeg", "manicure2.jpeg", "manicure3.jpeg"], lat: 17.4455, lon: 78.3800, category: "Services" },
    { id: 1822, name: "Pedicure", price: 1499, vendor: "FootCare", image: "pedicure.jpeg", timing: "Mon-Sat, 11 AM - 7 PM", otherImages: ["pedicure1.jpeg", "pedicure2.jpeg", "pedicure3.jpeg"], lat: 17.4480, lon: 78.3890, category: "Services" },
    { id: 1823, name: "Facial", price: 1999, vendor: "FaceGlow", image: "facial.jpeg", timing: "Mon-Sun, 10 AM - 8 PM", otherImages: ["facial1.jpeg", "facial2.jpeg", "facial3.jpeg"], lat: 17.4520, lon: 78.3870, category: "Services" },
    { id: 1824, name: "Waxing", price: 999, vendor: "WaxSmooth", image: "Waxing Service.jpg", timing: "Mon-Sat, 10 AM - 7 PM", otherImages: ["Waxing Service1.jpeg", "Waxing Service2.jpeg", "Waxing Service3.jpeg"], lat: 17.4400, lon: 78.3850, category: "Services" }
];

const ServiceProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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

    useEffect(() => {
        if (product) {
            setMainImage(getImageSrc(product.image));
            console.log('🔍 ServiceProductDetail - Rendering product:', product.name);
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

                    const related = allServicesProducts
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
                    const related = allServicesProducts
                        .filter(p => p.id !== product.id)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4);
                    setRelatedProductsWithDistance(related.map(p => ({ ...p, distance: 'Distance N/A' })));
                }
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
            setProductWithDistance({ ...product, distance: 'Distance N/A' });
            const related = allServicesProducts
                .filter(p => p.id !== product.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            setRelatedProductsWithDistance(related.map(p => ({ ...p, distance: 'Distance N/A' })));
        }
    }, [product, getDistanceFromLatLonInKm]);

    const isInCart = useMemo(() => cartItems.some(item => (item._id || item.id) === (product._id || product.id)), [cartItems, product]);
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
                <h1>Service not found</h1>
                <a href="#services-products" onClick={(e) => { e.preventDefault(); navigateTo('services-products'); }} className="back-link">&larr; Back to Services Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#services-products" onClick={(e) => { e.preventDefault(); navigateTo('services-products'); }} className="back-link">&larr; Back to Services Products</a>

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
                    <h1>{product.name}</h1>
                    <p className="product-vendor">by {product.vendor}</p>
                    <div className="product-price">₹{product.price}</div>
                    
                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description || 'High-quality service provided by a trusted professional to meet your needs.'}</p>
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
                        <span>{productWithDistance.distance || 'Calculating...'}</span>
                    </div>
                    
                    <div className="timing-info">
                        <h3>Available Timings</h3>
                        <p>{product.timing || 'Timings not available'}</p>
                    </div>
                    
                    <div className="product-actions">
                        {isInCart ? (
                             <button onClick={() => navigateTo('cart')} className="btn go-to-cart">Go to Cart</button>
                        ) : (
                            <button className="btn" onClick={() => onAddToCart(product)}>Book Now</button>
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

export default ServiceProductDetail;