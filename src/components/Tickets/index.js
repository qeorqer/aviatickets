import * as React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import { ReactComponent as Loader } from '../../assets/icons/loader.svg';
import { convertMinutesIntoHours } from './utils';

const Tickets = ({ tickets, isTicketsLoading, isNoTickets }) => {
  return (
    <section className='mt-4'>
      <Container>
        {isTicketsLoading && (
          <Loader />
        )}

        {isNoTickets && (
          <p className='fs-4 text-center'>Unfortunately, there are not tickets. Try another search</p>
        )}

        {tickets.length && !isTicketsLoading ? (
          tickets.map((ticket) => (
            <Card key={ticket.id} className='mb-3'>
              <Card.Body>
                <Row>
                  <Col xs={4}>
                    <img src={ticket.agent.imageUrl} alt='Airline logo URL' />
                    <p>Rating: {ticket.agent.rating}/5</p>
                  </Col>
                  <Col xs={4}>
                   <p>{ticket.origin.name} - {ticket.destination.name}</p>
                    <p>Number of stops: {ticket.leg.stopCount}</p>
                    <p>Duration: {convertMinutesIntoHours(ticket.leg.durationInMinutes)}</p>
                  </Col>
                  <Col xs={4}>
                   <p>Price: {ticket.price} {ticket.currency}</p>
                    <Button variant="dark" href={ticket.deepLink} className='w-50'>Buy</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        ) : null}
      </Container>
    </section>
  );
};

export default Tickets;
