'option explicit';

var Header = require('./Header.js');
var PvtField = require('./PvtField.js');

exports.unpack = function(data, from) {
    return {
        header: Header.unpack(data, from),
        data:   PvtField.unpack(data, from + Header.LENGTH)
    };
};
