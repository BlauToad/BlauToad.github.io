var s = window.location.search;
if (!s.startsWith("?id=")) {
    window.location = window.location.protocol + window.location.host + "/Tahook/";
    stop();
}
var _status = document.getElementById("status");
var _qrcode = document.getElementById("qrcode");
var dest_id = null;

dest_id = decodeURI(s.split("&")[0].slice(4));

var peer = new Peer();

var peer_id = null;

var conn = null;

peer.on('open', function (id) {
    peer_id = id;

    conn = peer.connect(dest_id);

    conn.on('open', conn_open);
    conn.on('error', conn_error);
    conn.on('close', conn_close);
    conn.on('data', conn_data);
    
});

peer.on('error', function(err) {
    _status.style = "color: #f00;";
    _status.innerHTML = "✖";
    conn = null;
});

function conn_open(){
    _status.style = "color: #0f0;";
    _status.innerHTML = "✔";
}
function conn_close(){
    _status.style = "color: #f00;";
    _status.innerHTML = "✖";
    conn = null;
}
function conn_error(){
    _status.style = "color: #f00;";
    _status.innerHTML = "✖";
    conn = null;
}
function conn_data(data){
    if(data === "ping"){
        conn.send("pong#"+ Date.now()); 
    }
}

var qrcode = new QRCode(_qrcode, {
    text: "",
    width: 50 * window.innerWidth / 100,
    height: 50 * window.innerWidth / 100,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});

function makeCode (_string) {            
    qrcode.makeCode(_string);
}

function connection(){
    if(conn != null){
        var h = window.location.host;
        makeCode(window.location.protocol + "//" + h + "/Tahook/connect/?id="+encodeURI(conn.peer));
        _qrcode.style = "display: block;";
    }
}


function hide_qr(){
    _qrcode.style = "display: none;";
}

function send(data){
    if(conn != null){
        conn.send(data);
    }
}
window.addEventListener('beforeunload', function (e) {
    peer.destroy();
});