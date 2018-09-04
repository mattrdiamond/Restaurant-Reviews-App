# Project Overview
Dine Wise is a website that allows the user to filter restaurant reviews by location and/or cuisine. It also integrates the Mapbox API to show the restaurant location on an interactive map. For this assignment, I transformed a static website lacking in design and accessibility into a responsive design that is also accessible for screen reader use. I also converted it into a Progressive Web Application that uses a Service Worker to cache all of the site’s assets, so that any page that has visited by a user will be accessible offline.

![Screenshot of Dine Wise](img/dinewise_screenshot.jpg)

## Accessibility Features
1.	Ensured that `alt` attributes are present and descriptive for all images.
2.	Added screen-reader-only attributes to provide useful supplementary text for assistive technologies.
3.	All colors meet WCAG 2.0 level AA requirements, with a contrast ratio of at least 4:5:1 for normal text and 3:1 for large text.


## Running Instructions
1.	Test to make sure you have Node and NPM installed by running `node -v` and `npm -v` in terminal.
2.	Click on "Clone or Download" on this repository page to download .zip file.
3.	Open the root folder of the repository in terminal.
4.	Run `npm install` in terminal to install the dependencies.
5.	Start a local server to run the app:
    -	Run `npm start` in terminal.
    -	This will start a local dev server on (http://http://localhost:3000)
