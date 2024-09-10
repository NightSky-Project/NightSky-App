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

    const switchColorMode = async (colorMode) => {
        const mode = colorMode === 'dark';
        setIsDarkMode(mode);
        await saveColorMode(mode);
    };

    const switchDarkModeType = async (darkModeType) => {
        setDarkModeType(darkModeType);
        await saveDarkModeType(darkModeType);
    }

    const saveColorMode = async (mode_) => {
        try {
            const isDarkMode_ = await AsyncStorage.getItem('isDarkMode').catch((error) => { return null; });
            if (isDarkMode_ !== null && JSON.parse(isDarkMode_) === mode_) {
                return;
            }
            await AsyncStorage.setItem('isDarkMode', JSON.stringify(mode_)).then(
                () => {
                    console.log('Theme saved successfully:', mode_ ? 'Dark' : 'Light');
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
            const currentDarkModeType = await AsyncStorage.getItem('darkModeType').catch((error) => { return ''; });
            if (currentDarkModeType === type) {
                return;
            }
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
            const savedColorMode = await AsyncStorage.getItem('isDarkMode').then(
                (value) => {
                    console.log('ColorMode loaded successfully:', value === 'true' ? 'Dark' : 'Light');
                    return value;
                }
            ).catch((error) => {
                console.log('Error loading theme:', error);
            });
            if (savedColorMode !== null) {
                setIsDarkMode(JSON.parse(savedColorMode));
            }

            const savedDarkModeType = await AsyncStorage.getItem('darkModeType').then(
                (value) => {
                    console.log('DarkModeType loaded successfully:', value);
                    return value;
                }
            ).catch((error) => {
                console.log('Error loading dark mode type:', error);
            });
            if (savedDarkModeType !== null) {
                setDarkModeType(savedDarkModeType);
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, loadTheme, switchColorMode, darkModeType, switchDarkModeType }}>
            <ThemeProvider theme={isDarkMode ? (dark[darkModeType]) : light}>
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
