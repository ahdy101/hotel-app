import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal, Alert, Nav, Tab } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSave, FaUser, FaCalendar, FaStar } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  
  // Form states
  const [bookingForm, setBookingForm] = useState({
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });
  
  const [reviewForm, setReviewForm] = useState({
    roomId: '',
    rating: 5,
    comment: ''
  });
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchData();
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, reviewsRes, roomsRes] = await Promise.all([
        axios.get('/api/bookings/my-bookings'),
        axios.get('/api/reviews/my-reviews'),
        axios.get('/api/rooms')
      ]);

      // Log responses for debugging
      console.log('Bookings:', bookingsRes.data);
      console.log('Reviews:', reviewsRes.data);
      console.log('Rooms:', roomsRes.data);

      setBookings(Array.isArray(bookingsRes.data.bookings) ? bookingsRes.data.bookings : []);
      setReviews(Array.isArray(reviewsRes.data.reviews) ? reviewsRes.data.reviews : []);
      setRooms(Array.isArray(roomsRes.data.rooms) ? roomsRes.data.rooms : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const room = rooms.find(r => r.id == bookingForm.roomId);
      const checkIn = new Date(bookingForm.checkInDate);
      const checkOut = new Date(bookingForm.checkOutDate);
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const totalAmount = room.price * days;

      await axios.post('/api/bookings', {
        ...bookingForm,
        totalAmount
      });
      
      setShowBookingModal(false);
      setBookingForm({
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        specialRequests: ''
      });
      fetchData();
    } catch (error) {
      setError('Failed to create booking');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedReview) {
        await axios.put(`/api/reviews/${selectedReview.id}`, reviewForm);
      } else {
        await axios.post('/api/reviews', reviewForm);
      }
      
      setShowReviewModal(false);
      setSelectedReview(null);
      setReviewForm({
        roomId: '',
        rating: 5,
        comment: ''
      });
      fetchData();
    } catch (error) {
      setError('Failed to save review');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      const updateData = {
        name: profileForm.name,
        email: profileForm.email
      };

      if (profileForm.newPassword) {
        updateData.currentPassword = profileForm.currentPassword;
        updateData.newPassword = profileForm.newPassword;
      }

      await axios.put('/api/auth/profile', updateData);
      updateUser({ ...user, name: profileForm.name, email: profileForm.email });
      
      setShowProfileModal(false);
      setProfileForm({
        name: profileForm.name,
        email: profileForm.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`/api/bookings/${bookingId}`, { status: 'cancelled' });
        fetchData();
      } catch (error) {
        setError('Failed to cancel booking');
      }
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`/api/reviews/${reviewId}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete review');
      }
    }
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
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="fw-bold mb-3">My Dashboard</h1>
            <p className="text-muted">Manage your bookings, reviews, and account</p>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row>
            <Col md={3}>
              <Card className="mb-4">
                <Card.Body className="p-0">
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="bookings" className="d-flex align-items-center">
                        <FaCalendar className="me-2" />
                        My Bookings
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="reviews" className="d-flex align-items-center">
                        <FaStar className="me-2" />
                        My Reviews
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="profile" className="d-flex align-items-center">
                        <FaUser className="me-2" />
                        Account Settings
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>

            <Col md={9}>
              <Tab.Content>
                {/* Bookings Tab */}
                <Tab.Pane eventKey="bookings">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">My Bookings</h5>
                      <Button variant="primary" size="sm" onClick={() => setShowBookingModal(true)}>
                        <FaPlus className="me-1" />
                        New Booking
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Room</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Guests</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id}>
                              <td>{booking.room?.name}</td>
                              <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                              <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                              <td>{booking.numberOfGuests}</td>
                              <td>₦{booking.totalAmount}</td>
                              <td>
                                <Badge bg={
                                  booking.status === 'approved' ? 'success' :
                                  booking.status === 'pending' ? 'warning' :
                                  booking.status === 'rejected' ? 'danger' : 'secondary'
                                }>
                                  {booking.status}
                                </Badge>
                              </td>
                              <td>
                                {booking.status === 'pending' && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => cancelBooking(booking.id)}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Reviews Tab */}
                <Tab.Pane eventKey="reviews">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">My Reviews</h5>
                      <Button variant="primary" size="sm" onClick={() => setShowReviewModal(true)}>
                        <FaPlus className="me-1" />
                        Write Review
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Room</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reviews.map((review) => (
                            <tr key={review.id}>
                              <td>{review.room?.name}</td>
                              <td>{'★'.repeat(review.rating)}</td>
                              <td>{review.comment}</td>
                              <td>
                                <Badge bg={
                                  review.status === 'approved' ? 'success' :
                                  review.status === 'pending' ? 'warning' : 'danger'
                                }>
                                  {review.status}
                                </Badge>
                              </td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setReviewForm({
                                      roomId: review.roomId,
                                      rating: review.rating,
                                      comment: review.comment
                                    });
                                    setShowReviewModal(true);
                                  }}
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteReview(review.id)}
                                >
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Profile Tab */}
                <Tab.Pane eventKey="profile">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Account Settings</h5>
                      <Button variant="primary" size="sm" onClick={() => setShowProfileModal(true)}>
                        <FaEdit className="me-1" />
                        Edit Profile
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <h6>Personal Information</h6>
                          <p><strong>Name:</strong> {user?.name}</p>
                          <p><strong>Email:</strong> {user?.email}</p>
                          <p><strong>Member since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
                        </Col>
                        <Col md={6}>
                          <h6>Account Statistics</h6>
                          <p><strong>Total Bookings:</strong> {bookings.length}</p>
                          <p><strong>Total Reviews:</strong> {reviews.length}</p>
                          <p><strong>Approved Reviews:</strong> {reviews.filter(r => r.status === 'approved').length}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

        {/* Booking Modal */}
        <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>New Booking</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleBookingSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Room</Form.Label>
                    <Form.Select
                      value={bookingForm.roomId}
                      onChange={(e) => setBookingForm({...bookingForm, roomId: e.target.value})}
                      required
                    >
                      <option value="">Select a room</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.name} - ₦{room.price}/night
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Number of Guests</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={bookingForm.numberOfGuests}
                      onChange={(e) => setBookingForm({...bookingForm, numberOfGuests: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Check-in Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={bookingForm.checkInDate}
                      onChange={(e) => setBookingForm({...bookingForm, checkInDate: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Check-out Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={bookingForm.checkOutDate}
                      onChange={(e) => setBookingForm({...bookingForm, checkOutDate: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Special Requests (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={bookingForm.specialRequests}
                  onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                  placeholder="Any special requests or requirements..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FaSave className="me-1" />
                Book Room
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Review Modal */}
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedReview ? 'Edit Review' : 'Write Review'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleReviewSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Room</Form.Label>
                <Form.Select
                  value={reviewForm.roomId}
                  onChange={(e) => setReviewForm({...reviewForm, roomId: e.target.value})}
                  required
                >
                  <option value="">Select a room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                  required
                >
                  <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ Very Good</option>
                  <option value={3}>⭐⭐⭐ Good</option>
                  <option value={2}>⭐⭐ Fair</option>
                  <option value={1}>⭐ Poor</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  placeholder="Share your experience..."
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FaSave className="me-1" />
                {selectedReview ? 'Update' : 'Submit'} Review
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Profile Modal */}
        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleProfileSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  required
                />
              </Form.Group>
              <hr />
              <h6>Change Password (Optional)</h6>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  value={profileForm.currentPassword}
                  onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={profileForm.confirmPassword}
                  onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FaSave className="me-1" />
                Update Profile
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default DashboardPage;


