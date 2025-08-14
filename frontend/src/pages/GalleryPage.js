import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Badge } from 'react-bootstrap';
import { FaSearch, FaBed, FaUtensils, FaBuilding } from 'react-icons/fa';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Photos', icon: <FaSearch /> },
    { id: 'rooms', name: 'Rooms & Suites', icon: <FaBed /> },
    { id: 'facilities', name: 'Facilities', icon: <FaBuilding /> },
    { id: 'dining', name: 'Restaurant & Bar', icon: <FaUtensils /> }
  ];

  const galleryImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      alt: 'Deluxe Single Room',
      category: 'rooms',
      title: 'Deluxe Single Room',
      description: 'Comfortable single room with modern amenities'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      alt: 'Deluxe Double Room',
      category: 'rooms',
      title: 'Deluxe Double Room',
      description: 'Spacious double room with balcony'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      alt: 'Executive Suite',
      category: 'rooms',
      title: 'Executive Suite',
      description: 'Luxurious suite with living area'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      alt: 'Hotel Lobby',
      category: 'facilities',
      title: 'Grand Lobby',
      description: 'Elegant lobby with concierge service'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      alt: 'Restaurant',
      category: 'dining',
      title: 'Main Restaurant',
      description: 'Elegant restaurant serving international cuisine'
    }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

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
          <h1 className="display-4 fw-bold mb-4">Hotel Gallery</h1>
          <p className="lead mb-0">Explore our luxurious accommodations and facilities</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Category Filter */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="mb-2"
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Gallery Grid */}
        <Row>
          {filteredImages.map((image) => (
            <Col key={image.id} lg={4} md={6} className="mb-4">
              <Card 
                className="border-0 shadow-sm h-100"
                onClick={() => setSelectedImage(image)}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Card.Img 
                  variant="top" 
                  src={image.src} 
                  alt={image.alt}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <h5 className="fw-bold mb-2">{image.title}</h5>
                  <p className="text-muted mb-2">{image.description}</p>
                  <Badge bg="primary">{categories.find(c => c.id === image.category)?.name}</Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Image Counter */}
        <Row className="mt-4">
          <Col className="text-center">
            <p className="text-muted">
              Showing {filteredImages.length} of {galleryImages.length} photos
            </p>
          </Col>
        </Row>
      </Container>

      {/* Image Modal */}
      <Modal
        show={selectedImage !== null}
        onHide={() => setSelectedImage(null)}
        size="lg"
        centered
      >
        {selectedImage && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedImage.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt}
                className="img-fluid w-100"
                style={{ maxHeight: '70vh', objectFit: 'cover' }}
              />
            </Modal.Body>
            <Modal.Footer>
              <p className="text-muted mb-0">{selectedImage.description}</p>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default GalleryPage;


