// register service worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('./sw.js')
//       .then(reg => console.log('Service Worker: Registered'))
//       .catch(err => console.log(`Service Worker: Registration Error: ${err}`))
//   });
// }

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js", { scope: "./" })
    .then(function(registration) {
      console.log("Service Worker Registered");
    });

  navigator.serviceWorker.ready.then(function(registration) {
    console.log("Service Worker Ready");
  });
}
