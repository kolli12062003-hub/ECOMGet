import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onCategoryClick }) => {
  const handleImageError = (e) => {
    e.target.src = `https://via.placeholder.com/250x150?text=${category.name.replace(/\s/g, '+')}`;
  };

  return (
    <div className="category-card" data-category={category.name} onClick={() => onCategoryClick(category.name)}>
      <div className="category-icon">
        <img 
          src={category.image || `https://via.placeholder.com/100x100?text=${category.name.replace(/\s/g, '+')}`} 
          alt={category.name} 
          onError={handleImageError}
        />
      </div>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </div>
  );
};

export default CategoryCard;