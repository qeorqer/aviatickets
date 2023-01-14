import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './style.scss';

const Header = () => {
  return (
    <header className="header">
      <Container>
        <div className="text-center">
          <h1>
            <Link to="/" className="logo">
              AviaTickets
            </Link>
          </h1>
          <h2>Search for the cheapest flights</h2>
        </div>
      </Container>
    </header>
  );
};

export default Header;
