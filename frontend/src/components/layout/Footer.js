import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row className="py-4">
          {/* Hotel Info */}
          <Col lg={4} md={6} className="mb-4">
            <h5 className="text-white mb-3">Ailhsan Metro Hotel</h5>
            <p className="text-white mb-3">
              Experience luxury and comfort in the heart of the city. 
              Our hotel offers world-class amenities and exceptional service 
              for both business and leisure travelers.
            </p>
            <div className="social-links">
              <a href="#" className="social-link me-3">
                <FaFacebook />
              </a>
              <a href="#" className="social-link me-3">
                <FaTwitter />
              </a>
              <a href="#" className="social-link me-3">
                <FaInstagram />
              </a>
              <a href="#" className="social-link">
                <FaLinkedin />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/gallery" className="text-white text-decoration-none">
                  Gallery
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>

          {/* Services */}
          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-white mb-3">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">
                  Room Booking
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">
                  Conference Rooms
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">
                  Restaurant
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={4} md={6} className="mb-4">
            <h6 className="text-white mb-3">Contact Information</h6>
            <div className="contact-info">
              <div className="d-flex align-items-center mb-3">
                <FaMapMarkerAlt className="text-primary me-3" />
                <span className="text-white">
                Plot B12/B14, Mogadishu city centre, behind Ahmadu bello way, Sabon Gari, Nasarawa , Kaduna<br />
                  Nigeria, 800221
                </span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <FaPhone className="text-primary me-3" />
                <span className="text-white">+234 911 601 2520</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <FaEnvelope className="text-primary me-3" />
                <span className="text-white">info@ailhsanhotel.com</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <Row className="border-top border-secondary pt-3">
          <Col md={6} className="text-center text-md-start">
            <p className="text-white mb-0">
              © {currentYear} Ailhsan Metro Hotel. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="text-white mb-0">
              <Link to="/privacy" className="text-white text-decoration-none me-3">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white text-decoration-none">
                Terms of Service
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;