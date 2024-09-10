import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet, View, Text } from 'react-native';
import WebViewComponent from '../components/webView';
import { useThemeContext } from '../contexts/themeContext';

export default function BskyPage() {
    const { switchColorMode, switchDarkModeType } = useThemeContext();

    const setTheme = (colorMode, darkModeType) => {
        switchColorMode(colorMode);
        switchDarkModeType(darkModeType);
    }

    const handleWebViewMessage = (event) => { // Function to handle messages from the WebView
        const localStorageData = JSON.parse(event.nativeEvent.data);
        const bskyStorage = JSON.parse(localStorageData.BSKY_STORAGE);
        
        const colorMode_ = bskyStorage.colorMode;
        const darkModeType = bskyStorage.darkTheme;

        setTheme(colorMode_, darkModeType);
    };

    const getLocalStorageData = `
        (function() {
            const localStorageData = { ...localStorage };
            window.ReactNativeWebView.postMessage(JSON.stringify(localStorageData));
        })();
        true; 
    `;

    return (
        <View style={styles.container}>
            <WebViewComponent ContentToInject={[getLocalStorageData]} handleWebViewMessage={handleWebViewMessage} />
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
});
