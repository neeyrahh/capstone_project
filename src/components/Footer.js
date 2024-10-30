import React from "react";
import "../styles/Styles.css";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="footer-section py-5">
      <Container>
        <Row className="row footer-row">
          {/* Account Section */}
          <Col md={2}>
            <h5 className="footer-heading">Account</h5>
            <ul className="footer-links">
              <li>Saving</li>
              <li>Join Accounts</li>
              <li>Crypto</li>
              <li>Freelance</li>
              <li>Commodities</li>
            </ul>
          </Col>

          {/* Help Section */}
          <Col md={2}>
            <h5 className="footer-heading">Help</h5>
            <ul className="footer-links">
              <li>Customer Help</li>
              <li>Community</li>
              <li>Blog</li>
            </ul>
          </Col>

          {/* Finance Section */}
          <Col md={2}>
            <h5 className="footer-heading">Finance</h5>
            <ul className="footer-links">
              <li>Cards</li>
              <li>Linked Accounts</li>
              <li>Payment</li>
            </ul>
          </Col>

          {/* Company Section */}
          <Col md={2}>
            <h5 className="footer-heading">Company</h5>
            <ul className="footer-links">
              <li>About Us</li>
              <li>Contact</li>
              <li>Sustainability</li>
              <li>Career</li>
            </ul>
          </Col>

          {/* Logo and Address Section */}
          <Col md={4} className="text-right">
            <h2 className="footer-logo">TrackIt</h2>
            <p className="footer-address">
              181 Bay Street, Wellington Tower, Suite 292 Toronto, Ontario M5J 2T3
            </p>
            <p className="footer-language">
              <img src={`${process.env.PUBLIC_URL}/images/Flag_of_Canada.svg`} alt="CANADA Flag" /> English (UK)
            </p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="d-flex justify-content-between footer-bottom-text">
            <span>© TrackIt Ltd 2024.</span>
            <span>
              <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Use</a> | <a href="/disclosure">Disclosure</a>
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
