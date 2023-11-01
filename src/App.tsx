import React from 'react';
import 'styled-components';
import Router from './Router';
import { ChakraProvider } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <ChakraProvider>
      <Header />
      <Router />
      <Footer />
    </ChakraProvider>
  );
}

export default App;
