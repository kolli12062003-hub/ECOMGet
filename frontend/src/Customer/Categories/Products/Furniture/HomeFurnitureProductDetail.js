import React, { useState, useEffect, useMemo } from 'react';
import './HomeFurnitureProductDetail.css';

export const allHomeFurnitureProducts = [
    { id: 1101, name: "Sofa Set", price: 24999, vendor: "Home Comfort", image: "Sofa Set.jpg", category: "Home Furniture", material: "Fabric", dimensions: "84 x 36 x 34 in", color: "Grey", warranty: "1 Year", otherImages: ["Sofa Set1.jpeg", "Sofa Set2.jpeg", "Sofa Set3.jpeg"], lat: 17.4486, lon: 78.3908 },
    { id: 1102, name: "Dining Table", price: 17999, vendor: "Urban Living", image: "Dining Table.jpg", category: "Home Furniture", material: "Sheesham Wood", dimensions: "60 x 36 x 30 in", color: "Natural Wood", warranty: "2 Years", otherImages: ["Dining Table1.jpeg", "Dining Table2.jpeg", "Dining Table3.jpeg"], lat: 17.4512, lon: 78.3855 },
    { id: 1103, name: "King Size Bed", price: 29999, vendor: "Sleep Well", image: "King Size Bed.jpg", category: "Home Furniture", material: "Engineered Wood", dimensions: "78 x 72 x 40 in", color: "Wenge", warranty: "3 Years", otherImages: ["King Size Bed1.jpeg", "King Size Bed2.jpeg", "King Size Bed3.jpeg"], lat: 17.4421, lon: 78.3882 },
    { id: 1104, name: "Coffee Table", price: 7999, vendor: "Home Comfort", image: "Coffee Table.jpg", category: "Home Furniture", material: "Glass & Metal", dimensions: "42 x 24 x 18 in", color: "Black", warranty: "1 Year", otherImages: ["Coffee Table1.jpeg", "Coffee Table2.jpeg", "Coffee Table3.jpeg"], lat: 17.4550, lon: 78.3920 },
    { id: 1105, name: "Bookshelf", price: 9999, vendor: "Urban Living", image: "Bookshelf.jpg", category: "Home Furniture", material: "Particle Board", dimensions: "32 x 12 x 72 in", color: "Oak", warranty: "1 Year", otherImages: ["Bookshelf1.jpeg", "Bookshelf2.jpeg", "Bookshelf3.jpeg"], lat: 17.4399, lon: 78.4421 },
    { id: 1106, name: "Recliner Chair", price: 14999, vendor: "Home Comfort", image: "Recliner Chair.jpg", category: "Home Furniture", material: "Faux Leather", dimensions: "35 x 40 x 42 in", color: "Brown", warranty: "2 Years", otherImages: ["Recliner Chair1.jpeg", "Recliner Chair2.jpeg", "Recliner Chair3.jpeg"], lat: 17.4455, lon: 78.3800 },
    { id: 1107, name: "TV Unit", price: 11999, vendor: "Furniture Hub", image: "TV Unit.jpg", category: "Home Furniture", material: "Engineered Wood", dimensions: "70 x 16 x 22 in", color: "White", warranty: "1 Year", otherImages: ["TV Unit1.jpeg", "TV Unit2.jpeg", "TV Unit3.jpeg"], lat: 17.4480, lon: 78.3890 },
    { id: 1108, name: "Wardrobe", price: 19999, vendor: "Urban Living", image: "Wardrobe.jpg", category: "Home Furniture", material: "MDF", dimensions: "48 x 24 x 78 in", color: "Walnut", warranty: "2 Years", otherImages: ["Wardrobe1.jpeg", "Wardrobe2.jpeg", "Wardrobe3.jpeg"], lat: 17.4520, lon: 78.3870 },
    { id: 1109, name: "Office Desk", price: 12999, vendor: "Urban Living", image: "Office Desk.jpg", category: "Home Furniture", material: "Metal & Wood", dimensions: "48 x 24 x 30 in", color: "Black/Oak", warranty: "1 Year", otherImages: ["Office Desk1.jpeg", "Office Desk2.jpeg", "Office Desk3.jpeg"], lat: 17.4400, lon: 78.3850 },
    { id: 1110, name: "Bar Stool", price: 4999, vendor: "Furniture Hub", image: "Bar Stool.jpg", category: "Home Furniture", material: "Metal", dimensions: "18 x 18 x 30 in", color: "Black", warranty: "1 Year", otherImages: ["Bar Stool1.jpeg", "Bar Stool2.jpeg", "Bar Stool3.jpeg"], lat: 17.4490, lon: 78.3950 },
    { id: 1111, name: "Study Table", price: 8999, vendor: "Urban Living", image: "Study Table.jpg", category: "Home Furniture", material: "Engineered Wood", dimensions: "40 x 20 x 30 in", color: "Teak", warranty: "1 Year", otherImages: ["Study Table1.jpeg", "Study Table2.jpeg", "Study Table3.jpeg"], lat: 17.4550, lon: 78.3920 },
    { id: 1112, name: "Armchair", price: 10999, vendor: "Home Comfort", image: "Armchair.jpg", category: "Home Furniture", material: "Fabric", dimensions: "30 x 32 x 35 in", color: "Blue", warranty: "1 Year", otherImages: ["Armchair1.jpeg", "Armchair2.jpeg", "Armchair3.jpeg"], lat: 17.4430, lon: 78.3860 },
    { id: 1113, name: "Side Table", price: 5999, vendor: "Furniture Hub", image: "Side Table.jpg", category: "Home Furniture", material: "Wood", dimensions: "18 x 18 x 24 in", color: "Brown", warranty: "1 Year", otherImages: ["Side Table1.jpeg", "Side Table2.jpeg", "Side Table3.jpeg"], lat: 17.4500, lon: 78.3840 },
    { id: 1114, name: "Queen Size Bed", price: 25999, vendor: "Sleep Well", image: "Queen Size Bed.jpg", category: "Home Furniture", material: "Solid Wood", dimensions: "78 x 60 x 40 in", color: "Honey", warranty: "5 Years", otherImages: ["Queen Size Bed1.jpeg", "Queen Size Bed2.jpeg", "Queen Size Bed3.jpeg"], lat: 17.4470, lon: 78.3910 },
    { id: 1115, name: "Shoe Rack", price: 3999, vendor: "Urban Living", image: "Shoe Rack.jpg", category: "Home Furniture", material: "Engineered Wood", dimensions: "30 x 14 x 48 in", color: "Wenge", warranty: "1 Year", otherImages: ["Shoe Rack1.jpeg", "Shoe Rack2.jpeg", "Shoe Rack3.jpeg"], lat: 17.4400, lon: 78.3850 }
];

const HomeFurnitureProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
            console.log('🔍 HomeFurnitureProductDetail - Rendering product:', product.name);
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
        return allHomeFurnitureProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#homefurniture-products" onClick={(e) => { e.preventDefault(); navigateTo('homefurniture-products'); }} className="back-link">&larr; Back to Home Furniture Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#homefurniture-products" onClick={(e) => { e.preventDefault(); navigateTo('homefurniture-products'); }} className="back-link">&larr; Back to Home Furniture Products</a>
            
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
                        <p>{product.description || 'A high-quality piece of furniture that combines style and comfort. Perfect for modern living spaces.'}</p>
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
                            <div className="spec-item"><strong>Dimensions</strong><span>{product.dimensions || 'N/A'}</span></div>
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

export default HomeFurnitureProductDetail;