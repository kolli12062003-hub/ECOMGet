import React, { useState, useEffect, useMemo, useCallback } from 'react';

export const allMedicineProducts = [
    { id: 1401, name: "Vitamin D3 2000IU", price: 49, vendor: "MediCare Pharmacy", image: "Vitamin D3 2000IU1.jpeg", type: "Tablet", description: "Vitamin D3 2000IU is essential for bone health, immune function, and calcium absorption. Benefits include stronger bones and reduced risk of deficiency. Precautions: Consult a doctor if pregnant, nursing, or on medication.", otherImages: ["Vitamin D3 2000IU3.jpeg", "Vitamin D3 2000IU1.jpeg", "Vitamin D3 2000IU3.jpeg"], lat: 17.4486, lon: 78.3908, category: "Medicines" },
    { id: 1402, name: "Pain Relief", price: 129, vendor: "HealthPlus", image: "pain relif.jpg", type: "Capsule", description: "Pain Relief capsules provide fast relief from headaches, muscle pain, and inflammation. Benefits: Effective pain management without drowsiness. Precautions: Do not exceed recommended dosage; avoid if allergic to NSAIDs.", otherImages: ["pain relif1.jpg", "pain relif2.jpg", "pain relif3.jpg"], lat: 17.4512, lon: 78.3855, category: "Medicines" },
    { id: 1403, name: "Vitamin C 1000mg", price: 299, vendor: "NutriWell", image: "Vitamin-C-1000-mg-20-tablets-Orange_o.jpg", type: "Supplement", description: "Vitamin C 1000mg supplement boosts immunity, collagen production, and antioxidant protection. Benefits: Enhanced immune response and skin health. Precautions: High doses may cause stomach upset; consult a doctor if on blood thinners.", otherImages: ["Vitamin-C-1000-mg-20-tablets-Orange_o1.jpg", "Vitamin-C-1000-mg-20-tablets-Orange_o2.jpg", "Vitamin-C-1000-mg-20-tablets-Orange_o3.jpg"], lat: 17.4421, lon: 78.3882, category: "Medicines" },
    { id: 1404, name: "Blood Pressure Monitor", price: 1499, vendor: "MediTech", image: "BPMonitor.jpg", type: "Medical Device", description: "Blood Pressure Monitor accurately measures systolic and diastolic pressure at home. Benefits: Helps monitor hypertension and prevent complications. Precautions: Ensure proper cuff size; consult a healthcare provider for interpretation.", otherImages: ["BPMonitor1.jpg", "BPMonitor2.jpg", "BPMonitor3.jpg"], lat: 17.4550, lon: 78.3920, category: "Medicines" },
    { id: 1405, name: "Atorvastatin 10mg", price: 189, vendor: "PharmaCare", image: "Atorvastatin.jpg", type: "Tablet", description: "Atorvastatin 10mg lowers cholesterol levels and reduces the risk of cardiovascular disease. Benefits: Reduces LDL cholesterol and triglyceride levels. Precautions: May cause muscle pain; monitor liver function; avoid grapefruit juice.", otherImages: ["Atorvastatin1.jpg", "Atorvastatin2.jpg", "Atorvastatin3.jpg"], lat: 17.4399, lon: 78.4421, category: "Medicines" },
    { id: 1406, name: "Omeprazole 20mg", price: 159, vendor: "MediExpress", image: "Omeprazole.jpg", type: "Capsule", description: "Omeprazole 20mg reduces stomach acid production for acid reflux and ulcers. Benefits: Relieves heartburn and promotes healing. Precautions: Long-term use may affect vitamin B12 absorption; consult a doctor if symptoms persist.", otherImages: ["Omeprazole1.jpg", "Omeprazole2.jpg", "Omeprazole3.jpg"], lat: 17.4455, lon: 78.3800, category: "Medicines" },
    { id: 1407, name: "Diabetes Test Strips", price: 799, vendor: "DiabeCare", image: "TestStrips.jpg", type: "Medical Supply", description: "Diabetes Test Strips measure blood glucose levels for diabetes management. Benefits: Enables self-monitoring and better control. Precautions: Use with a compatible glucometer; store properly to maintain accuracy.", otherImages: ["TestStrips1.jpg", "TestStrips2.jpg", "TestStrips3.jpg"], lat: 17.4480, lon: 78.3890, category: "Medicines" },
    { id: 1408, name: "Metformin 500mg", price: 99, vendor: "HealthFirst", image: "Metformin.jpg", type: "Tablet", description: "Metformin 500mg helps control blood sugar in type 2 diabetes. Benefits: Improves insulin sensitivity and reduces glucose production. Precautions: May cause digestive side effects; monitor kidney function.", otherImages: ["Metformin1.jpg", "Metformin2.jpg", "Metformin3.jpg"], lat: 17.4520, lon: 78.3870, category: "Medicines" },
    { id: 1409, name: "First Aid Kit", price: 499, vendor: "SafeLife", image: "FirstAidKit.jpg", type: "Medical Kit", description: "First Aid Kit contains essential supplies for minor injuries and emergencies. Benefits: Quick response for cuts, burns, and sprains. Precautions: Check expiration dates; restock used items regularly.", otherImages: ["FirstAidKit1.jpg", "FirstAidKit2.jpg", "FirstAidKit3.jpg"], lat: 17.4400, lon: 78.3850, category: "Medicines" },
    { id: 1410, name: "Ibuprofen 400mg", price: 79, vendor: "QuickMeds", image: "ibprofen 400mg.jpg", type: "Tablet", description: "Ibuprofen 400mg relieves pain, fever, and inflammation. Benefits: Effective for arthritis and menstrual cramps. Precautions: Avoid if allergic to NSAIDs; long-term use may increase heart risks.", otherImages: ["ibprofen 400mg1.jpg", "ibprofen 400mg2.jpg", "ibprofen 400mg3.jpg"], lat: 17.4490, lon: 78.3950, category: "Medicines" },
    { id: 1411, name: "Vitamin D3 1000IU", price: 349, vendor: "WellnessPlus", image: "VitaminD3.jpg", type: "Supplement", description: "Vitamin D3 1000IU supports bone density and immune health. Benefits: Prevents rickets and osteomalacia. Precautions: Overdose can cause hypercalcemia; consult a doctor for dosage.", otherImages: ["VitaminD31.jpg", "VitaminD32.jpg", "VitaminD33.jpg"], lat: 17.4550, lon: 78.3920, category: "Medicines" },
    { id: 1412, name: "Thermometer Digital", price: 249, vendor: "HealthGadgets", image: "Thermometer.jpg", type: "Medical Device", description: "Digital Thermometer provides accurate body temperature readings. Benefits: Fast and hygienic measurement. Precautions: Clean after use; ensure battery is functional.", otherImages: ["Thermometer1.jpg", "Thermometer2.jpg", "Thermometer3.jpg"], lat: 17.4430, lon: 78.3860, category: "Medicines" },
    { id: 1413, name: "Cetirizine 10mg", price: 59, vendor: "AllergyCare", image: "Cetirizine.jpg", type: "Tablet", description: "Cetirizine 10mg reduces allergy symptoms like runny nose and itching. Benefits: Non-drowsy antihistamine for hay fever. Precautions: May cause dry mouth; avoid alcohol.", otherImages: ["Cetirizine1.jpg", "Cetirizine2.jpg", "Cetirizine3.jpg"], lat: 17.4500, lon: 78.3840, category: "Medicines" },
    { id: 1414, name: "Nebulizer Machine", price: 1899, vendor: "BreathEasy", image: "Nebulizer.jpg", type: "Medical Equipment", description: "Nebulizer Machine converts liquid medicine into a mist for respiratory treatment. Benefits: Effective for asthma and COPD. Precautions: Clean regularly; use only prescribed medications.", otherImages: ["Nebulizer1.jpg", "Nebulizer2.jpg", "Nebulizer3.jpg"], lat: 17.4470, lon: 78.3910, category: "Medicines" },
    { id: 1415, name: "Aspirin 75mg", price: 69, vendor: "HeartCare", image: "Aspirin.jpg", type: "Tablet", description: "Aspirin 75mg prevents blood clots and reduces the risk of heart attack. Benefits: Anti-platelet action for cardiovascular disease. Precautions: May cause stomach bleeding; not for everyone; consult a doctor.", otherImages: ["Aspirin1.jpg", "Aspirin2.jpg", "Aspirin3.jpg"], lat: 17.4400, lon: 78.3850, category: "Medicines" }
];

const MedicineProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
            console.log('🔍 MedicineProductDetail - Rendering product:', product.name);
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

                    const related = allMedicineProducts
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
                    const related = allMedicineProducts
                        .filter(p => p.id !== product.id)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4);
                    setRelatedProductsWithDistance(related.map(p => ({ ...p, distance: 'Distance N/A' })));
                }
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
            setProductWithDistance({ ...product, distance: 'Distance N/A' });
            const related = allMedicineProducts
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
                <h1>Product not found</h1>
                <a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services-products'); }} className="back-link">&larr; Back to Medicines</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#medicines" onClick={(e) => { e.preventDefault(); navigateTo('medicines-products'); }} className="back-link">&larr; Back to Medicines</a>
            
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
                    <div className="product-price-section">
                        {product.discountedPrice ? (
                            <>
                                {/* Original Price - Struck Through */}
                                <div className="product-original-price">₹{product.originalPrice}</div>

                                {/* Discounted Price - Prominent */}
                                <div className="product-price discounted">₹{product.discountedPrice}</div>

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
                            <div className="product-price">₹{product.price}</div>
                        )}
                    </div>
                    
                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
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
                                <div className="product-distance" style={{fontSize: '14px', color: 'var(--gray)', marginTop: '5px'}}>
                                    <i className="fas fa-map-marker-alt"></i> <span>{related.distance || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MedicineProductDetail;