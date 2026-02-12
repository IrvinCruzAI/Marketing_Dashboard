import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppStore } from './store/index';
import { Layout } from './components/ui/Layout';

function App() {
  const { theme } = useAppStore();

  // Apply theme class to document on initial load
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;