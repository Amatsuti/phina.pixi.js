var gulp    = require('gulp');
var config  = require('../config');

gulp.task('import', ['build','copy'], function() {
  return gulp.src(config.import.target)
    .pipe(gulp.dest(config.import.output))
    ;
});
