import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registrar el Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('ServiceWorker registrado con éxito:', registration);

      // Verificar si hay una actualización disponible
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('Nueva versión disponible. Recarga la página para actualizar.');
              
            } else {
              console.log('El contenido se ha cacheado para uso sin conexión.');
            }
          }
        };
      };
    } catch (error) {
      console.error('Error al registrar el ServiceWorker:', error);
    }
  });
}

// Medición de rendimiento (opcional)
reportWebVitals();
