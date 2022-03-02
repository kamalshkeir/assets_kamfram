const STATIC_CACHE_NAME = "static-v1";
const DYNAMIC_CACHE_NAME = "dynamic-v1";
const STATIC_FILES = [
    //admin
    "/static/admin/admin_index.js",
    "/static/admin/all_models.js",
    "/static/admin/envelope-solid.svg",
    "/static/admin/jodit_editor.min.css",
    "/static/admin/jodit_editor.min.js",
    "/static/admin/lock-solid.svg",
    "/static/admin/login.js",
    "/static/admin/logo192.png",
    "/static/admin/single_model.js",
    "/static/admin/style.css",
    //tools
    "/static/tools/getandpost.js",
    "/static/tools/notification.css",
    "/static/tools/notification.js",
    //docs
    "/static/docs/docs-bundle.js",
    "/static/docs/docs-ui-standalone-preset.js",
    "/static/docs/docs.css",
    "/static/docs/docs.js",
    "/static/docs/docs.json",
    "/static/docs/swagger-ui-bundle.js.map",
    "/static/docs/swagger-ui-standalone-preset.js.map",
    "/static/docs/swagger-ui.css.map",
    //pwa
    "/sw.js",
    "/manifest.webmanifest",
    "/offline"
    // Your extras static files
];


self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_FILES);
        })
    );
});


// Clear duplicated cache on activate
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(keycache => {
                    if(keycache !== STATIC_CACHE_NAME && keycache !== DYNAMIC_CACHE_NAME) {
                        return caches.delete(keycache);
                    }
                })
            );
        })
    );
});




function isInArray(string, array) {
    let domain = self.location.origin;
    for (var i=0; i<array.length; i++) {
        if(domain+array[i] === string ) {
            return true;
        }
    }
    return false;
}



self.addEventListener("fetch", e => {
    if(!(e.request.url.indexOf('http') === 0)) return; //ignore chrome flags
    if(e.request.method != "GET") return; // accept only get methods

    if (isInArray(e.request.url,STATIC_FILES)) {
        e.respondWith(
            caches.match(e.request)
        );
    } else {
        e.respondWith(
            fetch(e.request)
            .then((res) => {
                let clone = res.clone()
                caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                    cache.put(e.request.url, clone);
                })
                return res;
                
            }).catch(() => {
                const res = caches.match(e.request);
                if (res) {
                    return res;
                } else {
                    return caches.match("/offline");
                }
            })
        );
    }
 
});


