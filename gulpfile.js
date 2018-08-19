const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');


// Compile sass
gulp.task('sass', function() {
  return gulp.src(['scss/*.scss'])
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
});

// Watch & serve
gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: './'
  });

  gulp.watch(['scss/*.scss'], ['sass']);
  gulp.watch(['./*.html']).on('change', browserSync.reload);
});

// Default
gulp.task('default', ['serve']);
