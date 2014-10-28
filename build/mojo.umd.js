import MOJO from '../index';

if (typeof define === 'function' && define.amd) {
    define([] , function() { return MOJO });
}
else if (typeof module !== 'undefined' && module.exports) {
    module.exports = MOJO;
}
else if (typeof this !== 'undefined') {
    this.MOJO = MOJO;
}