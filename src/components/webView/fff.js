window.pluginAssets = {};
window.pluginAssets['opensky-plugin-default/assets/icon.png'] = 'content://dev.rbd.opensky.FileSystemFileProvider/expo_files/plugins/pluginDefault/OpenSky-Plugin-main/assets/icon.png';
window.pluginAssets['opensky-plugin-default/html/trending-topics.html'] = 'content://dev.rbd.opensky.FileSystemFileProvider/expo_files/plugins/pluginDefault/OpenSky-Plugin-main/html/trending-topics.html';

                (function() {
                    const styleElement = document.createElement('style');
                    styleElement.innerText = `.trending-topics {
    font-family: Arial, sans-serif;
    /* color: #1DA1F2; */
    padding: 20px;
}

.trending-topics h2 {
    font-size: 20px;
    margin-bottom: 10px;
    /* color: #14171A; */
}

.trending-topics ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.trending-topics li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #E1E8ED;
}

.trending-topics li:last-child {
    border-bottom: none;
}

.trend-rank {
    font-weight: bold;
    /* color: #657786; */
    margin-right: 10px;
}

.trend-name {
    flex-grow: 1;
    font-weight: bold;
    /* color: #14171A; */
}

/* .trend-posts {
    color: #657786;
} */`;
                    document.head.appendChild(styleElement);

                    (function() {
(function() {
    function changeSvgIcon() {
        const svgIcon = document.querySelector('div.r-1wtj0ep:nth-child(1) > div:nth-child(2) > svg:nth-child(1) > path:nth-child(1)');

        if (svgIcon) {
            const svgElement = svgIcon.closest('svg');
            const gradientId = 'customGradient';

            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', gradientId);
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '100%');

            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('style', 'stop-color: #f6bf75; stop-opacity: 1');

            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '35%');
            stop2.setAttribute('style', 'stop-color: #d77185; stop-opacity: 1');

            const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop3.setAttribute('offset', '65%');
            stop3.setAttribute('style', 'stop-color: #8766ac; stop-opacity: 1');

            const stop4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop4.setAttribute('offset', '100%');
            stop4.setAttribute('style', 'stop-color: #4150b1; stop-opacity: 1');

            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            gradient.appendChild(stop3);
            gradient.appendChild(stop4);

            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.appendChild(gradient);

            svgElement.insertBefore(defs, svgElement.firstChild);
            svgIcon.setAttribute('fill', `url(#${gradientId})`);
        } else {
            // console.warn('SVG icon not found');
        }
    }


    function isRootUrl() { // Check if the current URL is the root that contains the SVG logo
        return window.location.pathname === '/';
    }

    // Grants that the script will apply changes correctly after the page is fully loaded or when the DOM changes
    if (isRootUrl()) {
        if (document.readyState === 'complete') {
            changeSvgIcon();
        } else {
            document.addEventListener('DOMContentLoaded', changeSvgIcon);
            window.addEventListener('load', changeSvgIcon);
        }

        // Observe DOM changes and reapply if necessary
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                changeSvgIcon();
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

})();

})();
(function() {

    function addTrendingTopics() {
        const suggestedUsersDiv = document.querySelector('.r-sa2ff0');
        const trendingHtml = window.pluginAssets['opensky-plugin-default/html/trending-topics.html'];

        if (!suggestedUsersDiv || !trendingHtml) {
            return;
        }

        // Keep all divs up to the div that contains the button and remove the subsequent ones
        let keep = true;
        Array.from(suggestedUsersDiv.children).forEach((child) => {
            if (!keep) { // Remove all subsequent divs
                suggestedUsersDiv.removeChild(child);
                return;
            }

            // Check if there is a single div with a single button inside
            const button = child.childElementCount === 1 && child.children[0].childElementCount === 1 && child.children[0].children[0].tagName === 'BUTTON';

            // If the button is found, mark to stop removing subsequent divs
            if (button) {
                keep = false;
            }
        });

        // Create the new div for Trending Topics
        const trendingDiv = document.createElement('div');
        trendingDiv.innerHTML = trendingHtml;
        trendingDiv.classList.add('css-175oi2r');

        // Insert the new Trending Topics div before the suggested users div
        suggestedUsersDiv.parentNode.insertBefore(trendingDiv, suggestedUsersDiv);
    }

    function isRootUrl() {
        return window.location.pathname === '/search';
    }

    // Grants that the script will apply changes correctly after the page is fully loaded or when the DOM changes
    if (isRootUrl()) {
        if (document.readyState === 'complete') {
            addTrendingTopics();
        } else {
            document.addEventListener('DOMContentLoaded', addTrendingTopics);
            window.addEventListener('load', addTrendingTopics);
        }

        // Observe DOM changes and reapply if necessary
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                addTrendingTopics();
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

})();
                })();

                (function() {
                    const styleElement = document.createElement('style');
                    styleElement.innerText = ``;
                    document.head.appendChild(styleElement);


    (function() {
        const localStorageData = { ...localStorage, messageType: 'localStorage' };
        window.ReactNativeWebView.postMessage(JSON.stringify(localStorageData));
    })();


    (function() {
        function monitorChanges() {
            const htmlElement = document.documentElement;
            const validThemes = ['theme--dim', 'theme--light', 'theme--dark'];

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const currentClass = htmlElement.className;
                        if (validThemes.includes(currentClass)) {
                            const localStorageData = { ...localStorage, messageType: 'localStorage' };
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

                })();