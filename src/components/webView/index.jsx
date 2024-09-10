import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

export default function WebViewComponent({ plugins = [], handleWebViewMessage }) {
    const webViewRef = useRef(null);

    return (
        <WebView
            ref={webViewRef}
            source={{ uri: 'https://bsky.app/' }}
            cacheMode={'LOAD_DEFAULT'}
            domStorageEnabled={true}
            databaseEnabled={true}
            style={styles.webView}
            javaScriptEnabled={true}
            injectedJavaScript={
                plugins.length > 0 ? plugins.join('\n') : ''
            }
            onMessage={handleWebViewMessage}
        />
    );
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
    },
});
