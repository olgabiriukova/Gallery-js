import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/style.css'
import './styles/gallery.css'
import './styles/details.css'
import { register } from './service-worker-reg';

// Entry point of the React app
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

register();