import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

/**
 * Component that renders a WebView with injected scripts and styles.
 * @param {Object} props - Component props.
 * @param {Array} props.plugins - List of plugins to be injected into the WebView.
 * @param {Function} props.handleWebViewMessage - Function to handle messages from the WebView.
 */
export default function WebViewComponent({ plugins = [], handleWebViewMessage }) {
    const webViewRef = useRef(null);
    const [injectedJS, setInjectedJS] = useState('');

    useEffect(() => {
        let allInjectedJS = 'window.pluginAssets = {};\n';

        plugins.forEach((plugin) => {
            // Add assets to the global object for access in scripts
            for (const [assetName, assetUri] of Object.entries(plugin.assets || {})) {
                allInjectedJS += `window.pluginAssets['${assetName}'] = '${assetUri}';\n`;
            }

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
            injectedJavaScript={injectedJS}
            onMessage={handleWebViewMessage}
        />
    );
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
    },
});
