const cacheName = "v2";
const cacheFiles = [
  "./",
  "./index.html",
  "./restaurant.html",
  "./css/styles.css",
  "./js/dbhelper.js",
  "./js/main.js",
  "./js/restaurant_info.js",
  "./js/sw_register.js",
  "./data/restaurants.json",
  "./img/1.jpg",
  "./img/2.jpg",
  "./img/3.jpg",
  "./img/4.jpg",
  "./img/5.jpg",
  "./img/6.jpg",
  "./img/7.jpg",
  "./img/8.jpg",
  "./img/9.jpg",
  "./img/10.jpg",
  "./img/dinewise.svg",
  "https://fonts.googleapis.com/css?family=Poppins:600|Roboto:300,500",
  "https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css",
  "https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/fonts/fontawesome-webfont.ttf?v=4.6.1",
  "https://unpkg.com/leaflet@1.3.1/dist/leaflet.js",
  "https://unpkg.com/leaflet@1.3.1/dist/leaflet.css"
];

/**
 * Install service Worker
 */
// self.addEventListener("install", e => {
//   e.waitUntil(
//     caches
//       .open(cacheName)
//       .then(function(cache) {
//         return cache.addAll(cacheFiles);
//       })
//       .then(() => self.skipWaiting())
//   );
// });

// /**
//  * Activate service Worker
//  */
// self.addEventListener("activate", e => {
//   console.log("Service Worker: Activated");
//   // Remove unwanted caches
//   e.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cache => {
//           if (cache !== cacheName) {
//             console.log("Service Worker: Clearing Old Cache");
//             return caches.delete(cache);
//           }
//         })
//       );
//     })
//   );
// });

// /**
//  * Call Fetch event to request resources from cache or network
//  */
// self.addEventListener("fetch", function(e) {
//   e.respondWith(
//     // 1. Check the cache first. (ignoreSearch will ignore the query string in the url)
//     caches.match(e.request, { ignoreSearch: true }).then(response => {
//       if (response) {
//         console.log("found in cache", e.request);
//         return response;
//       } else {
//         // 2. If request not in the cache, fetch from network
//         console.log("could not find in cache, FETCHING!", e.request);
//         return fetch(e.request)
//           .then(response => {
//             // 3. Ensure response is valid and that the request is from our origin
//             //    Prevents caching of every map tile that a user views
//             if (
//               !response ||
//               response.status !== 200 ||
//               response.type !== "basic"
//             ) {
//               return response;
//             }
//             // 4. Clone response and send the original to the browser and a copy to the cache
//             const responseClone = response.clone();
//             caches.open(cacheName).then(cache => {
//               cache.put(e.request, responseClone);
//             });
//             return response;
//           })
//           .catch(err => {
//             console.error(err);
//           });
//       }
//     })
//   );
// });
