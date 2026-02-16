import React from 'react';
import { useProductCategory } from '../Jewllery/useProductCategory';
import GroceryCard from './GroceryCard';
import './Grocery.css';

const Grocery = ({ wishlistItems, onAddToCart, onToggleWishlist, onViewProduct, cartItems, navigateTo, searchQuery }) => {
    const { filteredProducts, loading, error } = useProductCategory('Grocery', searchQuery);

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => (item._id || item.id) === productId);
    };

    return (
        <section id="groceries" className="section">
            <div className="container">
                <div className="section-title">
                    <h2>Groceries</h2>
                </div>
                {loading ? (
                    <p>Loading groceries...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    filteredProducts.length > 0 ? (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <GroceryCard
                                    key={product._id || product.id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={onToggleWishlist}
                                    onViewProduct={onViewProduct}
                                    isWishlisted={isProductInWishlist(product._id || product.id)}
                                    cartItems={cartItems}
                                    navigateTo={navigateTo}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-category-message">
                            No groceries found. Please check back later!
                        </p>
                    )
                )}
            </div>
        </section>
    );
};

export default Grocery;