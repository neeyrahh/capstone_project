import React from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import "../styles/Styles.css";
import { useAuth } from "./Auth/AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  const headerLinks = [
    { link: "/", text: "Home" },
    
    ...(isAuthenticated
      ? [
          { link: "/dashboard", text: "Dashboard" },
         
          { link: "#", text: "Logout", onClick: logout },
        ]
      : [
        { link: "/login", text: "Login" },
      ]),
  ];

  return (
    <Navbar className="header py-3" expand="lg">
      <Container>
        <Navbar.Brand href="/" className="brand-name">
          TrackIt
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {headerLinks.map((headerLink, index) => (
              <Nav.Link
              as={headerLink.link === "#" ? "button" : Link}
              to={headerLink.link === "#" ? undefined : headerLink.link}
              key={headerLink.text}
               style={{
                margin:"8px",
                color:"#03061f"
               }}
                
                // className="nav-link-custom"
                onClick={(e) => {
                  if (headerLink.link === "#") {
                    e.preventDefault();
                    headerLink.onClick();
                  }
                }}
              >
                {headerLink.text}
              </Nav.Link>
            ))}
            {/* <Nav.Link
              as={Link}
              to="/login"
              className="sign-up-btn d-flex align-items-center"
            >
              Login/Sign Up
            </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;