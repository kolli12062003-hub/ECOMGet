import React, { useState, useEffect, useMemo } from 'react';
import './BookProductDetail.css';

export const allBookProducts = [
    { id: 401, name: "The Great Gatsby", price: 499, vendor: "Classic Reads", image: "The Great Gatsby.jpg", author: "F. Scott Fitzgerald", genre: "Classic", publisher: "Scribner", pages: 180, otherImages: ["The Great Gatsby1.jpg", "The Great Gatsby2.jpg", "The Great Gatsby3.jpg"], lat: 17.4486, lon: 78.3908, category: "Books" },
    { id: 402, name: "1984", price: 399, vendor: "Dystopian Books", image: "1984.jpg", author: "George Orwell", genre: "Dystopian", publisher: "Signet Classics", pages: 328, otherImages: ["19841.jpg", "19842.jpg", "19843.jpg"], lat: 17.4512, lon: 78.3855, category: "Books" },
    { id: 403, name: "To Kill a Mockingbird", price: 449, vendor: "Literary Hub", image: "To Kill a Mockingbird.jpg", author: "Harper Lee", genre: "Classic", publisher: "Harper Perennial Modern Classics", pages: 324, otherImages: ["To Kill a Mockingbird1.jpg", "To Kill a Mockingbird2.jpg", "To Kill a Mockingbird3.jpg"], lat: 17.4421, lon: 78.3882, category: "Books" },
    { id: 404, name: "Pride and Prejudice", price: 349, vendor: "Classic Reads", image: "Pride and Prejudice.jpg", author: "Jane Austen", genre: "Romance", publisher: "Modern Library", pages: 432, otherImages: ["Pride and Prejudice1.jpg", "Pride and Prejudice2.jpg", "Pride and Prejudice3.jpg"], lat: 17.4550, lon: 78.3920, category: "Books" },
    { id: 405, name: "The Catcher in the Rye", price: 429, vendor: "Modern Classics", image: "The Catcher in the Rye.jpg", author: "J.D. Salinger", genre: "Fiction", publisher: "Little, Brown and Company", pages: 224, otherImages: ["The Catcher in the Rye1.jpg", "The Catcher in the Rye2.jpg", "The Catcher in the Rye3.jpg"], lat: 17.4399, lon: 78.4421, category: "Books" },
    { id: 406, name: "Sapiens", price: 599, vendor: "Non-Fiction Books", image: "Sapiens.jpg", author: "Yuval Noah Harari", genre: "Non-Fiction", publisher: "Harper", pages: 443, otherImages: ["Sapiens1.jpg", "Sapiens2.jpg", "Sapiens3.jpg"], lat: 17.4455, lon: 78.3800, category: "Books" },
    { id: 407, name: "The Hobbit", price: 499, vendor: "Fantasy Reads", image: "The Hobbit.jpg", author: "J.R.R. Tolkien", genre: "Fantasy", publisher: "Houghton Mifflin Harcourt", pages: 310, otherImages: ["The Hobbit1.jpg", "The Hobbit2.jpg", "The Hobbit3.jpg"], lat: 17.4480, lon: 78.3890, category: "Books" },
    { id: 408, name: "Becoming", price: 699, vendor: "Memoir Books", image: "Becoming.jpg", author: "Michelle Obama", genre: "Memoir", publisher: "Crown", pages: 426, otherImages: ["Becoming1.jpg", "Becoming2.jpg", "Becoming3.jpg"], lat: 17.4520, lon: 78.3870, category: "Books" },
    { id: 409, name: "Dune", price: 549, vendor: "Sci-Fi Books", image: "Dune.jpg", author: "Frank Herbert", genre: "Sci-Fi", publisher: "Ace Books", pages: 412, otherImages: ["Dune1.jpg", "Dune2.jpg", "Dune3.jpg"], lat: 17.4400, lon: 78.3850, category: "Books" },
    { id: 410, name: "Atomic Habits", price: 649, vendor: "Self-Help Books", image: "Atomic Habits.jpg", author: "James Clear", genre: "Self-Help", publisher: "Avery", pages: 320, otherImages: ["Atomic Habits1.jpg", "Atomic Habits2.jpg", "Atomic Habits3.jpg"], lat: 17.4490, lon: 78.3950, category: "Books" },
    { id: 411, name: "The Alchemist", price: 399, vendor: "Fiction Hub", image: "The Alchemist.jpg", author: "Paulo Coelho", genre: "Fantasy", publisher: "HarperOne", pages: 208, otherImages: ["The Alchemist1.jpg", "The Alchemist2.jpg", "The Alchemist3.jpg"], lat: 17.4550, lon: 78.3920, category: "Books" },
    { id: 412, name: "Educated", price: 599, vendor: "Memoir Books", image: "Educated.jpg", author: "Tara Westover", genre: "Memoir", publisher: "Random House", pages: 352, otherImages: ["Educated1.jpg", "Educated2.jpg", "Educated3.jpg"], lat: 17.4430, lon: 78.3860, category: "Books" },
    { id: 413, name: "Harry Potter", price: 799, vendor: "Fantasy Reads", image: "Harry Potter.jpg", author: "J.K. Rowling", genre: "Fantasy", publisher: "Scholastic", pages: 309, otherImages: ["Harry Potter1.jpg", "Harry Potter2.jpg", "Harry Potter3.jpg"], lat: 17.4500, lon: 78.3840, category: "Books" },
    { id: 414, name: "Thinking, Fast and Slow", price: 649, vendor: "Non-Fiction Books", image: "Thinking, Fast and Slow.jpg", author: "Daniel Kahneman", genre: "Psychology", publisher: "Farrar, Straus and Giroux", pages: 499, otherImages: ["Thinking, Fast and Slow1.jpg", "Thinking, Fast and Slow2.jpg", "Thinking, Fast and Slow3.jpg"], lat: 17.4470, lon: 78.3910, category: "Books" },
    { id: 415, name: "The Shining", price: 499, vendor: "Horror Books", image: "The Shining.jpg", author: "Stephen King", genre: "Horror", publisher: "Doubleday", pages: 447, otherImages: ["The Shining1.jpg", "The Shining2.jpg", "The Shining3.jpg"], lat: 17.4400, lon: 78.3850, category: "Books" }
];

const BookProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
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

    useEffect(() => {
        if (product) {
            setMainImage(getImageSrc(product.image));
            console.log('🔍 BookProductDetail - Rendering product:', product.name);
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
        const sameGenre = allBookProducts.filter(p => p.id !== product.id && p.genre === product.genre);
        if (sameGenre.length >= 4) {
            return sameGenre.sort(() => 0.5 - Math.random()).slice(0, 4);
        }
        const otherBooks = allBookProducts.filter(p => p.id !== product.id && p.genre !== product.genre);
        const combined = [...sameGenre, ...otherBooks].sort(() => 0.5 - Math.random());
        return combined.slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#books-products" onClick={(e) => { e.preventDefault(); navigateTo('books-products'); }} className="back-link">&larr; Back to Books Products</a>
            </div>
        );
    }

    return (
        <div className="container">
            <a href="#books-products" onClick={(e) => { e.preventDefault(); navigateTo('books-products'); }} className="back-link">&larr; Back to Books Products</a>
            
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
                        <p>{product.description || 'A captivating book that will transport you to another world. A must-read for all book lovers.'}</p>
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
                            <div className="spec-item"><strong>Author</strong><span>{product.author || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Genre</strong><span>{product.genre || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Publisher</strong><span>{product.publisher || 'N/A'}</span></div>
                            <div className="spec-item"><strong>Pages</strong><span>{product.pages || 'N/A'}</span></div>
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

export default BookProductDetail;