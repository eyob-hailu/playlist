import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyles from './components/Global';

import Home from './components/Home';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="App">
      <GlobalStyles />
      <BrowserRouter>
       <Header />
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={<Home />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
