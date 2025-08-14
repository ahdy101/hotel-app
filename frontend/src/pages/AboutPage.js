import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaHotel, FaStar, FaUsers, FaAward, FaHeart, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const AboutPage = () => {
  const stats = [
    { icon: <FaHotel />, number: '50+', label: 'Luxury Rooms' },
    { icon: <FaStar />, number: '4.8', label: 'Guest Rating' },
    { icon: <FaUsers />, number: '10K+', label: 'Happy Guests' },
    { icon: <FaAward />, number: '15+', label: 'Years Experience' }
  ];

  const amenities = [
    'Free WiFi', 'Restaurant & Bar', 'Conference Rooms', 'Fitness Center',
    'Room Service', 'Free Parking', 'Airport Shuttle', 'Business Center',
    'Laundry Service', 'Child Care', '24/7 Front Desk', 'Security Service'
  ];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <Container>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#fff' }}>About Ailhsan Metro Hotel</h1>
          <p className="lead mb-0" style={{ color: '#fff' }}>Where luxury meets comfort in the heart of Kaduna</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Stats Section */}
        <Row className="mb-5">
          {stats.map((stat, index) => (
            <Col key={index} md={3} className="text-center mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="py-4">
                  <div className="text-primary mb-3" style={{ fontSize: '2rem' }}>
                    {stat.icon}
                  </div>
                  <h3 className="fw-bold text-primary mb-2">{stat.number}</h3>
                  <p className="text-muted mb-0">{stat.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Story Section */}
        <Row className="mb-5">
          <Col lg={6} className="mb-4">
            <h2 className="fw-bold mb-4">Our Story</h2>
            <p className="lead text-muted mb-4">
              Founded in 2008, Ailhsan Metro Hotel has been a beacon of hospitality excellence in the heart of Kaduna.
            </p>
            <p>
              What started as a small boutique hotel has grown into one of the most prestigious accommodations in the region. 
              Our journey began with a simple vision: to create a space where guests feel not just welcomed, but truly at home.
            </p>
            <p>
              Over the years, we've expanded our facilities, enhanced our services, and built lasting relationships with 
              thousands of satisfied guests. Our commitment to excellence has earned us numerous awards and recognition 
              in the hospitality industry.
            </p>
            <p>
              Today, we continue to innovate and improve, always keeping our guests' comfort and satisfaction as our top priority.
            </p>
          </Col>
          <Col lg={6}>
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600" 
              alt="Hotel Lobby" 
              className="img-fluid rounded shadow"
            />
          </Col>
        </Row>

        {/* Mission & Values */}
        <Row className="mb-5">
          <Col lg={6} className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600" 
              alt="Hotel Service" 
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col lg={6}>
            <h2 className="fw-bold mb-4">Our Mission & Values</h2>
            <div className="mb-4">
              <h5 className="text-primary mb-3">
                <FaHeart className="me-2" />
                Our Mission
              </h5>
              <p>
                To provide exceptional hospitality experiences that exceed expectations, creating memorable stays 
                for every guest through personalized service, luxurious accommodations, and attention to detail.
              </p>
            </div>
            <div className="mb-4">
              <h5 className="text-primary mb-3">Our Values</h5>
              <ul className="list-unstyled">
                <li className="mb-2">✓ <strong>Excellence:</strong> Striving for perfection in everything we do</li>
                <li className="mb-2">✓ <strong>Hospitality:</strong> Treating every guest like family</li>
                <li className="mb-2">✓ <strong>Integrity:</strong> Operating with honesty and transparency</li>
                <li className="mb-2">✓ <strong>Innovation:</strong> Continuously improving our services</li>
                <li className="mb-2">✓ <strong>Sustainability:</strong> Caring for our environment and community</li>
              </ul>
            </div>
          </Col>
        </Row>

        {/* Amenities */}
        <Row className="mb-5">
          <Col>
            <h2 className="fw-bold text-center mb-5">Our Amenities</h2>
            <Row>
              {amenities.map((amenity, index) => (
                <Col key={index} md={4} lg={3} className="mb-3">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center py-3">
                      <Badge bg="primary" className="mb-2">{amenity}</Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        {/* Contact Info */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <h3 className="fw-bold text-center mb-4">Get in Touch</h3>
                <Row>
                  <Col md={4} className="text-center mb-4">
                    <FaMapMarkerAlt className="text-primary mb-3" style={{ fontSize: '2rem' }} />
                    <h5>Location</h5>
                    <p className="text-muted">Plot B12/B14, Mogadishu city centre<br />Behind Ahmadu Bello way, Sabon Gari<br />Nasarawa 800221, Kaduna, Nigeria</p>
                  </Col>
                  <Col md={4} className="text-center mb-4">
                    <FaPhone className="text-primary mb-3" style={{ fontSize: '2rem' }} />
                    <h5>Phone</h5>
                    <p className="text-muted">+234 911 601 2520</p>
                  </Col>
                  <Col md={4} className="text-center mb-4">
                    <FaEnvelope className="text-primary mb-3" style={{ fontSize: '2rem' }} />
                    <h5>Email</h5>
                    <p className="text-muted">info@ailhsanhotel.com<br />reservations@ailhsanhotel.com</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;


