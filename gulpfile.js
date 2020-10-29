const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");

// Compile sass
function compileSass() {
  return gulp
    .src(["scss/*.scss"])
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
}

// Watch & serve
gulp.task(
  "serve",
  gulp.series(compileSass, function () {
    browserSync.init({
      server: "./",
    });

    gulp.watch(["scss/*.scss"], gulp.series(compileSass));
    gulp.watch(["./*.html"]).on("change", browserSync.reload);
  })
);

// Default
gulp.task("default", gulp.series("serve"));
