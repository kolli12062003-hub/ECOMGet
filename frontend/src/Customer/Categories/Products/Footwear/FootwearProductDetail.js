import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './FootwearProductDetail.css';

export const allFootwearProducts = [
    { id: 701, name: "High Heels", price: 2499, vendor: "Elegant Steps", category: "Women's Footwear", image: "High Heels.jpg", lat: 17.4486, lon: 78.3908, stock: 12, description: "Elegant high heels perfect for formal occasions, made with faux leather for comfort and style." },
    { id: 702, name: "Ballet Flats", price: 1999, vendor: "Graceful Steps", category: "Women's Footwear", image: "Ballet Flats.jpg", lat: 17.4512, lon: 78.3855, stock: 15, description: "Comfortable ballet flats in nude color, ideal for everyday wear." },
    { id: 703, name: "Wedge Sandals", price: 2699, vendor: "Fashion Feet", category: "Women's Footwear", image: "Wedge Sandals.jpg", lat: 17.4421, lon: 78.3882, stock: 10, description: "Stylish wedge sandals made with cork for a trendy look." },
    { id: 704, name: "Dress Sandals", price: 2499, vendor: "Chic Soles", category: "Women's Footwear", image: "Dress Sandals.jpg", lat: 17.4550, lon: 78.3920, stock: 8, description: "Elegant dress sandals in silver synthetic material." },
    { id: 705, name: "Ankle Boots", price: 3499, vendor: "Trendy Treads", category: "Women's Footwear", image: "Ankle Boots.jpg", lat: 17.4399, lon: 78.4421, stock: 6, description: "Fashionable ankle boots in faux suede for versatile styling." },
    { id: 706, name: "Canvas Sneakers", price: 1799, vendor: "Cool Kicks", category: "Women's Footwear", image: "Canvas Sneakers.jpg", lat: 17.4455, lon: 78.3800, stock: 20, description: "Casual canvas sneakers in white, machine washable for easy care." },
    { id: 707, name: "Flip Flops", price: 799, vendor: "Beach Walk", category: "Women's Footwear", image: "Flip Flops.jpg", lat: 17.4480, lon: 78.3890, stock: 25, description: "Comfortable rubber flip flops in blue for beach or casual wear." },
    { id: 708, name: "Stilettos", price: 2999, vendor: "Elegant Steps", category: "Women's Footwear", image: "Stilettos.jpg", lat: 17.4520, lon: 78.3870, stock: 9, description: "Classic red patent leather stilettos for special occasions." },
    { id: 709, name: "Leather Sneakers", price: 2999, vendor: "Step Style", category: "Men's Footwear", image: "Leather Sneakers.jpg", lat: 17.4400, lon: 78.3850, stock: 14, description: "Premium white leather sneakers for men, wipe clean for maintenance." },
    { id: 710, name: "Running Shoes", price: 3499, vendor: "Speed Stride", category: "Men's Footwear", image: "Running Shoes.jpg", lat: 17.4490, lon: 78.3950, stock: 11, description: "High-performance mesh running shoes in black/red for active lifestyles." },
    { id: 711, name: "Casual Loafers", price: 1999, vendor: "Comfort Walk", category: "Men's Footwear", image: "Casual Loafers.jpg", lat: 17.4550, lon: 78.3920, stock: 16, description: "Navy suede loafers, use a suede brush for care." },
    { id: 712, name: "Formal Shoes", price: 3999, vendor: "Classy Steps", category: "Men's Footwear", image: "Formal Shoes.jpg", lat: 17.4430, lon: 78.3860, stock: 7, description: "Brown leather formal shoes, polish regularly for shine." },
    { id: 713, name: "Hiking Boots", price: 4999, vendor: "Trail Trek", category: "Men's Footwear", image: "Hiking Boots.jpg", lat: 17.4500, lon: 78.3840, stock: 5, description: "Durable waterproof leather hiking boots in brown." },
    { id: 714, name: "Chelsea Boots", price: 3999, vendor: "Urban Walk", category: "Men's Footwear", image: "Chelsea Boots.jpg", lat: 17.4470, lon: 78.3910, stock: 8, description: "Black leather Chelsea boots, polish regularly." },
    { id: 715, name: "Slip-On Sneakers", price: 2299, vendor: "Easy Stride", category: "Men's Footwear", image: "Slip-On Sneakers.jpg", lat: 17.4400, lon: 78.3850, stock: 18, description: "Grey canvas slip-on sneakers, machine washable." },
    { id: 716, name: "Sports Sandals", price: 1499, vendor: "Active Feet", category: "Men's Footwear", image: "Sports Sandals.jpg", lat: 17.4486, lon: 78.3908, stock: 13, description: "Blue/black synthetic sports sandals for outdoor activities." },
    { id: 717, name: "Kids Sneakers", price: 1299, vendor: "Tiny Treads", category: "Kids' Footwear", image: "Kids Sneakers.jpg", lat: 17.4512, lon: 78.3855, stock: 22, description: "Blue canvas sneakers for kids, machine washable." },
    { id: 718, name: "Kids Sandals", price: 799, vendor: "Little Steps", category: "Kids' Footwear", image: "Kids Sandals.jpg", lat: 17.4421, lon: 78.3882, stock: 28, description: "Pink rubber sandals for kids, easy to clean." },
    { id: 719, name: "Kids Boots", price: 1499, vendor: "Tiny Treads", category: "Kids' Footwear", image: "Kids Boots.jpg", lat: 17.4550, lon: 78.3920, stock: 10, description: "Brown faux leather boots for kids." },
    { id: 720, name: "Kids Slippers", price: 599, vendor: "Cozy Kids", category: "Kids' Footwear", image: "Kids Slippers.jpg", lat: 17.4399, lon: 78.4421, stock: 30, description: "Blue fleece slippers for kids, machine washable." },
    { id: 721, name: "Kids Running Shoes", price: 1399, vendor: "Speedy Steps", category: "Kids' Footwear", image: "Kids Running Shoes.jpg", lat: 17.4455, lon: 78.3800, stock: 15, description: "Green mesh running shoes for active kids." },
    { id: 722, name: "Kids Canvas Shoes", price: 999, vendor: "Tiny Treads", category: "Kids' Footwear", image: "Kids Canvas Shoes.jpg", lat: 17.4480, lon: 78.3890, stock: 20, description: "Red canvas shoes for kids, machine washable." },
    { id: 723, name: "Kids Flip Flops", price: 499, vendor: "Little Steps", category: "Kids' Footwear", image: "Kids Flip Flops.jpg", lat: 17.4520, lon: 78.3870, stock: 25, description: "Yellow rubber flip flops for kids." },
    { id: 724, name: "Kids Dress Shoes", price: 1599, vendor: "Tiny Steps", category: "Kids' Footwear", image: "Kids Dress Shoes.jpg", lat: 17.4400, lon: 78.3850, stock: 12, description: "Black faux leather dress shoes for kids." }
];

const FootwearProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
    const getImageSrc = (image) => {
        if (!image) return 'https://via.placeholder.com/200x150?text=No+Image';
        if (image.startsWith('http://') || image.startsWith('https://')) return image;
        if (image.includes('-') && /^\d+-\w+\./.test(image)) return `${process.env.REACT_APP_API_URL}/uploads/${image}`;
        return `/IMAGES/${image}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState(product?.size?.[0] || '');
    const [productWithDistance, setProductWithDistance] = useState(product);
    const [relatedProductsWithDistance, setRelatedProductsWithDistance] = useState([]);

    const getDistanceFromLatLonInKm = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const deg2rad = (deg) => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    useEffect(() => {
        if (product) {
            setMainImage(getImageSrc(product.image));
            setSelectedSize(product.size?.[0] || '');
            console.log('🔍 FootwearProductDetail - Rendering product:', product.name);
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
                    const related = allFootwearProducts.filter(p => p.id !== product.id).sort(() => 0.5 - Math.random()).slice(0, 4);
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
                    setProductWithDistance({ ...product, distance: 'Distance N/A' });
                    const related = allFootwearProducts.filter(p => p.id !== product.id).sort(() => 0.5 - Math.random()).slice(0, 4);
                    setRelatedProductsWithDistance(related.map(p => ({ ...p, distance: 'Distance N/A' })));
                }
            );
        } else {
            setProductWithDistance({ ...product, distance: 'Distance N/A' });
            const related = allFootwearProducts.filter(p => p.id !== product.id).sort(() => 0.5 - Math.random()).slice(0, 4);
            setRelatedProductsWithDistance(related.map(p => ({ ...p, distance: 'Distance N/A' })));
        }
    }, [product, getDistanceFromLatLonInKm]);

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

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#footwear-products" onClick={(e) => { e.preventDefault(); navigateTo('footwear-products'); }} className="back-link">&larr; Back to Footwear Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#footwear-products" onClick={(e) => { e.preventDefault(); navigateTo('footwear-products'); }} className="back-link">&larr; Back to Footwear Products</a>
            <div className="product-detail-container">
                <div className="product-images">
                    <div className="main-image">
                        <img src={mainImage} alt={product.name} />
                    </div>
                    <div className="thumbnail-track">
                        {thumbnailImages.map((imgSrc, index) => (
                            <img key={index} src={imgSrc} alt={`${product.name} thumbnail ${index + 1}`} className={`thumbnail ${mainImage === imgSrc ? 'active' : ''}`} onClick={() => setMainImage(imgSrc)} onError={(e) => e.target.src = 'https://via.placeholder.com/80x80?text=No+Img'} />
                        ))}
                    </div>
                </div>
                <div className="product-details">
                    <h1>{product.name}</h1>
                    <p className="product-vendor">by {product.vendor}</p>
                    <div className="product-price">₹{product.price.toLocaleString()}</div>
                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description || 'A high-quality pair of shoes, perfect for any occasion. Made with the finest materials for comfort and style.'}</p>
                    </div>
                    {product.warranty && (
                        <div className="product-warranty" style={{ marginTop: '15px', padding: '12px', backgroundColor: '#e8f5e9', borderLeft: '4px solid #4CAF50', borderRadius: '4px' }}>
                            <strong style={{ color: '#2e7d32' }}><i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>Warranty:</strong>
                            <span style={{ marginLeft: '8px', color: '#555' }}>{product.warranty}</span>
                        </div>
                    )}
                    {product.expiryDate && (
                        <div className="product-expiry" style={{ marginTop: '15px', padding: '12px', backgroundColor: '#fff3e0', borderLeft: '4px solid #ff9800', borderRadius: '4px' }}>
                            <strong style={{ color: '#e65100' }}><i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>Expiry Date:</strong>
                            <span style={{ marginLeft: '8px', color: '#555' }}>{formatDate(product.expiryDate)}</span>
                        </div>
                    )}
                    <div className="product-distance"><i className="fas fa-map-marker-alt"></i><span>{productWithDistance.distance || 'Calculating...'}</span></div>
                    <div className="product-specs">
                        <h3>Specifications</h3>
                        <div className="spec-grid">
                            <div className="spec-item"><strong>Size</strong><div className="size-options">{product.size?.map(size => (<button key={size} className={`size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>))}</div></div>
                            <div className="spec-item"><strong>Color</strong><span>{product.color || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Material</strong><span>{product.material || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Care Instructions</strong><span>{product.wash || 'N/A'}</span></div>
                        </div>
                    </div>
                    <div className="product-actions">
                        {isInCart ? (<button onClick={() => navigateTo('cart')} className="btn go-to-cart">Go to Cart</button>) : (<button className="btn" onClick={() => onAddToCart(product)}>Add to Cart</button>)}
                        <button className={`wishlist-heart-btn ${isInWishlist ? 'active' : ''}`} title="Add to Wishlist" onClick={() => onToggleWishlist(product)}><i className={isInWishlist ? "fas fa-heart" : "far fa-heart"}></i></button>
                    </div>
                </div>
            </div>
            <div className="related-products-section">
                <h2>Related Products</h2>
                <div className="related-product-grid">
                    {relatedProductsWithDistance.map(related => (
                        <div key={related.id} className="related-product-card" onClick={() => onViewProduct(related)} style={{cursor: 'pointer'}}>
                            <img src={getImageSrc(related.image)} alt={related.name} onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=No+Img'} />
                            <div className="related-product-info">
                                <h4>{related.name}</h4>
                                <p style={{fontSize: '14px', color: 'var(--gray)'}}>{related.vendor}</p>
                                <div className="product-price" style={{fontSize: '18px', marginTop: '10px'}}>₹{related.price.toLocaleString()}</div>
                                <div className="product-distance" style={{fontSize: '14px', color: 'var(--gray)', marginTop: '5px'}}><i className="fas fa-map-marker-alt"></i> <span>{related.distance || 'N/A'}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FootwearProductDetail;