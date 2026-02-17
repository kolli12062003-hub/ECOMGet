import React, { useState, useEffect, useMemo } from 'react';
import './MusicalProductDetail.css';

export const allMusicalProducts = [
     { id: 1501, name: "Acoustic Guitar", price: 799, vendor: "Music Haven", image: "Acoustic Guitar.jpg", type: "String", material: "Wood", color: "Natural", otherImages: ["Acoustic Guitar1.jpeg", "Acoustic Guitar2.jpeg", "Acoustic Guitar3.jpeg"], lat: 17.4486, lon: 78.3908,category:"Musical Instruments" },
             { id: 1502, name: "Electric Guitar", price: 499, vendor: "Rock Shop", image: "Electric Guitar.jpg", type: "String", material: "Wood, Metal", color: "Sunburst", otherImages: ["Electric Guitar1.jpeg", "Electric Guitar2.jpeg", "Electric Guitar3.jpeg"], lat: 17.4512, lon: 78.3855,category:"Musical Instruments"  },
             { id: 1503, name: "Digital Piano", price: 899, vendor: "Melody Mart", image: "Digital Piano.jpg", type: "Keyboard", material: "Plastic, Metal", color: "Black", otherImages: ["Digital Piano1.jpeg", "Digital Piano2.jpeg", "Digital Piano3.jpeg"], lat: 17.4421, lon: 78.3882,category:"Musical Instruments"  },
             { id: 1504, name: "Drum Kit", price: 749, vendor: "Music Haven", image: "Drum Kit.jpg", type: "Percussion", material: "Wood, Metal", color: "Red", otherImages: ["Drum Kit1.jpeg", "Drum Kit2.jpeg", "Drum Kit3.jpeg"], lat: 17.4550, lon: 78.3920,category:"Musical Instruments"  },
            { id: 1505, name: "Violin", price: 999, vendor: "Classical Sounds", image: "Violin.jpg", type: "String", material: "Wood", color: "Brown", otherImages: ["Violin1.jpeg", "Violin2.jpeg", "Violin3.jpeg"], lat: 17.4399, lon: 78.4421,category:"Musical Instruments"  },
            { id: 1506, name: "Guitar Strings", price: 399, vendor: "Tune Up Co.", image: "Guitar Strings.jpg", type: "Accessory", material: "Steel", color: "Silver", otherImages: ["Guitar Strings1.jpeg", "Guitar Strings2.jpeg", "Guitar Strings3.jpeg"], lat: 17.4455, lon: 78.3800,category:"Musical Instruments"  },
            { id: 1507, name: "Drumsticks", price: 349, vendor: "Rhythm Gear", image: "Drumsticks.jpg", type: "Accessory", material: "Wood", color: "Natural", otherImages: ["Drumsticks1.jpeg", "Drumsticks2.jpeg", "Drumsticks3.jpeg"], lat: 17.4480, lon: 78.3890,category:"Musical Instruments"  },
            { id: 1508, name: "Ukulele", price: 599, vendor: "Music Haven", image: "Ukulele.jpg", type: "String", material: "Wood", color: "Natural", otherImages: ["Ukulele1.jpeg", "Ukulele2.jpeg", "Ukulele3.jpeg"], lat: 17.4520, lon: 78.3870,category:"Musical Instruments"  },
            { id: 1509, name: "Saxophone", price: 799, vendor: "Classical Sounds", image: "Saxophone.jpg", type: "Wind", material: "Brass", color: "Gold", otherImages: ["Saxophone1.jpeg", "Saxophone2.jpeg", "Saxophone3.jpeg"], lat: 17.4400, lon: 78.3850,category:"Musical Instruments"  },
            { id: 1510, name: "Harmonica", price: 499, vendor: "Tune Up Co.", image: "Harmonica.jpg", type: "Wind", material: "Metal, Plastic", color: "Silver", otherImages: ["Harmonica1.jpeg", "Harmonica2.jpeg", "Harmonica3.jpeg"], lat: 17.4490, lon: 78.3950,category:"Musical Instruments"  },
            { id: 1511, name: "Flute", price: 699, vendor: "Classical Sounds", image: "Flute.jpg", type: "Wind", material: "Silver-plated", color: "Silver", otherImages: ["Flute1.jpeg", "Flute2.jpeg", "Flute3.jpeg"], lat: 17.4550, lon: 78.3920 ,category:"Musical Instruments" },
            { id: 1512, name: "Electric Keyboard", price: 999, vendor: "Melody Mart", image: "Electric Keyboard.jpg", type: "Keyboard", material: "Plastic", color: "Black", otherImages: ["Electric Keyboard1.jpeg", "Electric Keyboard2.jpeg", "Electric Keyboard3.jpeg"], lat: 17.4430, lon: 78.3860,category:"Musical Instruments"  },
            { id: 1513, name: "Guitar Picks", price: 399, vendor: "Tune Up Co.", image: "Guitar Picks.jpg", type: "Accessory", material: "Plastic", color: "Assorted", otherImages: ["Guitar Picks1.jpeg", "Guitar Picks2.jpeg", "Guitar Picks3.jpeg"], lat: 17.4500, lon: 78.3840,category:"Musical Instruments"  },
            { id: 1514, name: "Trumpet", price: 849, vendor: "Classical Sounds", image: "Trumpet.jpg", type: "Wind", material: "Brass", color: "Gold", otherImages: ["Trumpet1.jpeg", "Trumpet2.jpeg", "Trumpet3.jpeg"], lat: 17.4470, lon: 78.3910,category:"Musical Instruments"  }
];

const MusicalProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
            console.log('🔍 MusicalProductDetail - Rendering product:', product.name);
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
        return allMusicalProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#musical-products" onClick={(e) => { e.preventDefault(); navigateTo('musical-products'); }} className="back-link">&larr; Back to Musical Instruments Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#musical-products" onClick={(e) => { e.preventDefault(); navigateTo('musical-products'); }} className="back-link">&larr; Back to Musical Instruments Products</a>
            
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
                        <p>{product.description || 'A high-quality musical instrument for beginners and professionals alike. Crafted for excellent sound and durability.'}</p>
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

export default MusicalProductDetail;