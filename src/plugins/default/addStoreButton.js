export default `
    (function() {
        function addStoreButton() {
            // check if the store button already exists
            if (document.querySelector('div.r-1wtj0ep:nth-child(1) > div:nth-child(3) > button')) {
                return;
            }
            const divToAdd = document.querySelector('div.r-1wtj0ep:nth-child(1) > div:nth-child(3)');
            if(!divToAdd) {
                setTimeout(addStoreButton, 1000);
                return;
            }
            divToAdd.style.display = 'flex';
            divToAdd.style.justifyContent = 'center';
            divToAdd.style.alignItems = 'center';

            const storeButton = document.createElement('button');
            const icon = document.createElement('img');
            icon.src = 'https://cdn-icons-png.freepik.com/512/6797/6797386.png';
            icon.style.width = '24px';
            icon.style.height = '24px';
            icon.style.filter = 'invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)'; 
            storeButton.appendChild(icon);
            storeButton.style.backgroundColor = 'transparent';
            storeButton.style.border = 'none';
            storeButton.style.cursor = 'pointer';
            storeButton.style.display = 'flex';
            storeButton.style.alignItems = 'center';
            storeButton.style.justifyContent = 'center';
            storeButton.onclick = () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ messageType: 'STORE' }));
            };
            divToAdd.insertBefore(storeButton, divToAdd.firstChild);
        }

        function isRootUrl() {
            return window.location.pathname === '/';
        }

        function onUrlChange(callback) {
            let oldHref = document.location.href;

            const body = document.querySelector("body");
            const observer = new MutationObserver((mutations) => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    callback();
                }
            });

            observer.observe(body, { childList: true, subtree: true });

            window.addEventListener('popstate', () => {
                callback();
            });
        }

        function initStoreBtn() {
            if (isRootUrl()) {
                if (document.readyState === 'complete') {
                    addStoreButton();
                } else {
                    document.addEventListener('DOMContentLoaded', addStoreButton);
                    window.addEventListener('load', addStoreButton);
                }
            }
        }

        initStoreBtn();
        onUrlChange(initStoreBtn);
    })();
`