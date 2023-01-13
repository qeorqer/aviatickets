import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from 'react-datepicker';


import { cabinClassOptions, currencies, numberOfAdultsOptions } from './utils';

const Search = ({ setTickets, setIsTicketsLoading }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [numberOfAdults, setNumberOfAdults] = useState(numberOfAdultsOptions[0]);
  const [cabinClass, setCabinClass] = useState(cabinClassOptions[0].value);
  const [isOneWayTrip, setIsOneWayTrip] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const handleSearch = async () => {
    try {
      setIsTicketsLoading(true);
      const res = await fetch(`${process.env.REACT_APP_SCANNER_API_URL}/find-tickes`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to,
          departureDate: {
            year: departureDate.getFullYear(),
            month: departureDate.getMonth() + 1,
            day: departureDate.getDate(),
          },
          returnDate,
          market: 'US',
          locale: 'en-US',
          currency,
          adults: numberOfAdults,
          cabinClass,
        }),
      });

      const { flights } = await res.json();
      const { itineraries, agents, legs, places } = flights.content.results;

      const parsedTickets = [];

      for (const legId in itineraries) {
        const itinerary = itineraries[legId];
        const ticket = {};


        const agentId = itinerary?.pricingOptions[0].agentIds[0];

        ticket.id = uuidv4();
        ticket.currency = currency;
        ticket.agent = agents[agentId];
        ticket.price = itinerary?.pricingOptions[0].price?.amount;
        ticket.deepLink = itinerary?.pricingOptions[0].items[0].deepLink;
        ticket.leg = legs[legId];
        ticket.origin = places[ticket.leg.originPlaceId];
        ticket.destination = places[ticket.leg.destinationPlaceId];

        if (ticket.price) {
          ticket.price /= 1000;
        }

        parsedTickets.push(ticket);
      }

      setTickets(parsedTickets);
      setIsTicketsLoading(false);
    } catch (err) {
      setIsTicketsLoading(false);
    }
  };

  const searchPlace = async (searchTerm) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SCANNER_API_URL}/search-place`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          market: 'US',
          locale: 'en-US',
          searchTerm,
        }),
      });

      const searchResults = await res.json();
      console.log(searchResults);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (from) {
      searchPlace(from);
    }
  }, [from]);

  useEffect(() => {
    if (departureDate.getTime() > returnDate.getTime()){
      setReturnDate(departureDate);
    }
  }, [departureDate]);

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
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Currency</Form.Label>
                <Form.Select
                  size='sm'
                  defaultValue={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  {currencies.map((option) => (
                    <option value={option.code} key={option.code}>{option.code} - {option.symbol}</option>
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
                  size='sm'
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
                  size='sm'
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
                <DatePicker
                  selected={departureDate}
                  onChange={(newDate) => setDepartureDate(newDate || new Date())}
                  className='form-control form-control-sm'
                  dateFormat='dd/MM/yyyy'
                  onFocus={(e) => (e.target.readOnly = true)}
                  minDate={new Date()}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Return Date</Form.Label>
                <DatePicker
                  selected={returnDate}
                  onChange={(newDate) => setReturnDate(newDate || new Date())}
                  className='form-control form-control-sm'
                  dateFormat='dd/MM/yyyy'
                  onFocus={(e) => (e.target.readOnly = true)}
                  minDate={departureDate}
                  disabled={isOneWayTrip}
                />
              </Form.Group>
            </Col>
            <Col xs={2} className='d-flex align-items-end'>
              <Button
                size='sm' variant='dark' className='w-100' onClick={handleSearch}>
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
