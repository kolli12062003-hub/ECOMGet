import React from 'react';
import './Footer.css';

const Footer = ({ navigateTo }) => {
    const currentYear = new Date().getFullYear();

    const handleNavigation = (page) => {
        navigateTo(page);
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>ShopNest</h3>
                        <p>Your one-stop multi-vendor e-commerce solution. Shop from local businesses with delivery or pickup options.</p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><button onClick={() => handleNavigation('home')}>Home</button></li>
                                <li><button onClick={() => handleNavigation('categories')}>Products</button></li>
                                <li><button onClick={() => handleNavigation('services')}>Services</button></li>
                                <li><button onClick={() => handleNavigation('businesses')}>Businesses</button></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Customer Support</h4>
                            <ul>
                                <li><button onClick={() => handleNavigation('help')}>Help Center</button></li>
                                <li><button onClick={() => handleNavigation('faqs')}>FAQs</button></li>
                                <li><button onClick={() => handleNavigation('contact')}>Contact Us</button></li>
                                <li><button onClick={() => handleNavigation('returns')}>Return Policy</button></li>
                                <li><button onClick={() => handleNavigation('privacy')}>Privacy Policy</button></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Contact Info</h4>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>123 Market St, City, Country</span>
                                </div>
                                <div className="contact-item">
                                    <i className="fas fa-phone"></i>
                                    <span>+1 234 567 8900</span>
                                </div>
                                <div className="contact-item">
                                    <i className="fas fa-envelope"></i>
                                    <span>support@shopnest.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; {currentYear} ShopNest. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <button onClick={() => handleNavigation('terms')}>Terms of Service</button>
                            <span>|</span>
                            <button onClick={() => handleNavigation('privacy')}>Privacy Policy</button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;