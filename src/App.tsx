import React, { useState, useEffect } from 'react';
import Container from './components/Container';
import Header from './components/Header';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-white text-gray-900 min-h-screen"}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700"
      >
        {darkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
      </button>
      <Header />
      <Container />
    </div>
  );
}

export default App;
