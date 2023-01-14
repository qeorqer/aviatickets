import * as React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import { ReactComponent as Loader } from '../../assets/icons/loader.svg';

import { checkIfLessThen10, convertMinutesIntoHours } from './utils';

const Tickets = ({ tickets, isTicketsLoading, isNoTickets }) => {
  return (
    <section className="mt-4">
      <Container>
        {isTicketsLoading && <Loader />}

        {isNoTickets && (
          <p className="fs-4 text-center">
            Unfortunately, there are not tickets. Try another search
          </p>
        )}

        {tickets.length && !isTicketsLoading
          ? tickets.map((ticket) => (
              <Card key={ticket.id} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col
                      xs={3}
                      className="d-flex justify-content-center align-items-center flex-column"
                    >
                      <img src={ticket.agent.imageUrl} alt="Airline logo URL" />
                      <p className="mt-2">Rating: {ticket.agent.rating}/5</p>
                    </Col>
                    <Col xs={6}>
                      {ticket.legs.map((item, index) => {
                        const originName = ticket.origins[index].name;
                        const destinationName = ticket.destinations[index].name;
                        const { departureDateTime } = ticket.legs[index];
                        const { arrivalDateTime } = ticket.legs[index];
                        const { stopCount } = ticket.legs[index];
                        const { durationInMinutes } = ticket.legs[index];

                        return (
                          <>
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
                              )}:${checkIfLessThen10(arrivalDateTime.minute)}`}
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
                          </>
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
          : null}
      </Container>
    </section>
  );
};

export default Tickets;
