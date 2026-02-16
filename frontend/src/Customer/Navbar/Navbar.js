import React from 'react';

const Navbar = ({ navigateTo }) => {
  const categoriesData = [
    { name: 'Food & Dining' },
    { name: 'Medicines' },
    { name: 'Automotive' },
    { name: 'Services' },
    { name: 'Jewellery' },
    { name: 'Clothes' },
    { name: 'Beauty Products' },
    { name: 'Groceries' },
    { name: 'Fruits' },
    { name: 'Books' },
    { name: 'Petfood' },
    { name: 'Musical Instruments' },
    { name: 'Footwear' },
    { name: 'Home Furniture' },
    { name: 'Bags' },
    { name: 'Kitchen Products' },
    { name: 'Organic Veggies & Fruits' },
    { name: 'Sports & Fitness' },
    { name: 'Watches' },
    { name: 'Home Decor' },
  ];

  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (page === 'services') {
      navigateTo('home');
      const section = document.getElementById('services');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigateTo(page);
      // For sections on the home page, we might need to scroll
      if (page === 'home') {
        const sectionId = e.currentTarget.getAttribute('href').substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleCategoryNavigation = (categoryName) => {
    let pageToNavigate = '';

    switch (categoryName) {
        case 'Food & Dining':
            pageToNavigate = 'food';
            break;
        case 'Medicines':
            pageToNavigate = 'medicines';
            break;
        case 'Automotive':
            pageToNavigate = 'automotive';
            break;
        case 'Services':
            pageToNavigate = 'services';
            break;
        case 'Home Decor':
            pageToNavigate = 'homedecor';
            break;
        case 'Clothing':
            pageToNavigate = 'clothes';
            break;
        case 'Beauty Products':
            pageToNavigate = 'beauty';
            break;
        case 'Musical Instruments':
            pageToNavigate = 'musical';
            break;
        case 'Bags':
            pageToNavigate = 'bag';
            break;
        case 'Kitchen Products':
            pageToNavigate = 'kitchenproduct';
            break;
        case 'Organic Veggies & Fruits':
            pageToNavigate = 'organic';
            break;
        default:
            pageToNavigate = categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '');
            break;
    }
    navigateTo(pageToNavigate);
  };

  const handleCategoryLinkClick = (e, category) => {
    e.preventDefault();
    handleCategoryNavigation(category.name);
  };

  return (
    <nav>
      <div className="container">
        <ul className="nav-links">
          <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="nav-active"><i className="fas fa-home"></i> <span>Home</span></a></li>
          <li><a href="#products" onClick={(e) => handleNavClick(e, 'home')}><i className="fas fa-shopping-bag"></i> <span>Products</span></a></li>
          <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')}><i className="fas fa-tools"></i> <span>Services</span></a></li>
          <li><a href="#businesses" onClick={(e) => handleNavClick(e, 'home')}><i className="fas fa-store"></i> <span>Businesses</span></a></li>
          
          <li className="category-dropdown">
            <a className="category-dropdown-toggle"><i className="fas fa-list"></i> <span>Categories</span></a>
            <div className="category-dropdown-menu" id="category-dropdown-menu">
              {categoriesData.map(category => (
                <a
                  key={category.name}
                  data-category={category.name}
                  onClick={(e) => handleCategoryLinkClick(e, category)}>
                  {category.name}
                </a>
              ))}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;