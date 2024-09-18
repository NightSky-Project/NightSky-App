import 'expo-dev-client';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { NativeRouter, Route, Routes } from 'react-router-native';
import BskyPage from './pages';
import { ThemeContext, _ThemeProvider } from './contexts/themeContext';
import StyledStatusBar from './components/statusBar';
import StyledNavigationBar from './components/navigationBar';
import { Provider } from 'react-redux';
import store from './redux/store';

export default function App() {
    return (
        <NativeRouter>
            <_ThemeProvider>
                <Provider store={store}>
                    <StyledStatusBar />
                    <Routes>
                        <Route path="/" element={<BskyPage />} />
                    </Routes>
                    <StyledNavigationBar />
                </Provider>
            </_ThemeProvider>
        </NativeRouter>
    );
}
