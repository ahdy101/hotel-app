import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import logo from '../../assets/logo.png'; // Import the logo

const Navigation = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`navbar-custom ${scrolled ? 'scrolled' : ''}`}
    >
      <Container>
        {/* Brand with logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Ailhsan Metro Hotel Logo"
            style={{
              height: '40px',
              width: 'auto',
              maxWidth: '150px',
              marginRight: '10px'
            }}
          />
          <span className="d-none d-md-inline">Ailhsan Metro Hotel</span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navigation Items */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={isActive('/about') ? 'active' : ''}
            >
              About
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/gallery" 
              className={isActive('/gallery') ? 'active' : ''}
            >
              Gallery
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={isActive('/contact') ? 'active' : ''}
            >
              Contact
            </Nav.Link>
          </Nav>

          {/* Right Side Navigation */}
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="nav-link dropdown-toggle">
                    <FaUser className="me-1" />
                    {user?.name}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-custom">
                    <Dropdown.Item as={Link} to="/dashboard">
                      <FaCog className="me-2" />
                      Dashboard
                    </Dropdown.Item>
                    
                    {isAdmin && (
                      <Dropdown.Item as={Link} to="/admin" className="d-flex align-items-center">
                        <img 
                          src={logo}
                          alt="Admin Panel"
                          style={{
                            width: '20px',
                            height: 'auto',
                            marginRight: '10px',
                            opacity: 0.8
                          }}
                        />
                        Admin Panel
                      </Dropdown.Item>
                    )}
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="ms-2"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;