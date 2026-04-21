import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <TripProvider>
          <App />
        </TripProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>,
);
