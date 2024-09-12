export default `
    (function() {
        function monitorChanges() {
            const htmlElement = document.documentElement;
            const validThemes = ['theme--dim', 'theme--light', 'theme--dark'];

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const currentClass = htmlElement.className;
                        if (validThemes.includes(currentClass)) {
                            const localStorageData = { ...localStorage, messageType: 'LOCAL_STORAGE' };
                            window.ReactNativeWebView.postMessage(JSON.stringify(localStorageData));
                        }
                    }
                });
            });

            observer.observe(htmlElement, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        monitorChanges();
    })();
`;
