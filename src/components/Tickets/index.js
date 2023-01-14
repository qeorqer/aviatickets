import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

import { ReactComponent as Loader } from '../../assets/icons/loader.svg';

import {
  checkIfLessThen10,
  convertMinutesIntoHours,
  sortingTypes,
  stopsOptions,
} from './utils';

const Tickets = ({ tickets, isTicketsLoading, isNoTickets }) => {
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [sortingType, setSortingType] = useState(sortingTypes.byPrice);
  const [numberOfStops, setNumberOfStops] = useState(stopsOptions.allFlights);

  useEffect(() => {
    setFilteredTickets(tickets);
  }, [tickets]);

  useEffect(() => {
    const result = tickets
      .filter((ticket) => {
        if (numberOfStops === stopsOptions.direct) {
          return ticket.legs.every((leg) => leg.stopCount === 0);
        }
        if (numberOfStops === stopsOptions.oneStop) {
          return ticket.legs.every((leg) => leg.stopCount <= 1);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortingType === sortingTypes.byPrice) {
          return a.price - b.price;
        }
        if (sortingType === sortingTypes.byDuration) {
          const aDuration = a.legs.reduce(
            (total, cur) => total + cur.durationInMinutes,
            0,
          );
          const bDuration = b.legs.reduce(
            (total, cur) => total + cur.durationInMinutes,
            0,
          );

          return aDuration - bDuration;
        }
        return b.agent.rating - a.agent.rating;
      });

    setFilteredTickets(result);
  }, [sortingType, numberOfStops, tickets]);

  return (
    <section className="mt-4">
      <Container>
        {isTicketsLoading && <Loader />}

        {isNoTickets && (
          <p className="fs-4 text-center">
            Unfortunately, there are not tickets. Try another search
          </p>
        )}

        {tickets.length && !isTicketsLoading ? (
          <Row>
            <Col xs={4}>
              <p className="text-center fs-3 ">Filter the tickets</p>
              <Form>
                <Row>
                  <Col xs={6}>
                    <p className="fs-4 mb-0">Sorting type: </p>
                    <Form.Check
                      checked={sortingType === sortingTypes.byPrice}
                      value={sortingTypes.byPrice}
                      label="By price"
                      name="sorting"
                      type="radio"
                      onChange={(event) => setSortingType(event.target.value)}
                    />
                    <Form.Check
                      checked={sortingType === sortingTypes.byDuration}
                      value={sortingTypes.byDuration}
                      label="By duration"
                      name="sorting"
                      type="radio"
                      onChange={(event) => setSortingType(event.target.value)}
                    />
                    <Form.Check
                      checked={sortingType === sortingTypes.byRating}
                      value={sortingTypes.byRating}
                      label={`By agent's rating`}
                      name="sorting"
                      type="radio"
                      onChange={(event) => setSortingType(event.target.value)}
                    />
                  </Col>
                  <Col xs={6}>
                    <p className="fs-4 mb-0">Number of stops: </p>
                    <Form.Check
                      label="Only direct flights"
                      name="stops"
                      type="radio"
                      checked={numberOfStops === stopsOptions.direct}
                      value={stopsOptions.direct}
                      onChange={(event) => setNumberOfStops(event.target.value)}
                    />
                    <Form.Check
                      label="One stop is fine"
                      name="stops"
                      type="radio"
                      checked={numberOfStops === stopsOptions.oneStop}
                      value={stopsOptions.oneStop}
                      onChange={(event) => setNumberOfStops(event.target.value)}
                    />
                    <Form.Check
                      label="Include all flights"
                      name="stops"
                      type="radio"
                      checked={numberOfStops === stopsOptions.allFlights}
                      value={stopsOptions.allFlights}
                      onChange={(event) => setNumberOfStops(event.target.value)}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col xs={8}>
              {filteredTickets.length ? (
                filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col
                          xs={3}
                          className="d-flex justify-content-center align-items-center flex-column"
                        >
                          <img
                            src={ticket.agent.imageUrl}
                            alt="Airline logo URL"
                          />
                          <p className="mt-2">
                            Rating: {ticket.agent.rating}/5
                          </p>
                        </Col>
                        <Col xs={6}>
                          {ticket.legs.map((item, index) => {
                            const originName = ticket.origins[index].name;
                            const destinationName =
                              ticket.destinations[index].name;
                            const { departureDateTime } = ticket.legs[index];
                            const { arrivalDateTime } = ticket.legs[index];
                            const { stopCount } = ticket.legs[index];
                            const { durationInMinutes } = ticket.legs[index];

                            return (
                              <div key={uuidv4()}>
                                {index > 0 && <hr />}
                                <p className="text-center fw-bold fs-5 mb-0">
                                  {originName} 🛬 {destinationName}
                                </p>
                                <p className="text-center">
                                  {`${checkIfLessThen10(
                                    departureDateTime.day,
                                  )}/${checkIfLessThen10(
                                    departureDateTime.month,
                                  )}/${checkIfLessThen10(
                                    departureDateTime.year,
                                  )}, ${checkIfLessThen10(
                                    departureDateTime.hour,
                                  )}:${checkIfLessThen10(
                                    departureDateTime.minute,
                                  )}`}{' '}
                                  -{' '}
                                  {`${checkIfLessThen10(
                                    arrivalDateTime.day,
                                  )}/${checkIfLessThen10(
                                    arrivalDateTime.month,
                                  )}/${checkIfLessThen10(
                                    arrivalDateTime.year,
                                  )}, ${checkIfLessThen10(
                                    arrivalDateTime.hour,
                                  )}:${checkIfLessThen10(
                                    arrivalDateTime.minute,
                                  )}`}
                                </p>
                                <div className="d-flex justify-content-between fs-6">
                                  <p>
                                    <span className="fw-bold">
                                      Number of stops:
                                    </span>{' '}
                                    {stopCount}
                                  </p>
                                  <p>
                                    <span className="fw-bold">Duration:</span>{' '}
                                    {convertMinutesIntoHours(durationInMinutes)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </Col>
                        <Col
                          xs={3}
                          className="d-flex justify-content-center align-items-center flex-column"
                        >
                          <p>
                            Price: {ticket.price} {ticket.currency}
                          </p>
                          <Button
                            variant="dark"
                            href={ticket.deepLink}
                            className="w-50"
                          >
                            Buy
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="fs-4 text-center">
                  There are not tickets that much your requirements
                </p>
              )}
            </Col>
          </Row>
        ) : null}
      </Container>
    </section>
  );
};

export default Tickets;
