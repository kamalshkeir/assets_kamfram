const STATIC_CACHE_NAME = "static-v1";
const DYNAMIC_CACHE_NAME = "dynamic-v1";
const STATIC_FILES = [
    //admin
    "/admin/admin_index.js",
    "/admin/all_models.js",
    "/admin/envelope-solid.svg",
    "/admin/jodit_editor.min.css",
    "/admin/jodit_editor.min.js",
    "/admin/lock-solid.svg",
    "/admin/login.js",
    "/admin/logo192.png",
    "/admin/single_model.js",
    "/admin/style.css",
    //tools
    "/tools/getandpost.js",
    "/tools/notification.css",
    "/tools/notification.js",
    //docs
    "/docs/docs-bundle.js",
    "/docs/docs-ui-standalone-preset.js",
    "/docs/docs.css",
    "/docs/docs.js",
    "/docs/docs.json",
    "/docs/swagger-ui-bundle.js.map",
    "/docs/swagger-ui-standalone-preset.js.map",
    "/docs/swagger-ui.css.map",
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


