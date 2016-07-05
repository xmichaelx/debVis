var pkg = require('./package.json');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var Builder = require('systemjs-builder');
var licenseTool = require('./tools/add-license-to-file');
var addLicenseToFile = licenseTool.addLicenseToFile;
var addLicenseTextToFile = licenseTool.addLicenseTextToFile;

// License info for minified files
var license = 'MIT/X11 License';

delete pkg.scripts;

var cjsPkg = Object.assign({}, pkg, {
  name: 'debvis',
  main: 'debvis.js',
  typings: 'debvis.d.ts'
});
var es6Pkg = Object.assign({}, cjsPkg, {
  name: 'debvis-es',
  main: 'debvis.js',
  typings: 'debvis.d.ts'
});

fs.writeFileSync('dist/cjs/package.json', JSON.stringify(cjsPkg, null, 2));
fs.writeFileSync('dist/cjs/LICENSE.txt', fs.readFileSync('./LICENSE.txt').toString());
fs.writeFileSync('dist/cjs/README.md', fs.readFileSync('./README.md').toString());

// Bundles for CJS only
mkdirp.sync('dist/cjs/bundles');
// UMD bundles
fs.writeFileSync('dist/cjs/bundles/debvis.umd.js', fs.readFileSync('dist/global/debvis.umd.js').toString());
fs.writeFileSync('dist/cjs/bundles/debvis.umd.min.js', fs.readFileSync('dist/global/debvis.umd.min.js').toString());
fs.writeFileSync('dist/cjs/bundles/debvis.umd.min.js.map', fs.readFileSync('dist/global/debvis.umd.min.js.map').toString());
// System bundles
fs.writeFileSync('dist/cjs/bundles/debvis.js', fs.readFileSync('dist/global/debvis.js').toString());
fs.writeFileSync('dist/cjs/bundles/debvis.min.js', fs.readFileSync('dist/global/debvis.min.js').toString());
fs.writeFileSync('dist/cjs/bundles/debvis.min.js.map', fs.readFileSync('dist/global/debvis.min.js.map').toString());

// ES6 Package
fs.writeFileSync('dist/es6/package.json', JSON.stringify(es6Pkg, null, 2));
fs.writeFileSync('dist/es6/LICENSE.txt', fs.readFileSync('./LICENSE.txt').toString());
fs.writeFileSync('dist/es6/README.md', fs.readFileSync('./README.md').toString());

// Add licenses to tops of bundles
addLicenseToFile('LICENSE.txt', 'dist/cjs/bundles/debvis.umd.js');
addLicenseTextToFile(license, 'dist/cjs/bundles/debvis.umd.min.js');
addLicenseToFile('LICENSE.txt', 'dist/cjs/bundles/debvis.js');
addLicenseTextToFile('license', 'dist/cjs/bundles/debvis.min.js');
addLicenseToFile('LICENSE.txt', 'dist/global/debvis.umd.js');
addLicenseTextToFile(license, 'dist/global/debvis.umd.min.js');
addLicenseToFile('LICENSE.txt', 'dist/global/debvis.js');
addLicenseTextToFile(license, 'dist/global/debvis.min.js');
