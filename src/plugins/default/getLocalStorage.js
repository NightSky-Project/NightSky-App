export default `
    (function() {
        const localStorageData = { ...localStorage };
        window.ReactNativeWebView.postMessage(JSON.stringify(localStorageData));
    })();
`;