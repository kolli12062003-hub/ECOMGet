import React, { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    image: '/IMAGES/41628-4-groceries-hd-image-free-png.png',
    alt: 'Shopping Experience',
    title: 'Fresh Grocery Delivered',
    desc: 'Get fresh produce and daily essentials delivered to your doorstep',
    buttonText: 'Shop Grocery',
    link: '#categories',
  },
  {
    image: '/IMAGES/pngtree-this-is-an-animation-showing-a-grocery-store-image_2617237.jpg',
    alt: 'Fresh Products',
    title: 'Local Businesses Near You',
    desc: 'Support local vendors and discover unique products in your area',
    buttonText: 'Explore Businesses',
    link: '#businesses',
  },
  {
    image: '/IMAGES/grocery-hd-k-wallpaper-stock-photographic-image-ai-generated-images-bring-plethora-benefits-to-life-offering-boundless-285786385.webp',
    alt: 'Local Businesses',
    title: 'Fast & Reliable Delivery',
    desc: 'Quick delivery services with real-time tracking',
    buttonText: 'Learn More',
    link: '#services',
  },
];

const HeroSlider = ({ navigateTo }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  const handleButtonClick = (e, link) => {
    e.preventDefault();
    if (link.startsWith('#')) {
      const sectionId = link.substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigateTo(link);
    }
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-carousel">
        <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div className="carousel-slide" key={index}>
              <img src={slide.image} alt={slide.alt} />
              <div className="carousel-content">
                <h2>{slide.title}</h2>
                <p>{slide.desc}</p>
                <a href={slide.link} className="btn hero-btn" onClick={(e) => handleButtonClick(e, slide.link)}>{slide.buttonText}</a>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-nav carousel-prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="carousel-nav carousel-next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`carousel-indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;