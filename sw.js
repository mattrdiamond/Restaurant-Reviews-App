const cacheName = 'v1';

const cacheAssets = [
  '/',
  'index.html',
  'restaurant.html',
  'css/styles.css',
	'js/dbhelper.js',
	'js/main.js',
	'js/restaurant_info.js',
	'js/sw_register.js',
	'img/1.jpg',
	'img/2.jpg',
	'img/3.jpg',
	'img/4.jpg',
	'img/5.jpg',
	'img/6.jpg',
	'img/7.jpg',
	'img/8.jpg',
	'img/9.jpg',
	'img/10.jpg',
  'img/dinewise.svg',
  'https://fonts.googleapis.com/css?family=Poppins:600',
  'https://fonts.googleapis.com/css?family=Roboto:300,500',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css'
];

/**
 * Install service Worker
 */
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');

  //wait until promise is resolved before terminating SW
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      // force waiting SW to become active SW
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate service Worker
 */
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

/**
 * Call Fetch event to request resources from cache or network
 */
self.addEventListener('fetch', e => {
  e.respondWith(
    // 1. Check the cache first. ignoreSearch will ignore the query string in the url
    caches.match(e.request, {ignoreSearch: true}).then(response => {
      if (response) {
        return response;
      }
      // 2. Since e.request will be sent to cache, create a copy to send to browser
      let networkRequest = e.request.clone();
      // 3. If request not in the cache, fetch from network
      return fetch(networkRequest).then(response => {
        // 4. Ensure response is valid and that the request is from our origin
        if(!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // 5. Clone response and send the original to the browser and a copy to the cache
        let cacheResponse = response.clone();
        // 6. Add network request to cache
        caches.open(cacheName)
          .then(cache => {
            cache.put(e.request, cacheResponse);
          });
        return response;
      });
    })
  );
});



// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.open(cacheName)
//       .then(cache => cache.match(event.request, {ignoreSearch: true}))
//       .then(response => {
//       return response || fetch(event.request);
//     })
//   );
// });
