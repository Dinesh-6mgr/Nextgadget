import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { fetchSettings } from './redux/slices/settingsSlice';
import './index.css';
import App from './App.jsx';

// Load settings once at startup (non-blocking)
store.dispatch(fetchSettings());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
