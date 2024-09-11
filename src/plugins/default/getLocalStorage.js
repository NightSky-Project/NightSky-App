export default `
    (function() {
        const localStorageData = { ...localStorage, messageType: 'localStorage' };
        window.ReactNativeWebView.postMessage(JSON.stringify(localStorageData));
    })();
`;