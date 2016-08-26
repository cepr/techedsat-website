'option explicit';

var Header = require('./Header.js');
var PvtField = require('./PvtField.js');
var WsmData = require('./WsmData.js');

exports.unpack = function(data, from) {
    return {
        header:   Header.unpack(data, from),
        gps_data: PvtField.unpack(data, from + Header.LENGTH),
        wsm_data: WsmData.unpack(data, from + Header.LENGTH + PvtField.LENGTH)
    };
};
