import { createRoot } from 'react-dom/client';

import { App } from './auth/App.tsx';
import '../style.css';

// Add global styles
const styles = document.createElement('style');
styles.textContent = `
  html, body {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    background-color: var(--affine-white-90);
    transition: background-color 0.3s;
  }

  * {
    box-sizing: border-box;
  }

  #root {
    height: 100%;
  }
`;
document.head.appendChild(styles);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
