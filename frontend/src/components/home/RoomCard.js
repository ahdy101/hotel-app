import React, { useEffect } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers, FaBed } from 'react-icons/fa';

const RoomCard = ({ room }) => {
  useEffect(() => {
    const token = localStorage.getItem('token'); // or however you store JWT

    fetch('http://localhost:5000/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: "Deluxe Suite",
        description: "Spacious suite with city view and king bed.",
        type: "suite",
        price: 250,
        capacity: 2,
        size: 40,
        amenities: ["Free WiFi", "Room Service"],
        discount: 10
      })
    })
    .then(res => res.json())
    .then(data => console.log(data));
  }, []);

  const getRoomImage = () => {
    if (room.images && room.images.length > 0) {
      return room.images[0].url;
    }
    // Fallback images based on room type
    const fallbackImages = {
      single: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400',
      double: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      suite: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      deluxe: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400'
    };
    return fallbackImages[room.type] || fallbackImages.single;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getDiscountedPrice = () => {
    if (room.discount > 0) {
      return room.price * (1 - room.discount / 100);
    }
    return room.price;
  };

  return (
    <Card className="room-card h-100">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={getRoomImage()} 
          alt={room.name}
          className="card-img-top"
        />
        {room.discount > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 end-0 m-2"
          >
            -{room.discount}% OFF
          </Badge>
        )}
        {room.featured && (
          <Badge 
            bg="warning" 
            className="position-absolute top-0 start-0 m-2"
          >
            Featured
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="primary" className="room-type me-2">
            {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
          </Badge>
          {room.averageRating > 0 && (
            <Badge bg="warning" className="text-dark">
              <FaStar className="me-1" />
              {room.averageRating}
            </Badge>
          )}
        </div>
        
        <Card.Title className="h5 mb-2">{room.name}</Card.Title>
        
        <Card.Text className="text-muted mb-3">
          {room.description.length > 100 
            ? `${room.description.substring(0, 100)}...` 
            : room.description
          }
        </Card.Text>
        
        <div className="room-features mb-3">
          <div className="d-flex align-items-center mb-2">
            <FaUsers className="text-primary me-2" />
            <small className="text-muted">
              Up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}
            </small>
          </div>
          {room.size && (
            <div className="d-flex align-items-center mb-2">
              <FaBed className="text-primary me-2" />
              <small className="text-muted">{room.size} m²</small>
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              {room.discount > 0 ? (
                <div>
                  <span className="room-price">{formatPrice(getDiscountedPrice())}</span>
                  <small className="text-muted text-decoration-line-through ms-2">
                    {formatPrice(room.price)}
                  </small>
                </div>
              ) : (
                <span className="room-price">{formatPrice(room.price)}</span>
              )}
              <small className="text-muted d-block">per night</small>
            </div>
            
            <Button 
              as={Link} 
              to={`/rooms/${room.id}`} 
              variant="outline-primary" 
              size="sm"
            >
              View Details
            </Button>
          </div>
          
          {room.isAvailable ? (
            <Button 
              as={Link} 
              to={`/rooms/${room.id}`} 
              variant="primary" 
              className="w-100"
            >
              Book Now
            </Button>
          ) : (
            <Button variant="secondary" className="w-100" disabled>
              Not Available
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;


