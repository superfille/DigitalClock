import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Clock from './index';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.log('Error')
} else {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <Clock />
    </StrictMode>
  );
}



