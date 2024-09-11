export default `
    (function() {
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;

        console.log = function(...args) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', messages: args }));
            originalConsoleLog.apply(console, args);
        };

        console.error = function(...args) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', messages: args }));
            originalConsoleError.apply(console, args);
        };

        console.warn = function(...args) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'warn', messages: args }));
            originalConsoleWarn.apply(console, args);
        };
    })();
`;