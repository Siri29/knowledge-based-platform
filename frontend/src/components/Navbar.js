import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiHome, FiSearch, FiFileText, FiActivity, FiShield } from 'react-icons/fi';

function NavigationBar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="gradient-text">📚 Knowledge Base</Navbar.Brand>
        </LinkContainer>
        
        {isAuthenticated && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <LinkContainer to="/">
                  <Nav.Link><FiHome className="me-1" />Dashboard</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/search">
                  <Nav.Link><FiSearch className="me-1" />Search</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/templates">
                  <Nav.Link><FiFileText className="me-1" />Templates</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/activity">
                  <Nav.Link><FiActivity className="me-1" />Activity</Nav.Link>
                </LinkContainer>
                {user?.role === 'admin' && (
                  <LinkContainer to="/admin">
                    <Nav.Link><FiShield className="me-1" />Admin</Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
              
              <Nav>
                <NavDropdown title={<><FiUser className="me-1" />{user?.name}</>} id="user-dropdown">
                  <NavDropdown.Item>Role: {user?.role}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FiLogOut className="me-1" />Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;