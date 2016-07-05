var browserify = require('browserify');
var fs = require('fs');

var b = browserify(['dist/cjs/debvis.js'], {
  baseDir: 'dist/cjs',
  standalone: 'debvis'
});

b.bundle().pipe(fs.createWriteStream('dist/global/debvis.umd.js'));

