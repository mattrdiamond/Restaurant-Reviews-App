let restaurants, neighborhoods, cuisines;
var newMap;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
  setFooterDate();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById("neighborhoods-select");
  neighborhoods.forEach((neighborhood) => {
    const option = document.createElement("option");
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    option.setAttribute("role", "option");
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById("cuisines-select");

  cuisines.forEach((cuisine) => {
    const option = document.createElement("option");
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map("map", {
    center: [40.716216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false,
  });
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{style_id}/tiles/{z}/{x}/{y}@2x?access_token={mapboxToken}",
    {
      mapboxToken:
        "pk.eyJ1IjoibWF0dGRpYW1vbmRkZXYiLCJhIjoiY2tjcDh2eXM5MGRkODJ4czZ3bjZxeGxkNCJ9.iM7EmSf9geONwwSrmGuRaw",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      style_id: "mattdiamonddev/ckgtqdos8034c19kx0svd1skt",
    }
  ).addTo(newMap);

  updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById("cuisines-select");
  const nSelect = document.getElementById("neighborhoods-select");

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    (error, restaurants) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
      }
    }
  );
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById("restaurants-list");
  ul.innerHTML = "";

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach((marker) => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById("restaurants-list");
  restaurants.forEach((restaurant) => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const restaurantUrl = DBHelper.urlForRestaurant(restaurant);

  const li = document.createElement("li");

  const imageLink = document.createElement("a");
  imageLink.href = restaurantUrl;
  li.append(imageLink);

  const image = document.createElement("img");
  image.className = "restaurant-img";
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = `An image of ${restaurant.name}`;
  imageLink.append(image);

  const restaurantInfo = document.createElement("div");
  restaurantInfo.className = "restaurant-info";
  li.append(restaurantInfo);

  const name = document.createElement("a");
  name.className = "restaurant-name";
  name.href = restaurantUrl;
  name.innerHTML = restaurant.name;
  restaurantInfo.append(name);

  const neighborhood = document.createElement("p");
  neighborhood.innerHTML = restaurant.neighborhood;
  restaurantInfo.append(neighborhood);

  const address = document.createElement("p");
  const addressFormat = restaurant.address.replace(",", "<br/>");
  address.innerHTML = addressFormat;
  restaurantInfo.append(address);

  const more = document.createElement("button");
  more.innerHTML = "View Details";
  more.onclick = () => {
    location.href = restaurantUrl;
  };
  restaurantInfo.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach((restaurant) => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });
};

/**
 * Set footer date to current year
 */
setFooterDate = () => {
  document.querySelector(".copyright").innerHTML = new Date().getFullYear();
};
