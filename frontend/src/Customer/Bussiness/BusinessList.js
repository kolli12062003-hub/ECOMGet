import React from 'react';
import BusinessCard from './BusinessCard';


// Mock data based on your add1.html
const businessesData = [
  { name: 'Green Cafe', category: 'Restaurant • Healthy Food', distance: '1.2 km away', coverImage: '/IMAGES/Green Cafe.jpg', logoImage: '/IMAGES/Green Cafe.jpg', storeLink: '#' },
  { name: 'AutoCare Center', category: 'Automotive • Repairs', distance: '2.5 km away', coverImage: '/IMAGES/AutoCare Center.jpg', logoImage: '/IMAGES/AutoCare Center.jpg', storeLink: '#' },
  { name: 'HealthPlus Pharmacy', category: 'Pharmacy • Health Products', distance: '0.8 km away', coverImage: '/IMAGES/healthplus pharmacy.jpg', logoImage: '/IMAGES/healthplus pharmacy.jpg', storeLink: '#' },
  { name: 'Sparkle Jewellers', category: 'Jewellery • Accessories', distance: '1.5 km away', coverImage: '/IMAGES/Sparkle Jewellers.jpg', logoImage: '/IMAGES/Sparkle Jewellers.jpg', storeLink: '#' },
  { name: 'Fashion Hub', category: 'Clothing • Accessories', distance: '0.9 km away', coverImage: '/IMAGES/Fashion Hub.jpg', logoImage: '/IMAGES/Fashion Hub.jpg', storeLink: '#' },
  { name: "Beauty Palace", category: "Cosmetics • Skincare", distance: "1.8 km away", coverImage: "/IMAGES/Beauty Palace.jpg", logoImage: "/IMAGES/Beauty Palace.jpg", storeLink: "#" },
];

const BusinessList = () => {
  return (
    <section className="section businesses" id="businesses">
      <div className="container">
        <div className="section-title">
          <h2>Featured Businesses</h2>
        </div>
        <div className="business-grid">
          {businessesData.map((business, index) => (
            <BusinessCard
              key={index}
              business={business}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessList;