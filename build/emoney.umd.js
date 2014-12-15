import E$ from './index';

if (typeof define == 'function' && define.amd) {
  define([] , function() { return E$ });
}
else if (typeof module != 'undefined' && module.exports) {
  module.exports = E$;
}
else if (typeof this != 'undefined') {
  this.E$ = E$;
}