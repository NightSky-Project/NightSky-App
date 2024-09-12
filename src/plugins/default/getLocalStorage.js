export default `
    (function() {
        const localStorageData = { ...localStorage, messageType: 'LOCAL_STORAGE' };
        window.ReactNativeWebView.postMessage(JSON.stringify(localStorageData));
    })();
`;