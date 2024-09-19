(function() {
    /**
     * FeedLibrary provides an interface to manipulate the styles of feed.
     * 
     * @example
     * window.followingFeed.styles({
     * color: 'red',
     * backgroundColor: 'yellow',
     * fontSize: '20px'
     * });
     * 
     * @example
     * window.followingFeed.getTexts();
     */
    class FollowingFeedLibrary {
        getPosts() {
            const followingFeed = document.querySelectorAll('div.r-13awgt0:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)');
            const childElements = [];
            followingFeed.forEach(feed => {
                childElements.push(...feed.children);
            });
            return childElements;
        }

        styles(styles) {
            const childElements = this.getPosts();
            childElements.forEach((child) => {
                for (const property in styles) {
                    if (styles.hasOwnProperty(property)) {
                        child.style[property] = styles[property];
                    }
                }
            });
        }

        text(styles) {
            const childElements = this.getPosts();
            childElements.forEach((child) => {
                // Posts excluindo as threads 
                // TODO: Incluir threads 
                const textDiv = child.querySelector('div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)');
                if (textDiv) {
                    for (const property in styles) {
                    if (styles.hasOwnProperty(property)) {
                        textDiv.style[property] = styles[property];
                    }
                    }
                }
            });
        }

        getTexts(){
            const childElements = this.getPosts();
            const texts = [];
            childElements.forEach((child) => {
                // Posts excluindo as threads TODO: Incluir threads
                const textDiv = child.querySelector('div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)');
                if (textDiv) {
                    texts.push(textDiv.textContent);
                }
            });
            return texts;
        }
    }

    window.followingFeed = new FollowingFeedLibrary();
})();