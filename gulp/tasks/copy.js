var gulp    = require('gulp');
var config  = require('../config');

gulp.task('copy', function() {
  return gulp.src(config.copy.target)
    .pipe(gulp.dest(config.copy.output))
    ;
});
