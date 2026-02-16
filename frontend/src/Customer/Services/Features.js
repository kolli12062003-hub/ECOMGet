import React from 'react';

const servicesData = [
  {
    icon: 'fas fa-truck',
    title: 'Fast Delivery',
    description: 'Get your orders delivered to your doorstep within hours',
  },
  {
    icon: 'fas fa-store',
    title: 'Pickup Service',
    description: 'Order online and pick up from the store at your convenience',
  },
  {
    icon: 'fas fa-headset',
    title: '24/7 Support',
    description: 'Our customer support team is always ready to help you',
  },
];

const Features = () => {
  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
        </div>
        <div className="service-grid">
          {servicesData.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;