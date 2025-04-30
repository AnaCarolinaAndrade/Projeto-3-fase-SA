import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GlobalContextProvider } from './context/GlobalContext.jsx'
import router from './router/routes.jsx'
import {  RouterProvider } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <GlobalContextProvider>
    <GoogleOAuthProvider clientId="187533279088-8ck947lb5vptqltevj9e04m9rvs8i4tu.apps.googleusercontent.com">
      <RouterProvider router={router}>
      </RouterProvider>
    </GoogleOAuthProvider>
  </GlobalContextProvider>
);