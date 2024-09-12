import webViewLogger from "../../utils/webViewLogger";
import * as FileSystem from 'expo-file-system';

/**
 * Handles messages from the WebView.
 * @param {Object} event - Event object from the WebView.
 * @param {Object} webViewRef - Reference to the WebView component.
 * @param {Array} resources - List of plugin resources from the Redux store.
 */
const handleWebViewMessage = async (event, webViewRef, resources, themeProps) => {
    webViewLogger(event);
    try {
        const message = JSON.parse(event.nativeEvent.data);

        if(message.messageType){
            switch (message.messageType){
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