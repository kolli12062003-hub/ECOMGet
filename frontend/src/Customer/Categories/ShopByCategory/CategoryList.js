import React, { useState } from 'react';
import CategoryCard from './CategoryCard';
import { categoriesData } from './data';
import './CategoryList.css';

// Mock data based on your add1.html
const categoriesWithDetails = [
    { name: "Food & Dining", description: "Restaurants, cafes and more", image: "/IMAGES/food and dine.jpg" },
    { name: "Medicines", description: "Pharmacies and health products", image: "/IMAGES/medicine.jpg" },
    { name: "Automotive", description: "Mechanics and car services", image: "/IMAGES/automative.jpg" },
    { name: "General Business", description: "All business categories", image: "/IMAGES/grocery.jpeg" },
    { name: "Jewellery", description: "Rings, necklaces and accessories", image: "/IMAGES/jewellaery.jpg" },
    { name: "Clothing", description: "Fashion for men and women", image: "/IMAGES/cloth.jpg" },
    { name: "Beauty Products", description: "Cosmetics and skincare", image: "/IMAGES/beauty products.jpg" },
    { name: "Footwear", description: "Shoes, sandals, and sneakers", image: "/IMAGES/footwear.jpg" },
    { name: "Grocery", description: "Daily essentials and pantry items", image: "/IMAGES/grocery.jpeg" },
    { name: "Fruits", description: "Fresh fruits and organic produce", image: "/IMAGES/fruit.jpg" },
    { name: "Books", description: "Novels, textbooks, and more", image: "/IMAGES/book.jpg" },
    { name: "Pet Food", description: "Nutrition for your pets", image: "/IMAGES/petfood.jpg" },
    { name: "Musical Instruments", description: "Guitars, pianos, and accessories", image: "/IMAGES/music.jpg" },
    { name: "Home Furniture", description: "Sofas, tables, and home essentials", image: "/IMAGES/furniture.jpg" },
    { name: "Bags", description: "Backpacks, handbags, and luggage", image: "/IMAGES/bag.jpg" },
    { name: "Kitchen Products", description: "Cookware and kitchen gadgets", image: "/IMAGES/kitchen.jpg" },
    { name: "Sports & Fitness", description: "Gym equipment and sportswear", image: "/IMAGES/sports.jpg" },
    { name: "Home Decor", description: "Decor items and home upgrades", image: "/IMAGES/decor.jpg" },
    { name: "Watches", description: "Stylish timepieces and smartwatches", image: "/IMAGES/watches.jpg" },
    { name: "Organic Veggies & Fruits", description: "Fresh veggies,fruits and organic produce", image: "/IMAGES/farmstyle.webp" },
];

const CategoryList = ({ navigateTo, initialSection = null }) => {
  const [activeSection, setActiveSection] = useState(initialSection); // null means show main categories

  const handleCategoryNavigation = (categoryName) => {
    let pageToNavigate = '';

    // If in General Services, all categories go directly to products
    if (activeSection === 'general-services') {
        switch (categoryName) {
            case 'Food & Dining':
                pageToNavigate = 'food-products';
                break;
            case 'Medicines':
                pageToNavigate = 'medicines-products';
                break;
            case 'Automotive':
                pageToNavigate = 'automotive-products';
                break;
            case 'Services':
                pageToNavigate = 'services-products';
                break;
            case 'Jewellery':
                pageToNavigate = 'jewellery-products';
                break;
            case 'Clothing':
                pageToNavigate = 'clothes-products';
                break;
            case 'Beauty Products':
                pageToNavigate = 'beauty-products';
                break;
            case 'Footwear':
                pageToNavigate = 'footwear-products';
                break;
            case 'Groceries':
                pageToNavigate = 'groceries-products';
                break;
            case 'Fruits':
                pageToNavigate = 'fruits-products';
                break;
            case 'Books':
                pageToNavigate = 'books-products';
                break;
            case 'Pet Food':
                pageToNavigate = 'petfood-products';
                break;
            case 'Musical Instruments':
                pageToNavigate = 'musical-products';
                break;
            case 'Home Furniture':
                pageToNavigate = 'homefurniture-products';
                break;
            case 'Bags':
                pageToNavigate = 'bag-products';
                break;
            case 'Kitchen Products':
                pageToNavigate = 'kitchenproduct-products';
                break;
            case 'Sports & Fitness':
                pageToNavigate = 'sports-fitness-products';
                break;
            case 'Home Decor':
                pageToNavigate = 'homedecor-products';
                break;
            case 'Watches':
                pageToNavigate = 'watches-products';
                break;
            case 'Organic Veggies & Fruits':
                pageToNavigate = 'organic-products';
                break;
            default:
                pageToNavigate = categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '') + '-products';
                break;
        }
    } else {
        // General Business or other sections - show vendors first for specific categories
        switch (categoryName) {
            case 'Food & Dining':
                pageToNavigate = 'food'; // Show vendors first
                break;
            case 'Medicines':
                pageToNavigate = 'medicines'; // Show vendors first
                break;
            case 'Automotive':
                pageToNavigate = 'automotive'; // Show vendors first
                break;
            case 'Services':
                pageToNavigate = 'services'; // Show vendors first
                break;
            case 'Jewellery':
                pageToNavigate = 'jewellery'; // Show vendors first
                break;
            case 'Clothing':
                pageToNavigate = 'clothes'; // Show vendors first
                break;
            case 'Beauty Products':
                pageToNavigate = 'beauty'; // Show vendors first
                break;
            case 'Footwear':
                pageToNavigate = 'footwear'; // Show vendors first
                break;
            case 'Groceries':
                pageToNavigate = 'groceries'; // Show vendors first
                break;
            case 'Fruits':
                pageToNavigate = 'fruits'; // Show vendors first
                break;
            case 'Books':
                pageToNavigate = 'books'; // Show vendors first
                break;
            case 'Pet Food':
                pageToNavigate = 'petfood'; // Show vendors first
                break;
            case 'Musical Instruments':
                pageToNavigate = 'musical'; // Show vendors first
                break;
            case 'Home Furniture':
                pageToNavigate = 'homefurniture'; // Show vendors first
                break;
            case 'Bags':
                pageToNavigate = 'bag'; // Show vendors first
                break;
            case 'Kitchen Products':
                pageToNavigate = 'kitchenproduct'; // Show vendors first
                break;
            case 'Sports & Fitness':
                pageToNavigate = 'sports-fitness'; // Show vendors first
                break;
            case 'Home Decor':
                pageToNavigate = 'homedecor'; // Show vendors first
                break;
            case 'Watches':
                pageToNavigate = 'watches'; // Show vendors first
                break;
            case 'Organic Veggies & Fruits':
                pageToNavigate = 'organic'; // Show vendors first
                break;
            default:
                pageToNavigate = categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '');
                break;
        }
    }
    navigateTo(pageToNavigate);
  };

  const handleCategoryClick = (categoryName) => {
    handleCategoryNavigation(categoryName);
  };

  const handleMainCategoryClick = (section) => {
    setActiveSection(section);
  };

  const handleBackClick = () => {
    setActiveSection(null);
  };

  // All categories under General Business
  const generalBusinessCategories = categoriesData;

  // All categories under General Services
  const generalServicesCategories = [
    { name: "Food & Dining", description: "Restaurants, cafes and more", image: "/IMAGES/food and dine.jpg" },
    { name: "Medicines", description: "Pharmacies and health products", image: "/IMAGES/medicine.jpg" },
    { name: "Automotive", description: "Mechanics and car services", image: "/IMAGES/automative.jpg" },
    { name: "Services", description: "Professional services", image: "/IMAGES/serv.jpg" },
    { name: "Jewellery", description: "Rings, necklaces and accessories", image: "/IMAGES/jewellaery.jpg" },
    { name: "Clothing", description: "Fashion for men and women", image: "/IMAGES/cloth.jpg" },
    { name: "Beauty Products", description: "Cosmetics and skincare", image: "/IMAGES/beauty products.jpg" },
    { name: "Footwear", description: "Shoes, sandals, and sneakers", image: "/IMAGES/footwear.jpg" },
    { name: "Groceries", description: "Daily essentials and pantry items", image: "/IMAGES/grocery.jpeg" },
    { name: "Fruits", description: "Fresh fruits and organic produce", image: "/IMAGES/fruit.jpg" },
    { name: "Books", description: "Novels, textbooks, and more", image: "/IMAGES/book.jpg" },
    { name: "Pet Food", description: "Nutrition for your pets", image: "/IMAGES/petfood.jpg" },
    { name: "Musical Instruments", description: "Guitars, pianos, and accessories", image: "/IMAGES/music.jpg" },
    { name: "Home Furniture", description: "Sofas, tables, and home essentials", image: "/IMAGES/furniture.jpg" },
    { name: "Bags", description: "Backpacks, handbags, and luggage", image: "/IMAGES/bag.jpg" },
    { name: "Kitchen Products", description: "Cookware and kitchen gadgets", image: "/IMAGES/kitchen.jpg" },
    { name: "Sports & Fitness", description: "Gym equipment and sportswear", image: "/IMAGES/sports.jpg" },
    { name: "Home Decor", description: "Decor items and home upgrades", image: "/IMAGES/decor.jpg" },
    { name: "Watches", description: "Stylish timepieces and smartwatches", image: "/IMAGES/watches.jpg" },
    { name: "Organic Veggies & Fruits", description: "Fresh veggies,fruits and organic produce", image: "/IMAGES/farmstyle.webp" },
  ];

  // Main category data
  const mainCategories = [
    {
      name: "General Business",
      description: "All business categories",
      image: "/IMAGES/grocery.jpeg",
      section: 'general-business'
    },
    {
      name: "General Services",
      description: "All service categories",
      image: "/IMAGES/serv.jpg",
      section: 'general-services'
    }
  ];

  return (
    <section className="section categories" id="categories">
      <div className="container">
        <div className="section-title">
          <h2>Shop by Category</h2>
          {activeSection && (
            <button className="back-button" onClick={handleBackClick}>
              ← Back to Main Categories
            </button>
          )}
        </div>

        {/* Main Categories Grid */}
        {activeSection === null && (
          <div className="category-grid main-categories">
            {mainCategories.map(category => {
              return (
                <div
                  key={category.name}
                  className="category-card main-category-card"
                  style={{ backgroundImage: `url(${category.image})` }}
                  onClick={() => handleMainCategoryClick(category.section)}
                >
                  <img src={category.image} alt={category.name} />
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* General Business Section */}
        {activeSection === 'general-business' && (
          <div className="category-section">
            <h3>General Business</h3>
            <div className="category-grid">
              {generalBusinessCategories.map(category => {
                const details = categoriesWithDetails.find(c => c.name === category.name);
                return (
                  <CategoryCard
                    key={category.name}
                    category={{ ...category, ...details }}
                    onCategoryClick={handleCategoryClick}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* General Services Section */}
        {activeSection === 'general-services' && (
          <div className="category-section">
            <h3>General Services</h3>
            <div className="category-grid">
              {generalServicesCategories.map(category => {
                const details = categoriesWithDetails.find(c => c.name === category.name);
                return (
                  <CategoryCard
                    key={category.name}
                    category={{ ...category, ...details }}
                    onCategoryClick={handleCategoryClick}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryList;