import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Address',
      content: 'Plot B12/B14, Mogadishu city centre, Behind Ahmadu Bello way, Sabon Gari, Nasarawa 800221, Kaduna, Nigeria',
      link: 'https://maps.google.com'
    },
    {
      icon: <FaPhone />,
      title: 'Phone',
      content: '+234 911 601 2520',
      link: 'tel:+2349116012520'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      content: 'info@ailhsanhotel.com',
      link: 'mailto:info@ailhsanhotel.com'
    },
    {
      icon: <FaClock />,
      title: 'Hours',
      content: '24/7 Front Desk Service',
      link: null
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, name: 'Facebook', url: 'https://facebook.com' },
    { icon: <FaTwitter />, name: 'Twitter', url: 'https://twitter.com' },
    { icon: <FaInstagram />, name: 'Instagram', url: 'https://instagram.com' },
    { icon: <FaLinkedin />, name: 'LinkedIn', url: 'https://linkedin.com' }
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
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#fff' }}>Contact Us</h1>
          <p className="lead mb-0" style={{ color: '#fff' }}>We'd love to hear from you. Get in touch with us today!</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Contact Information */}
        <Row className="mb-5">
          {contactInfo.map((info, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card className="border-0 shadow-sm h-100 text-center">
                <Card.Body className="py-4">
                  <div className="text-primary mb-3" style={{ fontSize: '2rem' }}>
                    {info.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{info.title}</h5>
                  {info.link ? (
                    <a 
                      href={info.link} 
                      className="text-decoration-none text-muted"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-muted mb-0">{info.content}</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-5">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <h2 className="fw-bold mb-4">Send us a Message</h2>
                
                {submitted && (
                  <Alert variant="success" dismissible onClose={() => setSubmitted(false)}>
                    Thank you for your message! We'll get back to you soon.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter your email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Subject *</Form.Label>
                        <Form.Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="reservation">Reservation Inquiry</option>
                          <option value="general">General Information</option>
                          <option value="feedback">Feedback & Reviews</option>
                          <option value="complaint">Complaint</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us how we can help you..."
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Sending Message...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Additional Information */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Quick Information</h4>
                
                <div className="mb-4">
                  <h6 className="fw-bold text-primary">Check-in/Check-out</h6>
                  <p className="text-muted mb-1">Check-in: 3:00 PM</p>
                  <p className="text-muted mb-0">Check-out: 11:00 AM</p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold text-primary">Reservation Policy</h6>
                  <p className="text-muted mb-1">• Free cancellation up to 24 hours before arrival</p>
                  <p className="text-muted mb-1">• Credit card required for booking</p>
                  <p className="text-muted mb-0">• Early check-in subject to availability</p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold text-primary">Special Requests</h6>
                  <p className="text-muted mb-1">• Late check-out available</p>
                  <p className="text-muted mb-1">• Room preferences accommodated</p>
                  <p className="text-muted mb-0">• Special dietary requirements</p>
                </div>
              </Card.Body>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Follow Us</h4>
                <div className="d-flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: '50px', height: '50px' }}>
                        {social.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Map Section */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div style={{ height: '400px', backgroundColor: '#e9ecef' }}>
                  <iframe
                    title="Ailhsan Metro Hotel Location"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=7.438%2C10.523%2C7.448%2C10.533&amp;layer=mapnik&amp;marker=10.528%2C7.443"
                    style={{ width: '100%', height: '100%', border: 0 }}
                    allowFullScreen=""
                  ></iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;


