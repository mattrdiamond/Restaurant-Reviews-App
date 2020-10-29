var restaurant, newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", (event) => {
  initMap();
  setFooterDate();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map("map", {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
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
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName("id");
  if (!id) {
    // no id found in URL
    error = "No restaurant id in URL";
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById("restaurant-name");
  name.innerHTML = restaurant.name;

  const address = document.getElementById("restaurant-address");
  address.innerHTML = restaurant.address;

  const imageContainer = document.getElementById("image-container");
  const imageUrl = DBHelper.imageUrlForRestaurant(restaurant);
  imageContainer.style.backgroundImage = `url('${imageUrl}')`;

  const span = document.getElementById("background-image");
  span.setAttribute("aria-label", `An image of ${restaurant.name}`);

  const cuisine = document.getElementById("restaurant-cuisine");
  cuisine.innerHTML = `<i aria-hidden class="fa fa-cutlery"></i><span class='bold'>Cuisine: </span>${restaurant.cuisine_type}`;

  const neighborhood = document.getElementById("restaurant-neighborhood");
  neighborhood.innerHTML = `<i class="fa fa-map-marker" aria-hidden="true"></i><span class='bold'>Neighborhood: </span>${restaurant.neighborhood}`;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (
  operatingHours = self.restaurant.operating_hours
) => {
  const hours = document.getElementById("restaurant-hours");
  for (let key in operatingHours) {
    const row = document.createElement("tr");

    const day = document.createElement("td");
    day.className = "day";
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement("td");
    time.innerHTML = operatingHours[key].replace(",", ",<br/>");
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById("reviews-container");
  const title = document.createElement("h3");
  title.innerHTML = "Reviews";
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement("p");
    noReviews.innerHTML = "No reviews yet!";
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById("reviews-list");
  reviews.forEach((review) => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement("li");

  const date = document.createElement("p");
  date.innerHTML = review.date;
  li.appendChild(date);

  const name = document.createElement("p");
  name.innerHTML = review.name;
  li.appendChild(name);

  const starRating = document.createElement("div");
  starRating.className = "star-rating";
  starRating.innerHTML = createStarRating(review.rating);

  const ratingDescription = document.createElement("span");
  ratingDescription.innerHTML = `Rating: ${review.rating}`;
  ratingDescription.className = "sr-only";
  starRating.appendChild(ratingDescription);
  li.appendChild(starRating);

  const comments = document.createElement("p");
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Convert the review rating into a star rating
 */
createStarRating = (rating) => {
  const redStar = `<i aria-hidden class='fa fa-star'></i>`;
  const grayStar = `<i aria-hidden class='fa fa-star gray'></i>`;
  let string = "";
  for (let i = 0; i < 5; i++) {
    rating > 0 ? (string += redStar) : (string += grayStar);
    rating--;
  }
  return string;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById("breadcrumb");
  const li = document.createElement("li");
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/**
 * Set footer date to current year
 */
setFooterDate = () => {
  document.querySelector(".copyright").innerHTML = new Date().getFullYear();
};
