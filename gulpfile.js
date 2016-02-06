var gulp        = require('gulp');
var jshint 	    = require('gulp-jshint');


// inspectar .js skrár og birtir villur
gulp.task('inspect', function () {
  return gulp.src(['./**/*.js', '!node_modules/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', ['inspect']);