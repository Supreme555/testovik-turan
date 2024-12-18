import React from 'react';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button 
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? "Включить светлую тему" : "Включить темную тему"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle; 