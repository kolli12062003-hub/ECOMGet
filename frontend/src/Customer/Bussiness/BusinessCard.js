import React from 'react';

const BusinessCard = ({ business }) => {
  return (
    <div className="business-card">
      <div className="business-header">
        <img src={business.coverImage} alt={business.name} className="business-cover" />
        <img src={business.logoImage} alt={`${business.name} Logo`} className="business-logo" />
      </div>
      <div className="business-info">
        <h3 className="business-name">{business.name}</h3>
        <div className="business-category">{business.category}</div>
        <div className="business-distance">
          <i className="fas fa-location-dot"></i> {business.distance}
        </div>
        <a href={business.storeLink} className="btn">View Store</a>
      </div>
    </div>
  );
};

export default BusinessCard;