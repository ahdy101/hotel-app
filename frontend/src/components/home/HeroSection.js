import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HeroSection = ({ 
  title = 'Welcome to Ailhsan Metro Hotel',
  subtitle = 'Experience luxury and comfort in the heart of Kaduna',
  description = 'Your perfect destination for business and leisure stays'
}) => {
  return (
    <div 
      style={{
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}
    >
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h1 className="display-3 fw-bold mb-4" style={{ color: '#fff' }}>
              {title}
            </h1>
            <p className="lead mb-4" style={{ color: '#fff' }}>
              {subtitle}
            </p>
            <p className="mb-5" style={{ color: '#fff' }}>
              {description}
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Button as={Link} to="/contact" variant="primary" size="lg">
                Book Now
              </Button>
              <Button as={Link} to="/about" variant="outline-light" size="lg">
                Learn More
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;


