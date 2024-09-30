import webViewLogger from "../../utils/webViewLogger";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

/**
 * Handles messages from the WebView.
 * @param {Object} event - Event object from the WebView.
 * @param {Object} webViewRef - Reference to the WebView component.
 * @param {Array} resources - List of plugin resources from the Redux store.
 */
const handleWebViewMessage = async (event, webViewRef, resources, themeProps, navigate) => {
    try {
        if (!event.nativeEvent.data) return;
        webViewLogger(event);
        const message = JSON.parse(event.nativeEvent.data);

        if (message.messageType) {
            switch (message.messageType) {
                case 'LOCAL_STORAGE':
                    const bskyStorage = JSON.parse(message.BSKY_STORAGE);
                    const colorMode_ = bskyStorage.colorMode;
                    const darkModeType = bskyStorage.darkTheme;
                    await setTheme(colorMode_, darkModeType, themeProps.switchColorMode, themeProps.switchDarkModeType);
                    break;
                case 'FETCH_RESOURCE':
                    const { pluginSlug, resource } = message;

                    // Retrieve the requested resource
                    const pluginResources = resources.find(plugin => plugin.pluginSlug === pluginSlug);
                    const resourcePath = pluginResources.resources.find(res => res.resource === resource).uri;
                    const content = await FileSystem.readAsStringAsync(resourcePath);

                    // Send the content back to the WebView
                    webViewRef.current.injectJavaScript(`
                        (function() {
                            // Handle the received content
                            window.receiveResource(\`${resourcePath}\`, \`${content}\`);
                        })();
                    `);
                    break;
                case 'STORE':
                    navigate('/store');
                    break;
                case 'FETCH_DATA':
                    const savedData = await AsyncStorage.getItem(`${message.name}_data`);
                    if(!savedData) {
                        webViewRef.current.injectJavaScript(`
                            (function() {
                                // Handle the received data
                                window.receiveData(\`${message.name}\`, null);
                            })();
                        `);
                        return;
                    }
                    const savedData_ = JSON.parse(savedData);
                    const contentSaved = {
                        trends: savedData_.trends,
                        time: savedData_.time,
                    }
                    webViewRef.current.injectJavaScript(`
                        (function() {
                            // Handle the received data
                            window.receiveData(\`${message.name}\`, ${JSON.stringify(contentSaved)});
                        })();
                    `);
                    break;
                case 'SAVE_DATA':
                    await AsyncStorage.setItem(`${message.name}_data`, JSON.stringify(message.data));
                    break;
                case 'FETCH_API': 
                    const { url, name } = message;
                    const response = await axios.get(url).then(res => res.data).catch(err => {
                        console.error('Failed to fetch API:', err);
                        return null;
                    });
                    if(!response) return;
                    const content_ = {
                        trends: response,
                    }
                    webViewRef.current.injectJavaScript(`
                        (function() {
                            // Handle the received API response
                            window.receiveData(\`${name}\`, ${JSON.stringify(content_)});
                        })();
                    `);
                    break;
            }
        }
    } catch (error) {
        console.error('Failed to process WebView message:', error);
    }
};

const setTheme = async (colorMode, darkModeType, switchColorMode, switchDarkModeType) => {
    await Promise.all([
        switchColorMode(colorMode),
        switchDarkModeType(darkModeType),
    ]);
}

export default handleWebViewMessage;