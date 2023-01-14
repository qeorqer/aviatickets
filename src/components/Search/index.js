import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';

import './style.scss';
import { cabinClassOptions, currencies, numberOfAdultsOptions } from './utils';

const Search = ({ setTickets, setIsTicketsLoading, setIsNoTickets }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [numberOfAdults, setNumberOfAdults] = useState(
    numberOfAdultsOptions[0].value,
  );
  const [cabinClass, setCabinClass] = useState(cabinClassOptions[0].value);
  const [isOneWayTrip, setIsOneWayTrip] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const handleSearch = async () => {
    try {
      setIsNoTickets(false);

      if (!from || !to) {
        return toast('All fields are required', {
          type: 'error',
        });
      }

      setIsTicketsLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_SCANNER_API_URL}/find-tickes`,
        {
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
            returnDate: isOneWayTrip
              ? null
              : {
                  year: returnDate.getFullYear(),
                  month: returnDate.getMonth() + 1,
                  day: returnDate.getDate(),
                },
            market: 'US',
            locale: 'en-US',
            currency,
            adults: numberOfAdults,
            cabinClass,
          }),
        },
      );

      const { flights } = await res.json();
      const { itineraries, agents, legs, places } = flights.content.results;

      const parsedTickets = [];

      for (const itineraryId in itineraries) {
        const itinerary = itineraries[itineraryId];
        const ticket = {};

        const agentId = itinerary?.pricingOptions[0].agentIds[0];

        ticket.id = uuidv4();
        ticket.currency = currency;
        ticket.agent = agents[agentId];
        ticket.price = itinerary?.pricingOptions[0].price?.amount;
        ticket.deepLink = itinerary?.pricingOptions[0].items[0].deepLink;
        ticket.legs = itinerary.legIds.map((legId) => legs[legId]);
        ticket.origins = ticket.legs.map((leg) => places[leg.originPlaceId]);
        ticket.destinations = ticket.legs.map(
          (leg) => places[leg.destinationPlaceId],
        );

        if (ticket.price) {
          ticket.price /= 1000;
        }

        parsedTickets.push(ticket);
      }

      setTickets(parsedTickets);
      setIsTicketsLoading(false);

      if (!parsedTickets.length) {
        setIsNoTickets(true);
      }
    } catch (err) {
      setIsTicketsLoading(false);
    }
  };

  const getOptions = async (searchTerm) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SCANNER_API_URL}/search-place`,
        {
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
        },
      );

      const { flights } = await res.json();

      const formattedPlaces = flights?.places
        .filter((place) => place.type !== 'PLACE_TYPE_COUNTRY')
        .map((place) => ({
          value: place.iataCode,
          label: `${place.type === 'PLACE_TYPE_AIRPORT' ? '✈️' : '🏙'} ${
            place?.name
          }(${place.iataCode})`,
        }));

      return formattedPlaces;
    } catch (err) {}
  };

  useEffect(() => {
    if (departureDate.getTime() > returnDate.getTime()) {
      setReturnDate(departureDate);
    }
  }, [departureDate]);

  return (
    <section className="search">
      <Container>
        <Form>
          <Row className="mb-2 mt-4 justify-content-center">
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Number of adults</Form.Label>
                <Select
                  options={numberOfAdultsOptions}
                  defaultValue={numberOfAdultsOptions[0]}
                  closeMenuOnScroll
                  onChange={(numberOfAdults) =>
                    setNumberOfAdults(numberOfAdults.value)
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Cabin class</Form.Label>
                <Select
                  options={cabinClassOptions}
                  defaultValue={cabinClassOptions[0]}
                  closeMenuOnScroll
                  onChange={(cabinClass) => setCabinClass(cabinClass.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Currency</Form.Label>
                <Select
                  options={currencies}
                  defaultValue={currencies[0].options[2]}
                  closeMenuOnScroll
                  onChange={(cur) => setCurrency(cur.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={2} className="d-flex align-items-end">
              <Form.Check
                type="switch"
                defaultChecked={false}
                label="One Way"
                value={isOneWayTrip}
                onChange={(event) => setIsOneWayTrip(event.target.checked)}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={2}>
              <Form.Group>
                <Form.Label>From</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getOptions}
                  closeMenuOnScroll
                  onChange={(from) => setFrom(from.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>To</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getOptions}
                  closeMenuOnScroll
                  onChange={(to) => setTo(to.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group>
                <Form.Label>Departure Date</Form.Label>
                <DatePicker
                  selected={departureDate}
                  onChange={(newDate) =>
                    setDepartureDate(newDate || new Date())
                  }
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
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
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  onFocus={(e) => (e.target.readOnly = true)}
                  minDate={departureDate}
                  disabled={isOneWayTrip}
                />
              </Form.Group>
            </Col>
            <Col xs={2} className="d-flex align-items-end">
              <Button
                variant="primary"
                className="w-100"
                onClick={handleSearch}
              >
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
