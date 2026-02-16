import React, { useState, useEffect } from 'react';
import '../styles/HomeDecorProductDetail.css';

const HomeDecorProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('https://via.placeholder.com/400x400?text=Loading...');
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const allProducts = {
        "1001": { id: 1001, name: "Wall Art Canvas", price: 2999, vendor: "Decor Trends", image: "Wall Art Canvas.jpg", type: "Wall Decor", material: "Canvas", dimensions: "24x36 in", color: "Multicolor", otherImages: ["Wall Art Canvas1.jpg", "Wall Art Canvas2.jpg", "Wall Art Canvas3.jpg"], lat: 17.4486, lon: 78.3908 },
        "1002": { id: 1002, name: "LED Table Lamp", price: 1499, vendor: "LightHouse", image: "LED Table Lamp.jpg", type: "Lighting", material: "Metal, Plastic", dimensions: "15 in height", color: "Black", otherImages: ["LED Table Lamp1.jpg", "LED Table Lamp2.jpg", "LED Table Lamp3.jpg"], lat: 17.4512, lon: 78.3855 },
        "1003": { id: 1003, name: "Decorative Cushions", price: 999, vendor: "HomeStyle", image: "Decorative Cushions.jpg", type: "Cushion", material: "Cotton", dimensions: "16x16 in", color: "Assorted", otherImages: ["Decorative Cushions1.jpg", "Decorative Cushions2.jpg", "Decorative Cushions3.jpg"], lat: 17.4421, lon: 78.3882 },
        "1004": { id: 1004, name: "Cordless Drill", price: 3999, vendor: "ToolTech", image: "Cordless Drill.jpg", type: "Tool", material: "Plastic, Metal", dimensions: "N/A", color: "Yellow/Black", otherImages: ["Cordless Drill1.jpg", "Cordless Drill2.jpg", "Cordless Drill3.jpg"], lat: 17.4550, lon: 78.3920 },
        "1005": { id: 1005, name: "Wall Paint Set", price: 2499, vendor: "ColorSplash", image: "Wall Paint Set.jpg", type: "Paint", material: "Emulsion", dimensions: "1 Gallon", color: "Assorted", otherImages: ["Wall Paint Set1.jpg", "Wall Paint Set2.jpg", "Wall Paint Set3.jpg"], lat: 17.4399, lon: 78.4421 },
        "1006": { id: 1006, name: "Photo Frame Set", price: 1299, vendor: "Decor Trends", image: "Photo Frame Set.jpg", type: "Frame", material: "Wood", dimensions: "Various", color: "Black", otherImages: ["Photo Frame Set1.jpg", "Photo Frame Set2.jpg", "Photo Frame Set3.jpg"], lat: 17.4455, lon: 78.3800 },
        "1007": { id: 1007, name: "Ceiling Light Fixture", price: 4999, vendor: "LightHouse", image: "Ceiling Light Fixture.jpg", type: "Lighting", material: "Glass, Metal", dimensions: "18 in diameter", color: "Bronze", otherImages: ["Ceiling Light Fixture1.jpg", "Ceiling Light Fixture2.jpg", "Ceiling Light Fixture3.jpg"], lat: 17.4480, lon: 78.3890 },
        "1008": { id: 1008, name: "Decorative Vase", price: 799, vendor: "HomeStyle", image: "Decorative Vase.jpg", type: "Vase", material: "Ceramic", dimensions: "12 in height", color: "White", otherImages: ["Decorative Vase1.jpg", "Decorative Vase2.jpg", "Decorative Vase3.jpg"], lat: 17.4520, lon: 78.3870 },
        "1009": { id: 1009, name: "Tool Kit", price: 1999, vendor: "ToolTech", image: "Tool Kit.jpg", type: "Tool", material: "Steel, Plastic", dimensions: "100-piece set", color: "Red/Black", otherImages: ["Tool Kit1.jpg", "Tool Kit2.jpg", "Tool Kit3.jpg"], lat: 17.4400, lon: 78.3850 },
        "1010": { id: 1010, name: "Area Rug", price: 3499, vendor: "Decor Trends", image: "Area Rug.jpg", type: "Rug", material: "Wool", dimensions: "5x7 ft", color: "Grey", otherImages: ["Area Rug1.jpg", "Area Rug2.jpg", "Area Rug3.jpg"], lat: 17.4490, lon: 78.3950 },
        "1011": { id: 1011, name: "Curtain Set", price: 1799, vendor: "HomeStyle", image: "Curtain Set.jpg", type: "Curtain", material: "Polyester", dimensions: "84 in length", color: "Beige", otherImages: ["Curtain Set1.jpg", "Curtain Set2.jpg", "Curtain Set3.jpg"], lat: 17.4550, lon: 78.3920 },
        "1012": { id: 1012, name: "Paint Roller Kit", price: 599, vendor: "ColorSplash", image: "Paint Roller Kit.jpg", type: "Tool", material: "Plastic, Foam", dimensions: "9-piece set", color: "Blue", otherImages: ["Paint Roller Kit1.jpg", "Paint Roller Kit2.jpg", "Paint Roller Kit3.jpg"], lat: 17.4430, lon: 78.3860 },
        "1013": { id: 1013, name: "Wall Clock", price: 1299, vendor: "Decor Trends", image: "Wall Clock.jpg", type: "Clock", material: "Wood, Metal", dimensions: "24 in diameter", color: "Brown", otherImages: ["Wall Clock1.jpg", "Wall Clock2.jpg", "Wall Clock3.jpg"], lat: 17.4500, lon: 78.3840 },
        "1014": { id: 1014, name: "Pendant Light", price: 2499, vendor: "LightHouse", image: "Pendant Light.jpg", type: "Lighting", material: "Metal", dimensions: "12 in diameter", color: "Black", otherImages: ["Pendant Light1.jpg", "Pendant Light2.jpg", "Pendant Light3.jpg"], lat: 17.4470, lon: 78.3910 },
        "1015": { id: 1015, name: "DIY Shelving Kit", price: 1999, vendor: "ToolTech", image: "DIY Shelving Kit.jpg", type: "Shelf", material: "Wood", dimensions: "24x10 in", color: "Natural", otherImages: ["DIY Shelving Kit1.jpg", "DIY Shelving Kit2.jpg", "DIY Shelving Kit3.jpg"], lat: 17.4400, lon: 78.3850 }
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
        const params = new URLSearchParams(window.location.search);
        const pid = params.get('id');
        const currentProduct = pid ? allProducts[pid] : null;

        if (currentProduct) {
            setProduct(currentProduct);
            setMainImage('IMAGES/' + currentProduct.image);

            const related = Object.values(allProducts)
                .filter(p => p.id !== currentProduct.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            setRelatedProducts(related);

            console.log('🔍 HomeDecorProductDetail - Rendering product:', currentProduct.name);
            console.log('📦 Full product object:', currentProduct);
            console.log('🛡️ Warranty:', currentProduct.warranty);
            console.log('📅 Expiry:', currentProduct.expiryDate);
        }

        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setCart(savedCart);
        setWishlist(savedWishlist);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            }, () => {});
        }
    }, []);

    const deg2rad = deg => deg * (Math.PI / 180);
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const calculateDistance = (productLat, productLon) => {
        if (!userLocation) return '...';
        const d = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, productLat, productLon);
        return d.toFixed(1) + ' km away';
    };

    const addToCart = () => {
        if (!product) return;
        const newCart = JSON.parse(localStorage.getItem('cart')) || [];
        const found = newCart.find(i => i.id === product.id);
        if (found) found.quantity += 1; else newCart.push({ ...product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(newCart));
        setCart(newCart);
        alert(product.name + ' has been added to your cart.');
    };

    const toggleWishlist = () => {
        if (!product) return;
        const current = JSON.parse(localStorage.getItem('wishlist')) || [];
        const exists = current.some(i => i.id === product.id);
        let updated;
        if (exists) {
            updated = current.filter(i => i.id !== product.id);
            alert(product.name + ' removed from wishlist.');
        } else {
            updated = [...current, product];
            alert(product.name + ' added to wishlist.');
        }
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setWishlist(updated);
    };

    if (!product) return <div className="container"><h1>Product not found</h1></div>;

    const isInCart = cart.some(i => i.id === product.id);
    const isInWishlist = wishlist.some(i => i.id === product.id);

    return (
        <>
            <header className="product-header">
                <div className="header-content">
                    <div className="logo" onClick={() => window.location.href = '/'}>
                        <i className="fas fa-shopping-bag" /> ShopNest
                    </div>
                    <div className="header-actions">
                        <a href="#wishlist"><i className="fas fa-heart" /> Wishlist <span className="wishlist-count">{wishlist.length}</span></a>
                        <a href="#cart"><i className="fas fa-shopping-cart" /> Cart <span className="cart-count">{cart.reduce((s, i) => s + (i.quantity || 0), 0)}</span></a>
                    </div>
                </div>
            </header>

            <div className="container">
                <a href="/" className="back-link">← Back to Home Decor</a>

                <div className="product-detail-container">
                    <div className="product-images">
                        <div className="main-image">
                            <img src={mainImage} alt={product.name} onError={e => e.target.src = 'https://via.placeholder.com/400x400?text=Image+not+found'} />
                        </div>
                        <div className="thumbnail-track">
                            {[product.image, ...(product.otherImages || [])].map((img, idx) => {
                                const src = 'IMAGES/' + img;
                                return (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt={product.name + ' - ' + (idx + 1)}
                                        className={mainImage === src ? 'thumbnail active' : 'thumbnail'}
                                        onClick={() => setMainImage(src)}
                                        onError={e => e.target.src = 'https://via.placeholder.com/80x80?text=No+image'}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="product-details">
                        <h1>{product.name}</h1>
                        <p className="product-vendor">by {product.vendor}</p>
                        <div className="product-price">₹{product.price.toLocaleString()}</div>
                        
                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description || 'High-quality item that you will surely love. Durable, stylish, and perfect for any occasion.'}</p>
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

                        <div className="product-distance"><i className="fas fa-map-marker-alt" /> <span>{calculateDistance(product.lat, product.lon)}</span></div>

                        <div className="product-specs">
                            <h3>Specifications</h3>
                            <div className="spec-grid">
                                <div className="spec-item"><strong>Type</strong><span>{product.type || 'N/A'}</span></div>
                                <div className="spec-item"><strong>Material</strong><span>{product.material || 'N/A'}</span></div>
                                <div className="spec-item"><strong>Dimensions</strong><span>{product.dimensions || 'N/A'}</span></div>
                                <div className="spec-item"><strong>Color</strong><span>{product.color || 'N/A'}</span></div>
                            </div>
                        </div>

                        <div className="product-actions">
                            {isInCart ? (
                                <button className="btn go-to-cart" onClick={() => window.location.href = '#cart'}>Go to Cart</button>
                            ) : (
                                <button className="btn" onClick={addToCart}>Add to Cart</button>
                            )}
                            <button className={isInWishlist ? 'wishlist-heart-btn active' : 'wishlist-heart-btn'} onClick={toggleWishlist} title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                                <i className={isInWishlist ? 'fas fa-heart' : 'far fa-heart'} />
                            </button>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="related-products-section">
                        <h2>Related Products</h2>
                        <div className="related-product-grid">
                            {relatedProducts.map(r => (
                                <a key={r.id} className="related-product-card" href={window.location.pathname + '?id=' + r.id}>
                                    <img src={'IMAGES/' + r.image} alt={r.name} onError={e => e.target.src = 'https://via.placeholder.com/200x200?text=No+image'} />
                                    <div className="related-product-info">
                                        <div className="product-distance small"><i className="fas fa-map-marker-alt" /> <span>{calculateDistance(r.lat, r.lon)}</span></div>
                                        <h4>{r.name}</h4>
                                        <p className="small">{r.vendor}</p>
                                        <div className="product-price">₹{r.price.toLocaleString()}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default HomeDecorProductDetail;