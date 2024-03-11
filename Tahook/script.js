
var _status = document.getElementById("status");
var _qrcode = document.getElementById("qrcode");

var peer = new Peer();

var peer_id = null;

var conn = [];
var conns_left = 0;

peer.on('open', function (id) {
    peer_id = id;
});

peer.on('connection', function (co) {
    conn.push(co);
    console.log('Connected!');
    hide_qr();

    co.on('data', conn_data);
    co.on('open', conn_open);
});

function conn_data(data) {
    if (String(data).startsWith("click_")) {
        click(Number(String(data).slice(6)));
    } else {
        console.log('Received', data);
    }
}
function conn_open() {
    show_conn_status();
}
function conn_error() {
    conns_left++;
    show_conn_status();
}
function conn_close() {
    conns_left++;
    show_conn_status();
}

function show_conn_status() {
    var s = conn.length;
    switch (s) {
        case 0:
            _status.style = "color: #f00;";
            _status.innerHTML = "✖";
            break;
        case 1:
            _status.style = "color: #0f0;";
            _status.innerHTML = "✔";
            break;

        default:
            _status.style = "color: #0f0;";
            _status.innerHTML = s - conns_left;
            break;
    }
}

var qrcode = new QRCode(_qrcode, {
    text: "",
    width: 50 * window.innerWidth / 100,
    height: 50 * window.innerWidth / 100,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

function makeCode(_string) {
    console.log(_string)
    qrcode.makeCode(_string);
}

function connection() {
    if (peer_id != null) {
        //_status.style = "color: #fb0;";
        //_status.innerHTML = "↻";
        var h = window.location.host;
        makeCode(window.location.protocol + "//" + h + "/Tahook/connect/?id=" + encodeURI(peer_id));
        _qrcode.style = "display: block;";

    }
}

function hide_qr() {
    _qrcode.style = "display: none;";
}

function send_all(data) {
    conn.forEach(e => {
        e.send(data);
    });
}


function calculate_points(time_spend_ms=Infinity,total_time_ms=30000,total_points=1000){
    if(time_spend_ms <= 500){
        return total_points;
    }
    var a = time_spend_ms / total_time_ms;
    a /= 2;
    a = 1 - a;
    var b = a * total_points;
    return Math.ceil(b);
}