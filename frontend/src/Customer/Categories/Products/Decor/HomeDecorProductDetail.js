import React, { useState, useEffect, useMemo } from 'react';
import './HomeDecorProductDetail.css';
import HomeDecor from './HomeDecor';

export const allHomeDecorProducts = [
    { id: 1501, name: "Wall Art Canvas", price: 2999, vendor: "Decor Trends", image: "Wall Art Canvas.jpg", material: "Canvas", color: "Multicolor", dimensions: "24x36 inches", features: "Ready to hang, vibrant colors", otherImages: ["Wall Art Canvas1.jpg", "Wall Art Canvas2.jpg", "Wall Art Canvas3.jpg"], lat: 17.4486, lon: 78.3908, category: "Home Decor" },
    { id: 1502, name: "LED Table Lamp", price: 1499, vendor: "LightHouse", image: "LED Table Lamp.jpg", material: "Plastic, Metal", color: "Black", dimensions: "12x8 inches", features: "Energy efficient, adjustable brightness", otherImages: ["LED Table Lamp1.jpg", "LED Table Lamp2.jpg", "LED Table Lamp3.jpg"], lat: 17.4512, lon: 78.3855, category: "Home Decor" },
    { id: 1503, name: "Decorative Cushions", price: 999, vendor: "HomeStyle", image: "Decorative Cushions.jpg", material: "Cotton", color: "Assorted", dimensions: "16x16 inches", features: "Machine washable, soft fabric", otherImages: ["Decorative Cushions1.jpg", "Decorative Cushions2.jpg", "Decorative Cushions3.jpg"], lat: 17.4421, lon: 78.3882, category: "Home Decor" },
    { id: 1504, name: "Cordless Drill", price: 3999, vendor: "ToolTech", image: "Cordless Drill.jpg", material: "Plastic, Metal", color: "Yellow/Black", dimensions: "10x3 inches", features: "Lithium-ion battery, variable speed", otherImages: ["Cordless Drill1.jpg", "Cordless Drill2.jpg", "Cordless Drill3.jpg"], lat: 17.4550, lon: 78.3920, category: "Home Decor" },
    { id: 1505, name: "Wall Paint Set", price: 2499, vendor: "ColorSplash", image: "Wall Paint Set.jpg", material: "Emulsion", color: "Assorted", dimensions: "1 gallon", features: "Low VOC, easy application", otherImages: ["Wall Paint Set1.jpg", "Wall Paint Set2.jpg", "Wall Paint Set3.jpg"], lat: 17.4399, lon: 78.4421, category: "Home Decor" },
    { id: 1506, name: "Photo Frame Set", price: 1299, vendor: "Decor Trends", image: "Photo Frame Set.jpg", material: "Wood", color: "Black", dimensions: "Various sizes", features: "Elegant design, glass front", otherImages: ["Photo Frame Set1.jpg", "Photo Frame Set2.jpg", "Photo Frame Set3.jpg"], lat: 17.4455, lon: 78.3800, category: "Home Decor" },
    { id: 1507, name: "Ceiling Light Fixture", price: 4999, vendor: "LightHouse", image: "Ceiling Light Fixture.jpg", material: "Metal, Glass", color: "Bronze", dimensions: "18 inches diameter", features: "Dimmable, modern design", otherImages: ["Ceiling Light Fixture1.jpg", "Ceiling Light Fixture2.jpg", "Ceiling Light Fixture3.jpg"], lat: 17.4480, lon: 78.3890, category: "Home Decor" },
    { id: 1508, name: "Decorative Vase", price: 799, vendor: "HomeStyle", image: "Decorative Vase.jpg", material: "Ceramic", color: "White", dimensions: "12 inches height", features: "Handcrafted, lead-free", otherImages: ["Decorative Vase1.jpg", "Decorative Vase2.jpg", "Decorative Vase3.jpg"], lat: 17.4520, lon: 78.3870, category: "Home Decor" },
    { id: 1509, name: "Tool Kit", price: 1999, vendor: "ToolTech", image: "Tool Kit.jpg", material: "Steel, Plastic", color: "Red/Black", dimensions: "12x8 inches", features: "100-piece set, durable case", otherImages: ["Tool Kit1.jpg", "Tool Kit2.jpg", "Tool Kit3.jpg"], lat: 17.4400, lon: 78.3850, category: "Home Decor" },
    { id: 1510, name: "Area Rug", price: 3499, vendor: "Decor Trends", image: "Area Rug.jpg", material: "Wool", color: "Grey", dimensions: "5x7 feet", features: "Anti-slip backing, stain resistant", otherImages: ["Area Rug1.jpg", "Area Rug2.jpg", "Area Rug3.jpg"], lat: 17.4490, lon: 78.3950, category: "Home Decor" },
    { id: 1511, name: "Curtain Set", price: 1799, vendor: "HomeStyle", image: "Curtain Set.jpg", material: "Polyester", color: "Beige", dimensions: "84 inches length", features: "Thermal insulation, easy care", otherImages: ["Curtain Set1.jpg", "Curtain Set2.jpg", "Curtain Set3.jpg"], lat: 17.4550, lon: 78.3920, category: "Home Decor" },
    { id: 1512, name: "Paint Roller Kit", price: 599, vendor: "ColorSplash", image: "Paint Roller Kit.jpg", material: "Foam, Plastic", color: "Blue", dimensions: "9 inches", features: "Lint-free, reusable", otherImages: ["Paint Roller Kit1.jpg", "Paint Roller Kit2.jpg", "Paint Roller Kit3.jpg"], lat: 17.4430, lon: 78.3860, category: "Home Decor" },
    { id: 1513, name: "Wall Clock", price: 1299, vendor: "Decor Trends", image: "Wall Clock.jpg", material: "Wood, Metal", color: "Brown", dimensions: "24 inches diameter", features: "Silent movement, antique style", otherImages: ["Wall Clock1.jpg", "Wall Clock2.jpg", "Wall Clock3.jpg"], lat: 17.4500, lon: 78.3840, category: "Home Decor" },
    { id: 1514, name: "Pendant Light", price: 2499, vendor: "LightHouse", image: "Pendant Light.jpg", material: "Metal", color: "Black", dimensions: "12 inches diameter", features: "Adjustable height, LED compatible", otherImages: ["Pendant Light1.jpg", "Pendant Light2.jpg", "Pendant Light3.jpg"], lat: 17.4470, lon: 78.3910, category: "Home Decor" },
    { id: 1515, name: "DIY Shelving Kit", price: 1999, vendor: "ToolTech", image: "DIY Shelving Kit.jpg", material: "Wood", color: "Natural", dimensions: "24x10 inches", features: "Easy assembly, adjustable shelves", otherImages: ["DIY Shelving Kit1.jpg", "DIY Shelving Kit2.jpg", "DIY Shelving Kit3.jpg"], lat: 17.4400, lon: 78.3850, category: "Home Decor" }
];

const HomeDecorProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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
        return allHomeDecorProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#homedecor-products" onClick={(e) => { e.preventDefault(); navigateTo('homedecor-products'); }} className="back-link">&larr; Back to Home Decor</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a
                href="#homedecor-products"
                onClick={(e) => { e.preventDefault(); navigateTo('homedecor-products'); }}
                className="back-link"
            >
                &larr; Back to Home Decor
            </a>
            
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
                        <p>A beautiful decor item to enhance the aesthetic of any room. Made with high-quality materials.</p>
                    </div>
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

export default HomeDecorProductDetail;
