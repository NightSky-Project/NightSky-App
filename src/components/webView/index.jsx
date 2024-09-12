import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import handleWebViewMessage from '../../plugins/services/handleMessages';
import webViewLogger from '../../utils/webViewLogger';
import { useDispatch, useSelector } from 'react-redux';
import { useThemeContext } from '../../contexts/themeContext';

/**
 * Component that renders a WebView with injected scripts and styles.
 * @param {Object} props - Component props.
 * @param {Array} props.plugins - List of plugins to be injected into the WebView.
 * @param {Function} props.handleWebViewMessage - Function to handle messages from the WebView.
 */
export default function WebViewComponent({ plugins = [], webViewRef }) {
    const [injectedJS, setInjectedJS] = useState('');
    const { switchColorMode, switchDarkModeType } = useThemeContext();
    const dispatch = useDispatch();
    const {resources} = useSelector(state => state.pluginResources);

    useEffect(() => {
        let allInjectedJS = '';

        plugins.forEach((plugin) => {
            const styles = plugin.styles.map((css) => css).join('\n');
            const scripts = plugin.scripts.join('\n');

            // Combine all into a script to be injected
            allInjectedJS += `
                (function() {
                    const styleElement = document.createElement('style');
                    styleElement.innerText = \`${styles}\`;
                    document.head.appendChild(styleElement);

                    ${scripts}
                })();
            `;
        });

        // console.log('Injected JS:', allInjectedJS);
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
            onMessage={(event) => {handleWebViewMessage(event, webViewRef, resources, {switchColorMode, switchDarkModeType})}}
        />
    );
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
    },
});
