import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

import './style.scss';

const Header = () => {
  return (
    <header>
      <Container>
        <Row>
          <Col xs={6} className="d-flex align-items-center">
            <h1>
              <Link to="/" className="logo">
                AviaTickets
              </Link>
            </h1>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
