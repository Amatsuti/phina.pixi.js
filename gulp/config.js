var fs = require('fs')
var recursiveReadSync = require('recursive-readdir-sync')

var banner = [
  "/* ",
  " * <%= pkg.name %> <%= pkg.version %>",
  " * <%= pkg.description %>",
  " * MIT Licensed",
  " * ",
  " * Copyright (C) 2019 Amatsuti",
  " */",
  "",
  "",
  "'use strict';",
  "",
  "",
].join('\n');

module.exports = {
  package: require('../package.json'),
  banner: banner,

  watch: {
    target: ['build']
  },

  build: {
    target: recursiveReadSync('./src'),
    output: './dist/',
  },

  copy: {
    target: [
    ],
    output: './dist/'
  },

  import: {
    target: [
      './node_modules/phina.js/build/phina.js',
      './node_modules/pixi.js/dist/pixi.js'
    ]
      .concat(recursiveReadSync('./dist')),
    output: './public/javascripts/'
  }

};
