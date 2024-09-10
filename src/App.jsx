import React from 'react';
import { NativeRouter, Route, Routes } from 'react-router-native';
import BskyPage from './pages';
import { ThemeContext, _ThemeProvider } from './contexts/themeContext';
import StyledStatusBar from './components/statusBar';
import StyledNavigationBar from './components/navigationBar';

export default function App() {
    return (
        <NativeRouter>
            <_ThemeProvider>
                <StyledStatusBar />
                <Routes>
                    <Route path="/" element={<BskyPage />} />
                </Routes>
                <StyledNavigationBar />
            </_ThemeProvider>
        </NativeRouter>
    );
}
