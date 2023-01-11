import * as React from 'react';
import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { cabinClassOptions, numberOfAdultsOptions } from './utils';

const Search = () => {
  const [from, setFrom] = useState('LHR');
  const [to, setTo] = useState('LAX');
  const [departureDate, setDepartureDate] = useState({
    year: 2023,
    month: 2,
    day: 13,
  });
  const [returnDate, setReturnDate] = useState('');
  const [numberOfAdults, setNumberOfAdults] = useState(numberOfAdultsOptions[0]);
  const [cabinClass, setCabinClass] = useState(cabinClassOptions[0].value);
  const [isOneWayTrip, setIsOneWayTrip] = useState(false);

  const handleSearch = async () => {
    console.log(from, to, departureDate, returnDate);
    const res = await fetch(process.env.REACT_APP_SCANNER_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        departureDate,
        returnDate,
        market: 'UA',
        locale: 'en-US',
        currency: 'UAH',
        adults: numberOfAdults,
        cabinClass,
      }),
    });

    const searchResults = await res.json();

    console.log(searchResults);
  };

  return (
    <section>
      <Container>
        <h2>Search the cheapest flights tickets</h2>
        <Form className='search-flights'>
          <Row className='mb-2 mt-4'>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Number of adults</Form.Label>
                <Form.Select
                  size='sm'
                  defaultValue={numberOfAdults}
                  onChange={(event) => setNumberOfAdults(Number(event.target.value))}
                >
                  {numberOfAdultsOptions.map((option) => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Cabin class</Form.Label>
                <Form.Select
                  size='sm'
                  defaultValue={cabinClass}
                  onChange={(event) => setCabinClass(event.target.value)}
                >
                  {cabinClassOptions.map((option) => (
                    <option value={option.value} key={option.value}>{option.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={2} className='d-flex align-items-end'>
              <Form.Check
                type='switch'
                defaultChecked={false}
                label='One Way'
                value={isOneWayTrip}
                onChange={(event) => setIsOneWayTrip(event.target.checked)}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>From</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='From'
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>To</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='To'
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Departure Date</Form.Label>
                <Form.Control
                  type='Date'
                  placeholder='Select departure date'
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Return Date</Form.Label>
                <Form.Control
                  disabled={isOneWayTrip}
                  type='Date'
                  placeholder='Select arrival date'
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={2} className='d-flex align-items-end'>
              <Button variant='dark' className='w-100' onClick={handleSearch}>
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
