'option explicit';

var Header = require('./Header.js');

exports.unpack = function(data, from) {
    return {
        header:          Header.unpack(data, from),
        pic_num:         data.readInt8(from + Header.LENGTH),
        cam_num:         data.readInt8(from + Header.LENGTH + 1),
        pic_time:        data.readInt32BE(from + Header.LENGTH + 2),
        pic_chunk_count: data.readInt16BE(from + Header.LENGTH + 6),
        pic_chunk_num:   data.readInt16BE(from + Header.LENGTH + 8),
        pic_chunk_data:  data.slice(from + Header.LENGTH + 10)
    };
};
