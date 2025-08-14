import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal, Alert, Nav, Tab } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSave, FaUpload, FaImage, FaCalendar, FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [contents, setContents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [approvalItem, setApprovalItem] = useState(null);
  const [approvalType, setApprovalType] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  
  const [formData, setFormData] = useState({
    page: 'home',
    section: '',
    title: '',
    content: '',
    type: 'text',
    isPublished: true,
    order: 0
  });
  
  const [roomFormData, setRoomFormData] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    amenities: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contentsRes, roomsRes, bookingsRes, reviewsRes, imagesRes] = await Promise.all([
        axios.get('/api/content'),
        axios.get('/api/rooms'),
        axios.get('/api/bookings'),
        axios.get('/api/reviews'),
        axios.get('/api/images')
      ]);
      
      setContents(contentsRes.data.contents || []);
      setRooms(roomsRes.data.rooms || []);
      setBookings(bookingsRes.data.bookings || []);
      setReviews(reviewsRes.data.reviews || []);
      setImages(imagesRes.data.images || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await axios.put(`/api/content/${editingContent.id}`, formData);
      } else {
        await axios.post('/api/content', formData);
      }
      setShowModal(false);
      setEditingContent(null);
      setFormData({
        page: 'home',
        section: '',
        title: '',
        content: '',
        type: 'text',
        isPublished: true,
        order: 0
      });
      fetchData();
    } catch (error) {
      setError('Failed to save content');
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await axios.put(`/api/rooms/${editingRoom.id}`, roomFormData);
      } else {
        await axios.post('/api/rooms', roomFormData);
      }
      setShowModal(false);
      setEditingRoom(null);
      setRoomFormData({
        name: '',
        description: '',
        price: '',
        capacity: '',
        amenities: '',
        isAvailable: true
      });
      fetchData();
    } catch (error) {
      setError('Failed to save room');
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('roomId', roomFormData.roomId || '1');

    try {
      await axios.post('/api/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowImageModal(false);
      setSelectedFile(null);
      fetchData();
    } catch (error) {
      setError('Failed to upload image');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleApproval = async (e) => {
    e.preventDefault();
    try {
      const { id, type } = approvalItem;
      const status = approvalType === 'approve' ? 'approved' : 'rejected';
      
      if (type === 'booking') {
        await axios.put(`/api/bookings/${id}`, { status, adminNotes });
      } else if (type === 'review') {
        await axios.put(`/api/reviews/${id}/status`, { status, adminNotes });
      }
      
      setShowApprovalModal(false);
      setApprovalItem(null);
      setApprovalType('');
      setAdminNotes('');
      fetchData();
    } catch (error) {
      setError('Failed to update approval status');
    }
  };

  const openApprovalModal = (item, type) => {
    setApprovalItem(item);
    setApprovalType(type);
    setShowApprovalModal(true);
  };

  const deleteContent = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await axios.delete(`/api/content/${id}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete content');
      }
    }
  };

  const deleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`/api/rooms/${id}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete room');
      }
    }
  };

  const deleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`/api/images/${id}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete image');
      }
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`/api/bookings/${id}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete booking');
      }
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`/api/reviews/${id}`);
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
            <h1 className="fw-bold mb-3">Admin Dashboard</h1>
            <p className="text-muted">Manage your hotel content, rooms, bookings, and gallery</p>
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
                        Booking Management
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="reviews" className="d-flex align-items-center">
                        <FaImage className="me-2" />
                        Review Management
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="content" className="d-flex align-items-center">
                        <FaEdit className="me-2" />
                        Content Management
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="rooms" className="d-flex align-items-center">
                        <FaMoneyBillWave className="me-2" />
                        Rooms & Pricing
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="gallery" className="d-flex align-items-center">
                        <FaImage className="me-2" />
                        Gallery Management
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>

            <Col md={9}>
              <Tab.Content>
                {/* Booking Management Tab */}
                <Tab.Pane eventKey="bookings">
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">Booking Management</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Guest</th>
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
                              <td>{booking.user?.name || 'N/A'}</td>
                              <td>{booking.room?.name || 'N/A'}</td>
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
                                  <>
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      className="me-1"
                                      onClick={() => openApprovalModal(booking, 'approve')}
                                    >
                                      <FaCheck />
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      className="me-1"
                                      onClick={() => openApprovalModal(booking, 'reject')}
                                    >
                                      <FaTimes />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteBooking(booking.id)}
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

                {/* Review Management Tab */}
                <Tab.Pane eventKey="reviews">
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">Review Management</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>User</th>
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
                              <td>{review.user?.name || 'N/A'}</td>
                              <td>{review.room?.name || 'N/A'}</td>
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
                                {review.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      className="me-1"
                                      onClick={() => openApprovalModal(review, 'approve')}
                                    >
                                      <FaCheck />
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      className="me-1"
                                      onClick={() => openApprovalModal(review, 'reject')}
                                    >
                                      <FaTimes />
                                    </Button>
                                  </>
                                )}
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

                {/* Content Management Tab */}
                <Tab.Pane eventKey="content">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Content Management</h5>
                      <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                        <FaPlus className="me-1" />
                        Add Content
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Page</th>
                            <th>Section</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contents.map((content) => (
                            <tr key={content.id}>
                              <td>{content.page}</td>
                              <td>{content.section}</td>
                              <td>{content.title}</td>
                              <td>
                                <Badge bg={content.isPublished ? 'success' : 'warning'}>
                                  {content.isPublished ? 'Published' : 'Draft'}
                                </Badge>
                              </td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => {
                                    setEditingContent(content);
                                    setFormData(content);
                                    setShowModal(true);
                                  }}
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteContent(content.id)}
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

                {/* Rooms & Pricing Tab */}
                <Tab.Pane eventKey="rooms">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Rooms & Pricing</h5>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => {
                          setEditingRoom(null);
                          setRoomFormData({
                            name: '',
                            description: '',
                            price: '',
                            capacity: '',
                            amenities: '',
                            isAvailable: true
                          });
                          setShowModal(true);
                        }}
                      >
                        <FaPlus className="me-1" />
                        Add Room
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rooms.map((room) => (
                            <tr key={room.id}>
                              <td>{room.name}</td>
                              <td>₦{room.price}</td>
                              <td>{room.capacity} persons</td>
                              <td>
                                <Badge bg={room.isAvailable ? 'success' : 'danger'}>
                                  {room.isAvailable ? 'Available' : 'Unavailable'}
                                </Badge>
                              </td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => {
                                    setEditingRoom(room);
                                    setRoomFormData(room);
                                    setShowModal(true);
                                  }}
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteRoom(room.id)}
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

                {/* Gallery Management Tab */}
                <Tab.Pane eventKey="gallery">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Gallery Management</h5>
                      <Button variant="primary" size="sm" onClick={() => setShowImageModal(true)}>
                        <FaUpload className="me-1" />
                        Upload Image
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {images.map((image) => (
                          <Col key={image.id} md={4} className="mb-3">
                            <Card>
                              <Card.Img variant="top" src={image.url} style={{ height: '200px', objectFit: 'cover' }} />
                              <Card.Body>
                                <p className="text-muted small">{image.filename}</p>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteImage(image.id)}
                                >
                                  <FaTrash />
                                </Button>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

        {/* Content Modal */}
        <Modal show={showModal && activeTab === 'content'} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editingContent ? 'Edit Content' : 'Add Content'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleContentSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Page</Form.Label>
                    <Form.Select
                      value={formData.page}
                      onChange={(e) => setFormData({...formData, page: e.target.value})}
                      required
                    >
                      <option value="home">Home</option>
                      <option value="about">About</option>
                      <option value="contact">Contact</option>
                      <option value="gallery">Gallery</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Section</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.section}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                      placeholder="e.g., hero, about, amenities"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Content title"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Content text"
                  required
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="text">Text</option>
                      <option value="html">HTML</option>
                      <option value="json">JSON</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Published"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FaSave className="me-1" />
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Room Modal */}
        <Modal show={showModal && activeTab === 'rooms'} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editingRoom ? 'Edit Room' : 'Add Room'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleRoomSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Room Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={roomFormData.name}
                      onChange={(e) => setRoomFormData({...roomFormData, name: e.target.value})}
                      placeholder="e.g., Deluxe Single Room"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price (₦)</Form.Label>
                    <Form.Control
                      type="number"
                      value={roomFormData.price}
                      onChange={(e) => setRoomFormData({...roomFormData, price: e.target.value})}
                      placeholder="50000"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={roomFormData.description}
                  onChange={(e) => setRoomFormData({...roomFormData, description: e.target.value})}
                  placeholder="Room description"
                  required
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Capacity</Form.Label>
                    <Form.Control
                      type="number"
                      value={roomFormData.capacity}
                      onChange={(e) => setRoomFormData({...roomFormData, capacity: e.target.value})}
                      placeholder="2"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Amenities</Form.Label>
                    <Form.Control
                      type="text"
                      value={roomFormData.amenities}
                      onChange={(e) => setRoomFormData({...roomFormData, amenities: e.target.value})}
                      placeholder="WiFi, AC, TV, etc."
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Available"
                  checked={roomFormData.isAvailable}
                  onChange={(e) => setRoomFormData({...roomFormData, isAvailable: e.target.checked})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FaSave className="me-1" />
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Image Upload Modal */}
        <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Image</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleImageUpload}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Select Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Room (Optional)</Form.Label>
                <Form.Select
                  value={roomFormData.roomId || ''}
                  onChange={(e) => setRoomFormData({...roomFormData, roomId: e.target.value})}
                >
                  <option value="">No specific room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowImageModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={!selectedFile}>
                <FaUpload className="me-1" />
                Upload
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Approval Modal */}
        <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {approvalType === 'approve' ? 'Approve' : 'Reject'} {approvalItem?.type === 'booking' ? 'Booking' : 'Review'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleApproval}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Admin Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this decision..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </Button>
              <Button 
                variant={approvalType === 'approve' ? 'success' : 'danger'} 
                type="submit"
              >
                {approvalType === 'approve' ? <FaCheck className="me-1" /> : <FaTimes className="me-1" />}
                {approvalType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminDashboardPage;


