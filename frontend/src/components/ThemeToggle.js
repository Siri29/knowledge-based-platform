import React from 'react';
import { Button } from 'react-bootstrap';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-light"
      size="sm"
      onClick={toggleTheme}
      className="me-2"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
    </Button>
  );
}

export default ThemeToggle;