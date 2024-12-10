import React from "react";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  PiGoogleChromeLogoThin,
  PiDribbbleLogoThin,
  PiDiscordLogoThin,
  PiBehanceLogoThin,
  PiGithubLogoThin,
  PiFlagThin,
  PiUsersThreeThin,
} from "react-icons/pi";
import { DiStreamline } from "react-icons/di";
import { BsStarFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "../styles/Styles.css";
import "../styles/Homepage.css";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Container className="banner-section py-5">
        <Row>
          {/* Left Section */}
          <Col md={6} className="text-section">
            <p className="small-text text-uppercase text-success">
              Track your tasks!
            </p>
            <h1 className="display-4">
              Simplify the way <br /> you track your <span>projects</span>
            </h1>
            <p className="mt-3">
              From task assignments to project timelines, TrackIt helps you stay
              organized and productive. Keep your team aligned and manage your
              workflow efficiently.
            </p>

            {/* Button and Reviews Row */}
            <div className="button-review-container d-flex align-items-center mt-4">
              <button onClick={() => navigate("/login")}
                className="btn btn-primary get-started"
              >
                Get Started Now
              </button>
              <div className="reviews">
                <div className="ms-4">
                  <div className="stars">
                    <BsStarFill className="text-warning" />
                    <BsStarFill className="text-warning" />
                    <BsStarFill className="text-warning" />
                    <BsStarFill className="text-warning" />
                    <BsStarFill className="text-warning" />
                  </div>
                  <span className="rating-score ms-2">5.0</span>
                </div>
                <p className="review-text mt-1">
                  from 120+{" "}
                  <Link to="/reviews" className="review-link">
                    reviews
                  </Link>
                </p>
              </div>
            </div>
          </Col>
          {/* Right Section */}
          <Col
            md={6}
            className="image-section d-flex justify-content-center align-items-center"
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/hero.png`}
              alt="TrackIt on mobile"
              className="img-fluid single-image"
            />
          </Col>
        </Row>
      </Container>

      <Container className="text-center">
        <Row>
          <Col>
            {" "}
            <PiGoogleChromeLogoThin className="partner-logo" size={40} />{" "}
          </Col>
          <Col>
            {" "}
            <PiDribbbleLogoThin className="partner-logo" size={40} />{" "}
          </Col>
          <Col>
            {" "}
            <PiDiscordLogoThin className="partner-logo" size={40} />{" "}
          </Col>
          <Col>
            {" "}
            <PiBehanceLogoThin className="partner-logo" size={40} />{" "}
          </Col>
          <Col>
            {" "}
            <PiGithubLogoThin className="partner-logo" size={40} />{" "}
          </Col>
        </Row>
      </Container>

      {/* About Section */}
      <section id="about" className="about-section text-center py-5">
        <Container>
          <p className="small-text text-uppercase text-success">About Us</p>
          <h2>One app for all your project management needs</h2>
          <p className="description">
            Remove the hassle of juggling multiple tools. Our app brings
            everything into one place, from task assignments and team
            collaboration to progress tracking and detailed analytics. Designed
            for teams of all sizes, TrackIt helps you focus on what matters:
            achieving your project goals efficiently and effectively. <br />{" "}
            <br />
            TrackIt enables seamless communication and collaboration, helping
            you stay connected with your team wherever they are. Get real-time
            updates on project progress, monitor deadlines, and ensure every
            task is completed on time. Whether you’re managing a small project
            or handling complex workflows, TrackIt adapts to your needs. <br />{" "}
          </p>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-5">
        <Container>
          <Row className="align-items-center mb-4">
            <Col md={6}>
              <h2 className="feature-heading">
                Organize Your Projects, Effortlessly
              </h2>
            </Col>
            <Col md={6}>
              <p className="feature-description">
                With TrackIt, manage all your tasks, projects, and team
                collaboration in one place. Simplify project tracking, boost
                productivity, and ensure everyone stays on the same page.
              </p>
            </Col>
          </Row>
          <Row className="row row-features">
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body>
                  <div className="feature-content">
                    <PiFlagThin className="feature-icon" />
                    <div className="feature-text-group">
                      <h4 className="feature-title">Task Prioritization</h4>
                      <p className="feature-text">
                        Organize and prioritize tasks to stay focused on what
                        matters the most.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body>
                  <div className="feature-content">
                    <DiStreamline className="feature-icon" />
                    <div className="feature-text-group">
                      <h4 className="feature-title">Streamlined Workflows</h4>
                      <p className="feature-text">
                        Seamlessly integrate tasks into workflows to achieve
                        project goals efficiently.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body>
                  <div className="feature-content">
                    <PiUsersThreeThin className="feature-icon" />
                    <div className="feature-text-group">
                      <h4 className="feature-title">Team Collaboration</h4>
                      <p className="feature-text">
                        Engage your team with real-time updates and foster
                        better collaboration.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* image Banner Section */}
      <section className="statistics-banner py-5 text-center">
        <Container>
          <img
            src={`${process.env.PUBLIC_URL}/images/banner.png`}
            alt="TrackIt on mobile"
            className="img-fluid single-image"
          />
        </Container>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section py-5">
        <Container>
          <Row>
            <Col md={6} className="faq-title-col">
              <p className="small-text text-uppercase text-success">FAQ</p>
              <h2 className="faq-title">Frequently Asked Questions</h2>
            </Col>
            <Col md={6} className="faq-items-col">
              <Accordion flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                  How can I add a new task in TrackIt?
                  </Accordion.Header>
                  <Accordion.Body>
                  To add a new task, navigate to the project dashboard, click on the "Add Task" button, and fill in the required details such as task name, priority, due date, and assignee. Once saved, the task will appear on your dashboard for easy tracking.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                  Can I assign tasks to multiple team members?
                  </Accordion.Header>
                  <Accordion.Body>
                  Yes, TrackIt allows you to assign tasks to multiple team members. When creating or editing a task, simply select the team members you want to assign it to, and they'll receive notifications in their dashboard.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                  How do I track project progress?
                  </Accordion.Header>
                  <Accordion.Body>
                  TrackIt provides a visual progress bar and status updates for each project. You can view the overall progress on the project dashboard, which updates automatically based on the tasks completed and milestones achieved.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>Can I view a summary of completed tasks?</Accordion.Header>
                  <Accordion.Body>
                  Yes, TrackIt provides a summary of completed tasks within each project’s dashboard. You can also filter tasks by status to view all completed tasks, along with details on who completed them and when.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                  What is the purpose of the reporting feature in TrackIt?
                  </Accordion.Header>
                  <Accordion.Body>
                  The reporting feature provides insights into project metrics, team performance, and task completion rates. You can generate reports to review productivity, track project health, and make data-driven decisions to improve workflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
};

export default Banner;
