import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet, View, Text } from 'react-native';
import WebViewComponent from '../components/webView';
import { useThemeContext } from '../contexts/themeContext';
import { loadPluginsFromDirectory } from '../utils/pluginsLoader';

export default function BskyPage() {
    const { switchColorMode, switchDarkModeType } = useThemeContext();
    const [pluginsList, setPluginsList] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadPlugins = async () => {
            const scripts = await loadPluginsFromDirectory();
            // console.log('Scripts:', scripts);
            setPluginsList(scripts);
            setLoaded(true);
        };

        loadPlugins();
    }, []);

    const setTheme = async (colorMode, darkModeType) => {
        Promise.all([
            switchColorMode(colorMode),
            switchDarkModeType(darkModeType),
        ]);
    }

    const handleWebViewMessage = async (event) => { // Function to handle messages from the WebView
        const localStorageData = JSON.parse(event.nativeEvent.data);
        const bskyStorage = JSON.parse(localStorageData.BSKY_STORAGE);
        const colorMode_ = bskyStorage.colorMode;
        const darkModeType = bskyStorage.darkTheme;

        await setTheme(colorMode_, darkModeType);
    };

    return (
        <View style={styles.container}>
            {
                loaded
                    ? <WebViewComponent plugins={pluginsList} handleWebViewMessage={handleWebViewMessage} />
                    : <Text>Loading...</Text>
            }
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
});
