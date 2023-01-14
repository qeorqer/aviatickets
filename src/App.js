import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';

import Main from './pages/Main';

import './App.css';

const router = createHashRouter([
  {
    path: '/',
    element: <Main />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        transition={Slide}
        position="bottom-right"
        autoClose={2000}
        theme="dark"
        hideProgressBar
        closeOnClick
      />
    </>
  );
};

export default App;
