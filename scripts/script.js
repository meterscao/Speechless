setTimeout(function() {
    /* Example: Send data from the page to your Chrome extension */
    console.log('inject script !')
    document.dispatchEvent(new CustomEvent('event_get_global_data', {
        detail: window.$CONFIG.oid // Some variable from Gmail.
    }));
}, 0);