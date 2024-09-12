
export default function webViewLogger(event) {
    try {
        const data = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
            case 'log':
                console.log('WebView Log:', ...data.messages);
                break;
            case 'error':
                console.log('WebView Error:', ...data.messages);
                break;
            case 'warn':
                console.log('WebView Warn:', ...data.messages);
                break;
            default:
                // console.log('WebView Message:', data);
        }
    } catch (error) {
        console.error('Failed to parse WebView message on webViewLogger:', error);
    }
}

