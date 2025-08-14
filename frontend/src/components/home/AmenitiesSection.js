import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FaWifi, FaUtensils, FaUsers, FaConciergeBell, 
  FaParking, FaBriefcase, FaTshirt, FaClock
} from 'react-icons/fa';

const AmenitiesSection = ({ 
  title = 'Our Amenities',
  content = 'Free WiFi, Restaurant, Conference Rooms, Room Service, Free Parking, Business Center, Laundry Service, 24/7 Front Desk'
}) => {
  // Parse content string into array of amenities
  const amenitiesList = content.split(', ').map(item => item.trim());

  const amenityIcons = {
    'Free WiFi': FaWifi,
    'Restaurant': FaUtensils,
    'Conference Rooms': FaUsers,
    'Room Service': FaConciergeBell,
    'Free Parking': FaParking,
    'Business Center': FaBriefcase,
    'Laundry Service': FaTshirt,
    '24/7 Front Desk': FaClock,
  };

  return (
    <section className="py-5">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold mb-3">{title}</h2>
            <p className="lead text-muted">
              Everything you need for a comfortable and enjoyable stay
            </p>
          </Col>
        </Row>

        <Row>
          {amenitiesList.map((amenity, index) => {
            const IconComponent = amenityIcons[amenity] || FaWifi;
            return (
              <Col key={index} lg={3} md={4} sm={6} className="mb-4">
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="py-4">
                    <div className="text-primary mb-3" style={{ fontSize: '2rem' }}>
                      <IconComponent />
                    </div>
                    <h6 className="fw-bold mb-0">{amenity}</h6>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default AmenitiesSection;


