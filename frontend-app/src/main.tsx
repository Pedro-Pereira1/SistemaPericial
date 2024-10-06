import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


// Mount React app to #root element in the HTML file
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
