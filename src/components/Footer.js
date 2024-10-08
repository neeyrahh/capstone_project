import React from "react";
import '../styles/Styles.css';
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <p className="mb-0 text-center">
          TrackIt &copy; 2024
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
