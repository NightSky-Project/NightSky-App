import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import themes from '../style/theme';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

const _ThemeProvider = ({ children }) => {
    const Mode = Appearance.getColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(Mode === 'dark');
    const [darkModeType, setDarkModeType] = useState('dim');

    useEffect(() => {
        loadTheme();
    }, []);

    const { light, dark } = themes;

    const switchColorMode = (colorMode) => {
        const newTheme = colorMode === 'dark';
        setIsDarkMode(newTheme);
        saveColorMode(newTheme);
    };

    const switchDarkModeType = (darkModeType) => {
        setDarkModeType(darkModeType);
        saveDarkModeType(darkModeType);
    }

    const saveColorMode = async (theme) => {
        try {
            await AsyncStorage.setItem('theme', JSON.stringify(theme)).then(
                () => {
                    console.log('Theme saved successfully:', !theme ? 'Dark' : 'Light');
                }
            ).catch((error) => {
                console.log('Error saving theme:', error);
            });
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    const saveDarkModeType = async (type) => {
        try {
            await AsyncStorage.setItem('darkModeType', type).then(
                () => {
                    console.log('Dark mode type saved successfully:', type);
                }
            ).catch((error) => {
                console.log('Error saving dark mode type:', error);
            });
        } catch (error) {
            console.log('Error saving dark mode type:', error);
        }
    }

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme').then(
                (value) => {
                    console.log('Theme loaded successfully:', value === 'true' ? 'Dark' : 'Light');
                    return value;
                }
            ).catch((error) => {
                console.log('Error loading theme:', error);
            });
            if (savedTheme !== null) {
                setIsDarkMode(JSON.parse(savedTheme));
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, loadTheme, switchColorMode, darkModeType, switchDarkModeType }}>
            <ThemeProvider theme={isDarkMode ? dark : light}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export { _ThemeProvider, useThemeContext };
