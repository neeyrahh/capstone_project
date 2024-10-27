import React from "react";
import { Link } from "react-router-dom";
import '../styles/Styles.css';
import { Container, Nav, Navbar } from "react-bootstrap";
import { useAuth } from './Auth/AuthContext'; 

const Header = () => {
  const { isAuthenticated, logout } = useAuth(); 

  const headerLinks = [
    { link: "/", text: "Home" },
    ...(isAuthenticated ? [
      { link: "/dashboard", text: "Dashboard" },
      { link: "/tasks", text: "Tasks" },
      { link: "#", text: "Logout", onClick: logout } // Added Logout link
    ] : [
      { link: "/login", text: "Login" },
    ]),
  ];

  return (
    <Navbar className="header" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          TrackIt
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {headerLinks.map((headerLink) => (
              <Nav.Link 
                as={headerLink.link === "#" ? "button" : Link} // Use button for logout
                to={headerLink.link === "#" ? undefined : headerLink.link}
                key={headerLink.text} 
                style={{ marginTop: '8px' }} 
                onClick={(e) => {
                  if (headerLink.link === "#") {
                    e.preventDefault(); // Prevent the default anchor behavior
                    headerLink.onClick(); // Call logout
                  }
                }}
              >
                {headerLink.text}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
