import React, { useState, useEffect, useMemo } from 'react';
import './ClothesProductDetail.css';

export const allClothesProducts = [
    { id: 501, name: "Saree", price: 2499, vendor: "Elegant Threads", image: "Saree.jpg", category: "Clothes", material: "Silk", color: "Red", size: ["S", "M", "L"], otherImages: ["Saree1.jpg", "Saree2.jpg", "Saree3.jpg"], lat: 17.4486, lon: 78.3908 },
    { id: 502, name: "Kurti", price: 1999, vendor: "Graceful Attire", image: "Kurti.jpg", category: "Clothes", material: "Cotton", color: "Blue", size: ["S", "M", "L", "XL"], otherImages: ["Kurti1.jpg", "Kurti2.jpg", "Kurti3.jpg"], lat: 17.4512, lon: 78.3855 },
    { id: 503, name: "Lehenga", price: 2699, vendor: "Fashion Boutique", image: "Lehenga.jpg", category: "Clothes", material: "Georgette", color: "Pink", size: ["Free Size"], otherImages: ["Lehenga1.jpg", "Lehenga2.jpg", "Lehenga3.jpg"], lat: 17.4421, lon: 78.3882 },
    { id: 504, name: "Anarkali Suit", price: 2499, vendor: "Chic Styles", image: "Anarkali Suit.jpg", category: "Clothes", material: "Chiffon", color: "Green", size: ["M", "L", "XL"], otherImages: ["Anarkali Suit1.jpg", "Anarkali Suit2.jpg", "Anarkali Suit3.jpg"], lat: 17.4550, lon: 78.3920 },
    { id: 505, name: "Western Dress", price: 3499, vendor: "Trendy Threads", image: "Western Dress.jpg", category: "Clothes", material: "Polyester", color: "Black", size: ["S", "M", "L"], otherImages: ["Western Dress1.jpg", "Western Dress2.jpg", "Western Dress3.jpg"], lat: 17.4399, lon: 78.4421 },
    { id: 506, name: "Casual Top", price: 1799, vendor: "Cool Trends", image: "Casual Top.jpg", category: "Clothes", material: "Cotton", color: "White", size: ["S", "M", "L", "XL"], otherImages: ["Casual Top1.jpg", "Casual Top2.jpg", "Casual Top3.jpg"], lat: 17.4455, lon: 78.3800 },
    { id: 507, name: "Leggings", price: 799, vendor: "Active Wear", image: "Leggings.jpg", category: "Clothes", material: "Lycra", color: "Black", size: ["S", "M", "L", "XL"], otherImages: ["Leggings1.jpg", "Leggings2.jpg", "Leggings3.jpg"], lat: 17.4480, lon: 78.3890 },
    { id: 508, name: "Evening Gown", price: 2999, vendor: "Elegant Threads", image: "Evening Gown.jpg", category: "Clothes", material: "Satin", color: "Navy Blue", size: ["S", "M", "L"], otherImages: ["Evening Gown1.jpg", "Evening Gown2.jpg", "Evening Gown3.jpg"], lat: 17.4520, lon: 78.3870 },
    { id: 509, name: "Formal Shirt", price: 2999, vendor: "Dapper Threads", image: "Formal Shirt.jpg", category: "Clothes", material: "Cotton", color: "White", size: ["M", "L", "XL"], otherImages: ["Formal Shirt1.jpg", "Formal Shirt2.jpg", "Formal Shirt3.jpg"], lat: 17.4400, lon: 78.3850 },
    { id: 510, name: "Blazer", price: 3499, vendor: "Sharp Attire", image: "Blazer.jpg", category: "Clothes", material: "Wool Blend", color: "Gray", size: ["M", "L", "XL"], otherImages: ["Blazer1.jpg", "Blazer2.jpg", "Blazer3.jpg"], lat: 17.4490, lon: 78.3950 },
    { id: 511, name: "Casual Shirt", price: 1999, vendor: "Comfort Threads", image: "Casual Shirt.jpg", category: "Clothes", material: "Linen", color: "Beige", size: ["M", "L", "XL"], otherImages: ["Casual Shirt1.jpg", "Casual Shirt2.jpg", "Casual Shirt3.jpg"], lat: 17.4550, lon: 78.3920 },
    { id: 512, name: "Suit", price: 3999, vendor: "Classy Attire", image: "Suit.jpg", category: "Clothes", material: "Terry Rayon", color: "Black", size: ["M", "L", "XL"], otherImages: ["Suit1.jpg", "Suit2.jpg", "Suit3.jpg"], lat: 17.4430, lon: 78.3860 },
    { id: 513, name: "Jacket", price: 4999, vendor: "Trendy Outerwear", image: "Jacket.jpg", category: "Clothes", material: "Leather", color: "Brown", size: ["M", "L", "XL"], otherImages: ["Jacket1.jpg", "Jacket2.jpg", "Jacket3.jpg"], lat: 17.4500, lon: 78.3840 },
    { id: 514, name: "Sweater", price: 3999, vendor: "Cozy Threads", image: "Sweater.jpg", category: "Clothes", material: "Wool", color: "Maroon", size: ["M", "L", "XL"], otherImages: ["Sweater1.jpg", "Sweater2.jpg", "Sweater3.jpg"], lat: 17.4470, lon: 78.3910 },
    { id: 515, name: "Jeans", price: 2299, vendor: "Denim Hub", image: "Men's Jeans.jpg", category: "Clothes", material: "Denim", color: "Blue", size: ["30", "32", "34", "36"], otherImages: ["Men's Jeans1.jpg", "Men's Jeans2.jpg", "Men's Jeans3.jpg"], lat: 17.4400, lon: 78.3850 },
    { id: 516, name: "T-Shirt", price: 1499, vendor: "Casual Trends", image: "Men's T-Shirt.jpg", category: "Clothes", material: "Cotton", color: "Black", size: ["S", "M", "L", "XL"], otherImages: ["Men's T-Shirt1.jpg", "Men's T-Shirt2.jpg", "Men's T-Shirt3.jpg"], lat: 17.4486, lon: 78.3908 },
    { id: 517, name: "Kids T-Shirt", price: 1299, vendor: "Tiny Trends", image: "Kids T-Shirt.jpg", category: "Clothes", material: "Cotton", color: "Yellow", size: ["2-4Y", "4-6Y", "6-8Y"], otherImages: ["Kids T-Shirt1.jpg", "Kids T-Shirt2.jpg", "Kids T-Shirt3.jpg"], lat: 17.4512, lon: 78.3855 },
    { id: 518, name: "Kids Shorts", price: 799, vendor: "Little Threads", image: "Kids Shorts.jpg", category: "Clothes", material: "Cotton", color: "Blue", size: ["2-4Y", "4-6Y", "6-8Y"], otherImages: ["Kids Shorts1.jpg", "Kids Shorts2.jpg", "Kids Shorts3.jpg"], lat: 17.4421, lon: 78.3882 },
    { id: 519, name: "Kids Jacket", price: 1499, vendor: "Tiny Trends", image: "Kids Jacket.jpg", category: "Clothes", material: "Denim", color: "Blue", size: ["2-4Y", "4-6Y", "6-8Y"], otherImages: ["Kids Jacket1.jpg", "Kids Jacket2.jpg", "Kids Jacket3.jpg"], lat: 17.4550, lon: 78.3920 },
    { id: 520, name: "Kids Pajamas", price: 599, vendor: "Cozy Kids", image: "Kids Pajamas.jpg", category: "Clothes", material: "Cotton", color: "Printed", size: ["2-4Y", "4-6Y", "6-8Y"], otherImages: ["Kids Pajamas1.jpg", "Kids Pajamas2.jpg", "Kids Pajamas3.jpg"], lat: 17.4399, lon: 78.4421 },
    { id: 521, name: "Kids Sports Wear", price: 1399, vendor: "Active Kids", image: "Kids Sports Wear.jpg", category: "Clothes", material: "Polyester", color: "Red", size: ["4-6Y", "6-8Y", "8-10Y"], otherImages: ["Kids Sports Wear1.jpg", "Kids Sports Wear2.jpg", "Kids Sports Wear3.jpg"], lat: 17.4455, lon: 78.3800 },
    { id: 522, name: "Kids Jeans", price: 999, vendor: "Tiny Trends", image: "Kids Jeans.jpg", category: "Clothes", material: "Denim", color: "Blue", size: ["4-6Y", "6-8Y", "8-10Y"], otherImages: ["Kids Jeans1.jpg", "Kids Jeans2.jpg", "Kids Jeans3.jpg"], lat: 17.4480, lon: 78.3890 },
    { id: 523, name: "Kids Cap", price: 499, vendor: "Little Threads", image: "Kids Cap.jpg", category: "Clothes", material: "Cotton", color: "Black", size: ["Free Size"], otherImages: ["Kids Cap1.jpg", "Kids Cap2.jpg", "Kids Cap3.jpg"], lat: 17.4520, lon: 78.3870 },
    { id: 524, name: "Kids Dress", price: 1599, vendor: "Tiny Trends", image: "Kids Dress.jpg", category: "Clothes", material: "Cotton", color: "Pink", size: ["2-4Y", "4-6Y", "6-8Y"], otherImages: ["Kids Dress1.jpg", "Kids Dress2.jpg", "Kids Dress3.jpg"], lat: 17.4400, lon: 78.3850 }
];

const ClothesProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        if (product) {
            setMainImage(getImageSrc(product.image));
            setSelectedSize(product.size?.[0] || '');
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

    // Fetch product details from API if product has _id (from database)
    const [apiProduct, setApiProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    // Use API product data if available, otherwise fall back to static data
    const displayProduct = apiProduct || product;

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return allClothesProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    useEffect(() => {
        if (product && product._id) {
            const fetchProductDetails = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:5000/api/products/${product._id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setApiProduct(data);
                    }
                } catch (error) {
                    console.error('Error fetching product details:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProductDetails();
        }
    }, [product]);

    // ✅ Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#clothes-products" onClick={(e) => { e.preventDefault(); navigateTo('clothes-products'); }} className="back-link">&larr; Back to Clothes Products</a>
            </div>
        );
    }

    console.log('🔍 ClothesProductDetail - Rendering product:', displayProduct.name);
    console.log('📦 Full product object:', displayProduct);
    console.log('🛡️ Warranty:', displayProduct.warranty);
    console.log('📅 Expiry:', displayProduct.expiryDate);

    return (
        <div className="container">
            <a
                href="#clothes-products"
                onClick={(e) => { e.preventDefault(); navigateTo('clothes-products'); }}
                className="back-link"
            >
                &larr; Back to Clothes Products
            </a>
            
            <div className="product-detail-container">
                <div className="product-images">
                    <div className="main-image">
                        <img src={mainImage} alt={displayProduct.name} />
                    </div>
                    <div className="thumbnail-track">
                        {thumbnailImages.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`${displayProduct.name} thumbnail ${index + 1}`}
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
                        <p>{product.description || `A stylish piece of clothing made from high-quality ${product.material || 'material'}. Perfect for any occasion.`}</p>
                    </div>

                    {/* ✅ WARRANTY - Display if available */}
                    {displayProduct.warranty && (
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
                            <span style={{ marginLeft: '8px', color: '#555' }}>{displayProduct.warranty}</span>
                        </div>
                    )}

                    {/* ✅ EXPIRY DATE - Display if available */}
                    {displayProduct.expiryDate && (
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
                            <span style={{ marginLeft: '8px', color: '#555' }}>{formatDate(displayProduct.expiryDate)}</span>
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
                    
                    <div className="size-selector">
                        <h3>Size</h3>
                        <div className="size-options">
                            {product.size?.map(s => (
                                <button key={s} className={`size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                            ))}
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

export default ClothesProductDetail;