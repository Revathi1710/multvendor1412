import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './footer.css'; // Create this CSS file to customize the footer styles if needed

const Footer = () => {
    return (
        <footer className="footer bg-dark text-light pt-5 pb-3">
            <div className="container">
                <div className="row">
                    {/* Customer Support Section */}
                    <div className="col-md-3 footerlist col-sm-6">
                        <h5>Customer Support</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/help-center" className="text-light">Help Center</Link></li>
                            <li><Link to="/user-guide" className="text-light">User Guide</Link></li>
                            <li><Link to="/return-policy" className="text-light">Return & Cancellation Policy</Link></li>
                            <li><Link to="/shipping-policy" className="text-light">Shipping & Delivery Policy</Link></li>
                        </ul>
                    </div>
                    {/* About Us Section */}
                    <div className="col-md-3 footerlist col-sm-6">
                        <h5>About Us</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/about-us" className="text-light">About Our Company</Link></li>
                            <li><Link to="/success-stories" className="text-light">Success Stories</Link></li>
                            <li><Link to="/blog" className="text-light">Aristostech India Blog</Link></li>
                            <li><Link to="/news" className="text-light">Aristostech in News</Link></li>
                         
                            <li><Link to="/contact-us" className="text-light">Contact Us</Link></li>
                            <li><Link to="/partner-with-us" className="text-light">Partner with Us</Link></li>
                            <li><Link to="/make-payment" className="text-light">Make a Payment</Link></li>
                            <li><Link to="/newsletter" className="text-light">Weekly Newsletter</Link></li>
                        </ul>
                    </div>
                    {/* Our Services Section */}
                    <div className="col-md-3  footerlist col-sm-6">
                        <h5>Our Services</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/advertise" className="text-light">Advertise with Us</Link></li>
                            <li><Link to="/book-domains" className="text-light">Book Domains</Link></li>
                           
                           
                        </ul>
                    </div>
                    {/* For Sellers and Buyers Section */}
                    <div className="col-md-3  footerlist col-sm-6">
                        <h5>For Sellers</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/display-products" className="text-light">Display New Products</Link></li>
                            <li><Link to="/buy-trade-leads" className="text-light">Buy Aristos Leads</Link></li>
                            <li><Link to="/subscribe-buy-alerts" className="text-light">Subscribe Buy Aristos Alerts</Link></li>
                        </ul>
                        <h5 className="mt-3">For Buyers</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/post-requirement" className="text-light">Post Your Requirement</Link></li>
                            <li><Link to="/browse-suppliers" className="text-light">Browse Suppliers</Link></li>
                          
                        </ul>
                    </div>
                    {/* Directory Section */}
                    <div className="col-md-3  footerlist col-sm-6">
                        <h5>Directory</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/manufacturers" className="text-light">Manufacturers</Link></li>
                            <li><Link to="/business-services" className="text-light">Business Services</Link></li>
                            <li><Link to="/service-providers" className="text-light">Service Providers</Link></li>
                            <li><Link to="/industry-hubs" className="text-light">Industry Hubs</Link></li>
                            <li><Link to="/country-suppliers" className="text-light">Country Suppliers</Link></li>
                            <li><Link to="/featured-products" className="text-light">Featured Products</Link></li>
                            <li><Link to="/sitemap" className="text-light">Sitemap</Link></li>
                        </ul>
                    </div>
                </div>
                <hr />
                <div className="text-center">
                    <p>&copy; 2008-2024 Aristostech India Private Limited. All rights reserved.</p>
                    <ul className="list-inline">
                        <li className="list-inline-item"><Link to="/privacy-policy" className="text-light">Privacy Policy</Link></li>
                        <li className="list-inline-item"><Link to="/terms-conditions" className="text-light">Terms & Conditions</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
