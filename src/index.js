import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './Context/UserContext';
import FeedbackForm from './components/sections/FeedbackForm';
import { FeedbackProvider } from './Context/FeedbackStateProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <FeedbackProvider>
    <App />
    </FeedbackProvider>
    </UserProvider>
  </React.StrictMode>
);

// Optional performance measurement
reportWebVitals();
