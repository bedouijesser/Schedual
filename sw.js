const staticCache = 'site-static-v0.2.2';
const dynamicCache = 'site-dynamic-v0.2.2';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/lib/materialize.min.js',
    '/css/style.css',
    '/css/lib/materialize.min.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html' 
];
// limite cache size function
const limitCacheSize = (name , size) => {
    caches.open(name).then(keys => {
        if (keys.length > size) {
            caches.delete(keys[0]).then(limitCacheSize(name,size));
        }
    })
}
// install event
self.addEventListener('install', e  => {
    // console.log("service worker has been installed");
    e.waitUntil(
        caches.open(staticCache).then(cache => {
            console.log("caching shell assets");
            cache.addAll(assets);
        })
    );
}); 

// activation event
self.addEventListener('activate', e => {
    // console.log("Service worker has been activated");
    e.waitUntil(
        caches.keys().then( keys => {
            // console.log(keys);
        return Promise.all(keys
            .filter(key => key !== staticCache && key !== dynamicCache)
            .map(key => caches.delete(key)))
        })
    );
});

// fetch event
self.addEventListener('fetch', e => {
    // console.log("fetch event", e);
    e.respondWith(
        caches.match(e.request).then(cacheRes => {
            return cacheRes || fetch(e.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(e.request.url, fetchRes.clone())
                    limitCacheSize(dynamicCache, 15);
                    return fetchRes;
                })
            }).catch(() => {
                if (e.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html')
                }
            })
        })
    )
});
//