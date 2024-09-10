import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet, View, Text } from 'react-native';

export default function WebViewComponent({ ContentToInject = [], handleWebViewMessage }) {
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
                ContentToInject.length > 0
                    && ContentToInject.join('\n')
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
