'option explicit';

var Header = require('./Header.js');
var WsmData = require('./WsmData.js');

exports.unpack = function(data, from) {
    return {
        header: Header.unpack(data, from),
        data:   WsmData.unpack(data, from + Header.LENGTH)
    };
};
