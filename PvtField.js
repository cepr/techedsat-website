'option explicit';

exports.LENGTH = 52;

exports.unpack = function(data, from) {
    return {
        time: data.readInt32BE(from + 0),
        px:   data.readDoubleBE(from + 4),
        py:   data.readDoubleBE(from + 12),
        pz:   data.readDoubleBE(from + 20),
        vx:   data.readDoubleBE(from + 28),
        vy:   data.readDoubleBE(from + 36),
        vz:   data.readDoubleBE(from + 44)
    };
};
