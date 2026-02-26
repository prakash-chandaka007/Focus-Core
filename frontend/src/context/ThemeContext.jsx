import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('fc-theme') || 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('fc-theme', theme);
    }, [theme]);

    const toggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ theme, toggle, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
