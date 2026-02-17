import React, { useState, useEffect, useMemo } from 'react';
import './JewelleryProductDetail.css'; // Create this CSS file

// Removed static data - now fetching from API

const JewelleryProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
            const uploadPath = `${process.env.REACT_APP_API_URL}/uploads/${image}`;
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

    const isInCart = useMemo(() => cartItems.some(item => (item._id || item.id) === (product?._id || product?.id)), [cartItems, product]);
    const isInWishlist = useMemo(() => wishlistItems.some(item => (item._id || item.id) === (product?._id || product?.id)), [wishlistItems, product]);

    const thumbnailImages = useMemo(() => {
        if (!product) return [];
        const images = [getImageSrc(product.image)];
        if (product.otherImages && product.otherImages.length > 0) {
            return images.concat(product.otherImages.map(img => getImageSrc(img)));
        }
        return images;
    }, [product]);

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch('${process.env.REACT_APP_API_URL}/api/products/category/Jewellery');
                if (response.ok) {
                    const data = await response.json();
                    const filtered = data.filter(p => (p._id || p.id) !== (product._id || product.id));
                    setRelatedProducts(filtered.sort(() => 0.5 - Math.random()).slice(0, 4));
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        if (product) {
            fetchRelatedProducts();
        }
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#jewellery-products" onClick={(e) => { e.preventDefault(); navigateTo('jewellery-products'); }} className="back-link">&larr; Back to Jewellery Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a
                href="#jewellery-products"
                onClick={(e) => { e.preventDefault(); navigateTo('jewellery-products'); }}
                className="back-link"
            >
                &larr; Back to Jewellery Products
            </a>
            
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
                    <div className="product-price">₹{product.price.toLocaleString()}</div>
                    <div className="product-description">
                        <h3>Description</h3>
                        <p>An exquisite piece of jewellery, crafted with the finest materials. Perfect for any occasion.</p>
                    </div>
                    <div className="product-distance">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{product.distance || 'Distance N/A'}</span>
                    </div>
                    <div className="product-specs">
                        <h3>Specifications</h3>
                        <div className="spec-grid">
                            <div className="spec-item"><strong>Material</strong><span>{product.material || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Shape</strong><span>{product.shape || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Stone</strong><span>{product.stone || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Plating</strong><span>{product.plating || 'N/A'}</span></div>
                            <div className="spec-item" style={{gridColumn: '1 / -1'}}><strong>Material & Care</strong><span>{product.care || 'N/A'}</span></div>
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

export default JewelleryProductDetail;