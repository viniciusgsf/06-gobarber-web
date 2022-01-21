/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import SignIn from './Pages/Signin';
import SignUp from './Pages/SignUp';
import GlobalStyle from '../src/styles/global';

import AppProvider from './hooks';

import Routes from './routes';


const App: React.FC = () => (
  <Router>
    <AppProvider> 
      <Routes/>
    </AppProvider>  

    <GlobalStyle/>
  </Router>
);

export default App;
