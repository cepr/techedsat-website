'option explicit';

//
// Time conversion
//

var months = {
  'Jan': 0,
  'Feb': 1,
  'Mar': 2,
  'Apr': 3,
  'May': 4,
  'Jun': 5,
  'Jul': 6,
  'Aug': 7,
  'Sep': 8,
  'Oct': 9,
  'Nov': 10,
  'Dec': 11
};

function parse_time(time) {
  var s = time.split(/[ :]/);
  // Mon Sep 19 20:01:02 2016
  // 0   1   2  3  4  5  6
  return Date.UTC(s[6], months[s[1]], s[2], s[3], s[4], s[5]);
};

//
// Location conversion
//

var latlon_re = /^Lat = ([0-9.-]+) Long = ([0-9.-]+)$/;

function parse_location(latlon) {
  var re_result = latlon_re.exec(latlon);
  return {
    'lat': Number.parseFloat(re_result[1]),
    'lon': Number.parseFloat(re_result[2])
  };
};

//
// Public functions
//

exports.parse_metadata = function(metadata) {

  var fields = {};

  // Decompose each line into a dictionary of {key = value}
  metadata.split('\r\n').forEach(function(i){
    var kv = i.split(': ');
    if (kv.length == 2) {
      fields[kv[0]] = kv[1];
    }
  });

  // Keep only the interesting ones
  return {
    'packet_number': Number.parseInt(fields.MOMSN),
    'session_time': parse_time(fields['Time of Session (UTC)']),
    'location': parse_location(fields['Unit Location'])
  };
}
