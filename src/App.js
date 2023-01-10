import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import Main from './pages/Main';

import './App.css';

const router = createHashRouter([
  {
    path: '/',
    element: <Main />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
