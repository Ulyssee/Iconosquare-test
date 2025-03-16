import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LiveChartProvider } from './utils/hooks/useLiveChartContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <LiveChartProvider>
      <App />
    </LiveChartProvider>
  </React.StrictMode>
);
