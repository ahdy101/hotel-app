import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HeroSection from '../components/home/HeroSection';
import AmenitiesSection from '../components/home/AmenitiesSection';

const HomePage = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await axios.get('/api/content/page/home');
      const contentMap = {};
      response.data.contents.forEach(item => {
        contentMap[item.section] = item;
      });
      setContent(contentMap);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch home content:', error);
      setLoading(false);
    }
  };

  // Default content if CMS content is not available
  const defaultContent = {
    hero: {
      title: 'Welcome to Ailhsan Metro Hotel',
      subtitle: 'Experience luxury and comfort in the heart of Kaduna',
      description: 'Your perfect destination for business and leisure stays'
    },
    about: {
      title: 'About Our Hotel',
      content: 'Located in the vibrant city of Kaduna, Ailhsan Metro Hotel offers world-class accommodations and exceptional service. Our hotel combines modern amenities with traditional hospitality to ensure your stay is memorable and comfortable.'
    },
    amenities: {
      title: 'Our Amenities',
      content: 'Free WiFi, Restaurant & Bar, Conference Rooms, Fitness Center, Room Service, Free Parking, Airport Shuttle, Business Center, Laundry Service, Child Care, 24/7 Front Desk, Security Service'
    },
    contact: {
      title: 'Contact Information',
      content: 'Plot B12/B14, Mogadishu city centre, Behind Ahmadu Bello way, Sabon Gari, Nasarawa 800221, Kaduna, Nigeria. Phone: +234 911 601 2520'
    }
  };

  const getContent = (section) => {
    return content[section] || defaultContent[section];
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Hero Section */}
      <HeroSection 
        title={getContent('hero').title}
        subtitle={getContent('hero').subtitle}
        description={getContent('hero').description}
      />

      {/* About Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4">
              <h2 className="fw-bold mb-4">{getContent('about').title}</h2>
              <p className="lead text-muted mb-4">
                {getContent('about').content}
              </p>
              <Button as={Link} to="/about" variant="primary" size="lg">
                Learn More About Us
              </Button>
            </Col>
            <Col lg={6}>
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600" 
                alt="Hotel Lobby" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Amenities Section */}
      <AmenitiesSection 
        title={getContent('amenities').title}
        content={getContent('amenities').content}
      />

      {/* Contact Info Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="fw-bold mb-4">{getContent('contact').title}</h2>
              <p className="lead mb-4 text-white">{getContent('contact').content}</p>
              <div className="d-flex justify-content-center gap-4">
                <div className="d-flex align-items-center">
                  <FaMapMarkerAlt className="me-2" />
                  <span>Plot B12/B14, Mogadishu city centre</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaPhone className="me-2" />
                  <span>+234 911 601 2520</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaEnvelope className="me-2" />
                  <span>info@ailhsanhotel.com</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="fw-bold mb-4">Ready to Book Your Stay?</h2>
              <p className="lead text-muted mb-4">
                Experience the perfect blend of luxury and comfort at Ailhsan Metro Hotel
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button as={Link} to="/contact" variant="primary" size="lg">
                  Contact Us
                </Button>
                <Button as={Link} to="/gallery" variant="outline-primary" size="lg">
                  View Gallery
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;


