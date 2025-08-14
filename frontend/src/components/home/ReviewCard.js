import React from 'react';
import { Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'text-warning' : 'text-muted'}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="review-card h-100">
      <Card.Body>
        <div className="review-rating mb-2">
          {renderStars(review.rating)}
        </div>
        
        <Card.Text className="mb-3">
          "{review.comment}"
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong className="review-author">{review.user?.name || 'Anonymous'}</strong>
            <div className="review-date">{formatDate(review.createdAt)}</div>
          </div>
          
          {review.room && (
            <small className="text-muted">
              {review.room.name}
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;


