import * as React from 'react';
import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const Search = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const handleSearch = async () => {
    console.log(from, to, departure, arrival);
    const res = await fetch(process.env.REACT_APP_SCANNER_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        departure,
        arrival,
      }),
    });

    console.log(res);
  };

  return (
    <section>
      <Container>
        <h2>Search the cheapest flights tickets</h2>
        <Form className="search-flights">
          <Row>
            <Col xs={2}>
              <Form.Control
                type="text"
                placeholder="From"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </Col>
            <Col xs={2}>
              <Form.Control
                type="text"
                placeholder="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </Col>
            <Col xs={2}>
              <Form.Control
                type="Date"
                placeholder="Select departure date"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />
            </Col>
            <Col xs={2}>
              <Form.Control
                type="Date"
                placeholder="Select arrival date"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
              />
            </Col>
            <Col xs={2}>
              <Button variant="dark" className="w-100" onClick={handleSearch}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  );
};

export default Search;
