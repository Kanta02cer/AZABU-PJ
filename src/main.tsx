import { StrictMode, useEffect } from 'react'
import './i18n'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async';

// Hide loading screen after React app mounts
function AppWithLoading() {
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      // Add fade-out class after a short delay to ensure content is ready
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        // Remove from DOM after transition completes
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }, 300);
    }
  }, []);

  return (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithLoading />
  </StrictMode>,
)
