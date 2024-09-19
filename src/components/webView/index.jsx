import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import handleWebViewMessage from '../../plugins/services/handlePluginMessages';
import { useSelector } from 'react-redux';
import { useThemeContext } from '../../contexts/themeContext';

/**
 * Component that renders a WebView with injected scripts and styles.
 * @param {Object} props - Component props.
 * @param {Array} props.plugins - List of plugins to be injected into the WebView.
 * @param {Function} props.handleWebViewMessage - Function to handle messages from the WebView.
 */
export default function WebViewComponent({ plugins = [] }) {
    const [injectedJS, setInjectedJS] = useState('');
    const { switchColorMode, switchDarkModeType } = useThemeContext();;
    const {resources} = useSelector(state => state.pluginResources);
    const webViewRef = useRef(null);

    const injectJs = () => {
        const scripts = plugins.map((plugin) => plugin.scripts).flat();
        if (webViewRef.current) {
            scripts.forEach((script) => {
                webViewRef.current.injectJavaScript(`
                    try {
                        ${script}
                    } catch (error) {
                        console.error('Error injecting script:', error);
                    }
                    true;
                `);
            });
        }
    };

    useEffect(() => {
        let allInjectedJS = '';
        
        plugins.forEach((plugin) => {
            const styles = plugin.styles.map((css) => css).join('\n');

            allInjectedJS += `
                (function() {
                    const styleElement = document.createElement('style');
                    styleElement.innerText = \`${styles}\`;
                    document.head.appendChild(styleElement);
                })();
                true;
            `;
        });

        setInjectedJS(allInjectedJS);
    }, [plugins]);


    return (
        <WebView
            ref={webViewRef}
            source={{ uri: 'https://bsky.app/' }}
            cacheMode={'LOAD_DEFAULT'}
            domStorageEnabled={true}
            databaseEnabled={true}
            style={styles.webView}
            javaScriptEnabled={true}
            allowFileAccess={true} 
            allowFileAccessFromFileURLs={true}
            allowUniversalAccessFromFileURLs={true}
            injectedJavaScript={injectedJS}
            onLoad={() => injectJs()}
            onMessage={(event) => {handleWebViewMessage(event, webViewRef, resources, {switchColorMode, switchDarkModeType})}}
        />
    );
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
    },
});
