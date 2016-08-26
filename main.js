
var base64url = require('base64url');
var Buffer = require('buffer');
var Header = require('./Header.js');
var SohPacket = require('./SohPacket.js');
var GpsPacket = require('./GpsPacket.js');
var WsmPacket = require('./WsmPacket.js');
var PicturePacket = require('./PicturePacket.js');

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var USER_ID = 'me';
var CLIENT_ID = '438739123384-qqtd0cqtcdlv54a8m56umcqggsl0vh1e.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
var current_user = document.getElementById('current_user');
var signin_button = document.getElementById('signin-button');
var soh_table = document.getElementById('soh_table');
var gps_table = document.getElementById('gps_table');
var wsm_table = document.getElementById('wsm_table');
var picture_table = document.getElementById('picture_table');
var sign_in_button = document.getElementById('signInButton');
var sign_out_button = document.getElementById('signOutButton');



sign_in_button.onclick = function() {
  gapi.auth2.getAuthInstance().signIn();
};

sign_out_button.onclick = function() {
  gapi.auth2.getAuthInstance().signOut();
}

/**
* Process gmail.users.messages.list response
*/
function onMessagesListDone(resp) {
  if (resp.code == 403) {
    alert(resp.message);
    return;
  }
  resp.messages.forEach(function(message, i, a) {
    var request = gapi.client.gmail.users.messages.get({
      'userId': USER_ID,
      'id': message.id,
      'format': 'full'
    });
    request.execute(onMessagesGetDone);
  });
}

/**
* Process gmail.users.messages.get response
*/
function onMessagesGetDone(resp) {
  if ((resp.payload.parts.length != 2) ||
      (resp.payload.parts[0].mimeType != "text/plain")  ||
      (resp.payload.parts[1].mimeType != "application/x-zip-compressed")) {
    // The email is supposed to contain two parts: a plain text content
    // and one attachment.
    return;
  }

  // Decode the email
  var plain = base64url.decode(resp.payload.parts[0].body.data);

  // Download the SBD attachment
  var request = gapi.client.gmail.users.messages.attachments.get({
    'userId': USER_ID,
    'messageId': resp.id,
    'id': resp.payload.parts[1].body.attachmentId
  });
  request.execute(onAttachmentsGetDone);
}

function td(text) {
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(text));
  return td;
}

function onAttachmentsGetDone(resp) {
  var data = base64url.toBuffer(resp.data);
  var header = Header.unpack(data, 0);
  if (header.msg_type == Header.MSG_TYP_SOH) {
    var p = SohPacket;
    var unpacked = p.unpack(data, 0);
    var row = document.createElement('tr');
    row.appendChild(td(unpacked.header.packet_number));
    row.appendChild(td(unpacked.header.posix));
    row.appendChild(td(unpacked.header.edison_boot));
    row.appendChild(td(unpacked.header.edison_temp));
    row.appendChild(td(unpacked.header.total_irid_rx));
    row.appendChild(td(unpacked.header.total_irid_tx));
    row.appendChild(td(unpacked.header.total_zigb_rx));
    row.appendChild(td(unpacked.header.total_wifi_tx));
    row.appendChild(td(unpacked.header.total_pics));
    row.appendChild(td(unpacked.gps_data.time));
    row.appendChild(td(unpacked.gps_data.px));
    row.appendChild(td(unpacked.gps_data.py));
    row.appendChild(td(unpacked.gps_data.pz));
    row.appendChild(td(unpacked.gps_data.vx));
    row.appendChild(td(unpacked.gps_data.vy));
    row.appendChild(td(unpacked.gps_data.vz));
    row.appendChild(td(unpacked.wsm_data.raw_data.toString('hex')));
    soh_table.appendChild(row);
  } else if (header.msg_type == Header.MSG_TYP_GPS) {
    var p = GpsPacket;
    var unpacked = p.unpack(data, 0);
    var row = document.createElement('tr');
    row.appendChild(td(unpacked.header.packet_number));
    row.appendChild(td(unpacked.header.posix));
    row.appendChild(td(unpacked.header.edison_boot));
    row.appendChild(td(unpacked.header.edison_temp));
    row.appendChild(td(unpacked.header.total_irid_rx));
    row.appendChild(td(unpacked.header.total_irid_tx));
    row.appendChild(td(unpacked.header.total_zigb_rx));
    row.appendChild(td(unpacked.header.total_wifi_tx));
    row.appendChild(td(unpacked.header.total_pics));
    row.appendChild(td(unpacked.data.time));
    row.appendChild(td(unpacked.data.px));
    row.appendChild(td(unpacked.data.py));
    row.appendChild(td(unpacked.data.pz));
    row.appendChild(td(unpacked.data.vx));
    row.appendChild(td(unpacked.data.vy));
    row.appendChild(td(unpacked.data.vz));
    gps_table.appendChild(row);
  } else if (header.msg_type == Header.MSG_TYP_WSM) {
    var p = WsmPacket;
    var unpacked = p.unpack(data, 0);
    var row = document.createElement('tr');
    row.appendChild(td(unpacked.header.packet_number));
    row.appendChild(td(unpacked.header.posix));
    row.appendChild(td(unpacked.header.edison_boot));
    row.appendChild(td(unpacked.header.edison_temp));
    row.appendChild(td(unpacked.header.total_irid_rx));
    row.appendChild(td(unpacked.header.total_irid_tx));
    row.appendChild(td(unpacked.header.total_zigb_rx));
    row.appendChild(td(unpacked.header.total_wifi_tx));
    row.appendChild(td(unpacked.header.total_pics));
    row.appendChild(td(unpacked.data.raw_data.toString('hex')));
    wsm_table.appendChild(row);
  } else if (header.msg_type == Header.MSG_TYP_PIC) {
    var p = PicturePacket;
    var unpacked = p.unpack(data, 0);
    row.appendChild(td(unpacked.header.packet_number));
    row.appendChild(td(unpacked.header.posix));
    row.appendChild(td(unpacked.header.edison_boot));
    row.appendChild(td(unpacked.header.edison_temp));
    row.appendChild(td(unpacked.header.total_irid_rx));
    row.appendChild(td(unpacked.header.total_irid_tx));
    row.appendChild(td(unpacked.header.total_zigb_rx));
    row.appendChild(td(unpacked.header.total_wifi_tx));
    row.appendChild(td(unpacked.header.total_pics));
    row.appendChild(td(unpacked.data.pic_num));
    row.appendChild(td(unpacked.data.cam_num));
    row.appendChild(td(unpacked.data.pic_time));
    row.appendChild(td(unpacked.data.pic_chunk_count));
    row.appendChild(td(unpacked.data.pic_chunk_num));
    row.appendChild(td(unpacked.data.pic_chunk_data.toString('hex')));
    picture_table.appendChild(row);
  } else {
      // unknown packet type
      appendPre('Unknown packet type: ' + header.msg_type);
      return;
  }
}

/**
* Append a pre element to the body containing the given message
* as its text node.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

function readEmails() {
  var request = gapi.client.gmail.users.messages.list({
    'userId': USER_ID,
    'includeSpamTrash': false,
    maxResults: 100
  });
  request.execute(onMessagesListDone);
}

// Initialize Google API
gapi.load("auth2:client", function(){

  // gapi.auth2 loaded
  gapi.auth2.init({
    client_id: CLIENT_ID,
    scope: SCOPES
  }).then(function() {

    var auth_instance = gapi.auth2.getAuthInstance();

    // Load GMail API
    gapi.client.load('gmail', 'v1', function() {
      // gapi.client.gmail loaded

      // Update current user
      if (auth_instance.isSignedIn.get()) {
        var profile = auth_instance.currentUser.get().getBasicProfile();
        current_user.innerText = profile.getEmail();
        readEmails();
        sign_out_button.disabled = false;
      } else {
        current_user.innerText = '';
        sign_in_button.disabled = false;
      }

      // Listen for sign-in state changes.
      auth_instance.isSignedIn.listen(function(logged) {
        sign_in_button.disabled = logged;
        sign_out_button.disabled = !logged;
        if (logged) {
          readEmails();
        } else {
          current_user.innerText = '';
        }
      });
      // Listen for user changes
      auth_instance.currentUser.listen(function(user) {
        current_user.innerText = user.getBasicProfile().getEmail();
      });
    });
  });

  // gapi.client loaded
});
