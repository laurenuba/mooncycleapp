import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CycleProvider } from './context/CycleContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CycleProvider>
        <App />
      </CycleProvider>
    </BrowserRouter>
  </React.StrictMode>
);
