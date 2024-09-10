import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'styled-components/native';
import { useThemeContext } from '../contexts/themeContext';


const StyledStatusBar = () => {
    const { isDarkMode } = useThemeContext();
    const theme = useTheme();
    return (
        <StatusBar backgroundColor={theme.backgroundColor} style={isDarkMode ? 'light' : 'auto'} />
    );
}

export default StyledStatusBar;