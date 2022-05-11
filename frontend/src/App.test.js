import { render, screen } from '@testing-library/react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import App from './App';
import VendingMachine from './components/VendingMachine'
test('renders without crashing', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  act(() => {
    root.render(<App />);
  }
  )
});
