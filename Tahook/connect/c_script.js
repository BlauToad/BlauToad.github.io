var s = window.location.search;
if (!s.startsWith("?id=")) {
    window.location = window.location.protocol + window.location.host + "/Tahook/";
    stop();
}
var _status = document.getElementById("status");
var _qrcode = document.getElementById("qrcode");
var dest_id = null;

dest_id = decodeURI(s.split("&")[0].slice(4));

var peer = new Peer(uuidv4(), {
    host: "peerjs.pinkforest.games",
    secure: true,
    key: "PwbCF2rGWWjaJ7OeOn2n"
});

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

var peer_id = null;

var conn = null;

peer.on('open', function (id) {
    peer_id = id;

    conn = peer.connect(dest_id, { metadata: { emoji: "🌟", name: ("Test" + Math.random()).slice(0, 10) } });

    conn.on('open', conn_open);
    conn.on('error', conn_error);
    conn.on('close', conn_close);
    conn.on('data', conn_data);

});

peer.on('error', function (err) {
    _status.style = "color: #f00;";
    _status.innerHTML = "✖";
    conn = null;
});

function conn_open() {
    _status.style = "color: #0f0;";
    _status.innerHTML = "✔";
}
function conn_close() {
    _status.style = "color: #f00;";
    _status.innerHTML = "✖";
    conn = null;
}
function conn_error() {
    _status.style = "color: #f00;";
    _status.innerHTML = "✖";
    conn = null;
}
function conn_data(data) {
    if (data === "ping") {
        conn.send("pong#" + Date.now());
    }
}
window.addEventListener('beforeunload', function (e) {
    peer.destroy();
});

var qrcode = new QRCode(_qrcode, {
    text: "",
    width: 50 * window.innerWidth / 100,
    height: 50 * window.innerWidth / 100,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

function makeCode(_string) {
    qrcode.makeCode(_string);
}

function connection() {
    if (conn != null) {
        var h = window.location.host;
        makeCode(window.location.protocol + "//" + h + "/Tahook/connect/?id=" + encodeURI(conn.peer));
        _qrcode.style = "display: block;";
    }
}


function hide_qr() {
    _qrcode.style = "display: none;";
}

function send(data) {
    if (conn != null) {
        conn.send(data);
    }
}