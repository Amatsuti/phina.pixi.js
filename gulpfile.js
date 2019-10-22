var gulp = require('gulp');
var requireDir = require('require-dir');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
requireDir('./gulp/tasks', {recurse: true});

var config = require('./gulp/config');
// watch
gulp.task('watch', function() {
  config.watch.target.forEach(function(task) {
    gulp.watch(config[task].target, [task]);
  });
});

function reload() {
  browserSync.reload({ stream: false });
};

gulp.task('browsersync', function() {
  browserSync.init({
    files: ['public/**/*.*', 'views/**/*.*'], // BrowserSyncにまかせるファイル群
    proxy: 'http://localhost:3000',  // express の動作するポートにプロキシ
    port: 4000,  // BrowserSync は 4000 番ポートで起動
    open: false  // ブラウザ open しない
  });
});

gulp.task('serve', ['browsersync'], function () {
  nodemon({ 
    script: './bin/www',
    ext: 'js html css',
    tasks: ['build','import'],
    ignore: [  // nodemon で監視しないディレクトリ
      'node_modules',
      '.git'
    ],
    env: {
      'NODE_ENV': 'development'
    },
    watch: [
      'src/**/'
    ],
    stdout: false  // Express の再起動時のログを監視するため
  }).on('readable', function() {
  this.stdout.on('data', function(chunk) {
  if (/^Express\ server\ listening/.test(chunk)) {
        // Express の再起動が完了したら、reload() でBrowserSync に通知。
        // ※Express で出力する起動時のメッセージに合わせて比較文字列は修正
        reload();
      }
      process.stdout.write(chunk);
    });
    this.stderr.on('data', function(chunk) {
      process.stderr.write(chunk);
    });
  });
});

gulp.task('default', ['copy','build','import','serve']);