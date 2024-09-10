import React from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from 'styled-components/native';
import { useThemeContext } from '../contexts/themeContext';

const StyledNavigationBar = () => {
    const { isDarkMode } = useThemeContext();
    const theme = useTheme();
    NavigationBar.setBackgroundColorAsync(theme.backgroundColor);
    NavigationBar.setButtonStyleAsync(isDarkMode ? 'light' : 'dark');
    return (
        <></>
    );
}

export default StyledNavigationBar;