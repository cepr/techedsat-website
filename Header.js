'option explicit';

exports.LENGTH = 25;
exports.MSG_TYP_SOH = 72;
exports.MSG_TYP_GPS = 71;
exports.MSG_TYP_WSM = 87;
exports.MSG_TYP_PIC = 80;

exports.unpack = function(data, from) {
    return {
        PACKET_START:  data.slice(from, 3),
        msg_type:      data.readInt8(from + 3),
        packet_number: data.readInt32BE(from + 4),
        posix:         data.readInt32BE(from + 8),
        edison_boot:   data.readInt16BE(from + 12),
        edison_temp:   data.readInt16BE(from + 14),
        total_irid_rx: data.readInt16BE(from + 16),
        total_irid_tx: data.readInt16BE(from + 18),
        total_zigb_rx: data.readInt16BE(from + 20),
        total_wifi_tx: data.readInt16BE(from + 22),
        total_pics:    data.readInt8(from + 24)
    };
};
