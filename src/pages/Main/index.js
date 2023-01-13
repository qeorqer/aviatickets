import React, { useState } from 'react';

import Header from '../../components/Header';
import Search from '../../components/Search';
import Tickets from '../../components/Tickets';

const Main = () => {
  const [tickets, setTickets] = useState([]);
  const [isTicketsLoading, setIsTicketsLoading] = useState(false);

  return (
    <>
      <Header />
      <Search setIsTicketsLoading={setIsTicketsLoading} setTickets={setTickets} />
      <Tickets tickets={tickets} isTicketsLoading={isTicketsLoading} />
    </>
  );
};

export default Main;
