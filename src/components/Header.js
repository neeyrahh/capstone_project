import React from "react";
import { Link } from "react-router-dom";
import '../styles/Styles.css';
import { Container, Nav, Navbar } from "react-bootstrap";

const Header = () => {
  const headerLinks = [
    { link: "/", text: "Home" },
    { link:"/tasks", text:"Tasks" },
    { link:"/login", text:"Login"},
    
    // { link:  },
  ];

  return (
    <Navbar className = "header" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          TrackIt
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {headerLinks.map((headerLink) => (
              <Nav.Link as={Link} to={headerLink.link} key={headerLink.text}>
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