import React, { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, Text } from 'react-native';
import WebViewComponent from '../components/webView';
import { useThemeContext } from '../contexts/themeContext';
import { loadPluginsFromDirectory } from '../plugins/scripts/pluginsLoader';
import { downloadPlugin } from '../plugins/scripts/downloadPlugin';

export default function BskyPage() {
    const { switchColorMode, switchDarkModeType } = useThemeContext();
    const [pluginsList, setPluginsList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    // const [downloaded, setDownloaded] = useState(false);


    useEffect(() => {
        const loadPlugins = async () => {
            // if(!downloaded) { // Test only
            //     await downloadPlugin('pluginSample');
            //     setDownloaded(true);
            // }
            const plugins = await loadPluginsFromDirectory();
            setPluginsList(plugins);
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
        webViewLogger(event);
        try {
            const message = JSON.parse(event.nativeEvent.data);
            if(!message.messageType || message.messageType !== 'localStorage') return;
            const bskyStorage = JSON.parse(message.BSKY_STORAGE);
            const colorMode_ = bskyStorage.colorMode;
            const darkModeType = bskyStorage.darkTheme;

            await setTheme(colorMode_, darkModeType);
        } catch (error) {
            console.error('Failed to parse WebView message:', error);
        }
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

function webViewLogger(event) {
    try {
        const data = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
            case 'log':
                console.log('WebView Log:', ...data.messages);
                break;
            case 'error':
                console.error('WebView Error:', ...data.messages);
                break;
            case 'warn':
                console.warn('WebView Warn:', ...data.messages);
                break;
            default:
                // console.log('WebView Message:', data);
        }
    } catch (error) {
        console.error('Failed to parse WebView message on webViewLogger:', error);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
});
