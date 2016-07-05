/**
  @license
  
 **/
"format register";
System.register("xmichaelx/CSVReader", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var CSVReader = (function() {
    function CSVReader() {}
    CSVReader.readAsync = function(file) {
      return null;
    };
    return CSVReader;
  }());
  exports.CSVReader = CSVReader;
  global.define = __define;
  return module.exports;
});

System.register("xmichaelx/debvis", ["xmichaelx/CSVReader"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "use strict";
  var CSVReader_1 = require("xmichaelx/CSVReader");
  exports.CSVReader = CSVReader_1.CSVReader;
  global.define = __define;
  return module.exports;
});

