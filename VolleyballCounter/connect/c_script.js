var s = window.location.search;
if (!s.startsWith("?id=")) {
    window.location = window.location.protocol + window.location.host + "/VolleyballCounter/";
    stop();
}
var i = document.getElementById("textId");
var d = document.getElementById("d");
var e = document.getElementById("e");
var t1 = document.getElementById("t1");
var t2 = document.getElementById("t2");
var e1 = document.getElementById("e1");
var e2 = document.getElementById("e2");
var max_pa = document.getElementById("max_pa");
var max_p = document.getElementById("max_p");

var help1 = document.getElementById("help1");
var help2 = document.getElementById("help2");
var help1_ = document.getElementById("help1_");
var help2_ = document.getElementById("help2_");
var help1__ = document.getElementById("help1__");
var help2__ = document.getElementById("help2__");

var _2help1_ = document.getElementById("_2help1_");
var _2help2_ = document.getElementById("_2help2_");
var _2help1__ = document.getElementById("_2help1__");
var _2help2__ = document.getElementById("_2help2__");
var _status = document.getElementById("status");
var _qrcode = document.getElementById("qrcode");

var time = document.getElementById("time");

focus_i();

i.addEventListener("keydown", myFunction);

var points_team1 = 0;
var points_team2 = 0;
var fpoints_team1 = 0;
var fpoints_team2 = 0;
var points_team1_last = 0;
var points_team2_last = 0;
var fpoints_team1_last = 0;
var fpoints_team2_last = 0;
var points_to_win = 25;


function myFunction(event) {
    send("click_"+event.keyCode);

    switch (event.keyCode) {
        case 49:
            // 1
            points_team1 += 1;
            break;
        case 50:
            // 2
            points_team2 += 1;
            break;
        case 81:
            // Q
            points_team1 -= 1;
            break;
        case 87:
            // W
            points_team2 -= 1;
            break;
        case 9:
            // TAB
            temp = points_team1;
            points_team1 = points_team2;
            points_team2 = temp;
            temp = fpoints_team1;
            fpoints_team1 = fpoints_team2;
            fpoints_team2 = temp;
            temp = points_team1_last;
            points_team1_last = points_team2_last;
            points_team2_last = temp;
            updatefPoints();

            switchColors();
            break;
        case 8:
            //revert to last before point
            temp = points_team1;
            points_team1 = points_team1_last;
            points_team1_last = temp;

            temp = points_team2;
            points_team2 = points_team2_last;
            points_team2_last = temp;
            
            temp = fpoints_team1;
            fpoints_team1 = fpoints_team1_last;
            fpoints_team1_last = temp;

            temp = fpoints_team2;
            fpoints_team2 = fpoints_team2_last;
            fpoints_team2_last = temp;
            
            updatefPoints();
            break;
        default:
            console.log(event.key, event.keyCode);
            return;
    }
    if (points_team1 < 0) { points_team1 = 0 }
    if (points_team2 < 0) { points_team2 = 0 }
    if (points_team1 >= points_to_win && points_team1 - 1 > points_team2) {
        points_team1_last = points_team1-1;
        points_team2_last = points_team2;
        fpoints_team1_last = fpoints_team1;
        fpoints_team2_last = fpoints_team2;
        points_team1 = 0;
        points_team2 = 0;
        fpoints_team1 += 1;
        updatefPoints();
    }
    if (points_team2 >= points_to_win && points_team2 - 1 > points_team1) {
        points_team1_last = points_team1;
        points_team2_last = points_team2-1;
        fpoints_team1_last = fpoints_team1;
        fpoints_team2_last = fpoints_team2;
        points_team1 = 0;
        points_team2 = 0;
        fpoints_team2 += 1;
        updatefPoints();
    }

    updatePoints();
    i.value = "";

    return false;
}

function updatePoints() {
    t1.innerHTML = points_team1;
    t2.innerHTML = points_team2;
    if (points_team1 >= 100 || points_team2 >= 100 || points_team1 <= -10 || points_team2 <= -10) {
        d.className = "d2";
    } else {
        d.className = "d1";
    }
    style1 = "color: " + c1 + ";";
    style2 = "color: " + c2 + ";";
    if (points_team1 > points_team2) {
        style1 += " text-decoration: underline;";
    } else if (points_team2 > points_team1) {
        style2 += " text-decoration: underline;";
    }

    t1.style = style1;
    t2.style = style2;
}

function updatefPoints() {
    e1.innerHTML = fpoints_team1;
    e2.innerHTML = fpoints_team2;
    if (fpoints_team1 >= 100 || fpoints_team2 >= 100 || fpoints_team1 <= -10 || fpoints_team2 <= -10) {
        e.className = "e2";
    } else {
        e.className = "e1";
    }
    style1 = "color: " + c1 + ";";
    style2 = "color: " + c2 + ";";
    if (fpoints_team1 > fpoints_team2) {
        style1 += "text-decoration: underline;";
    } else if (fpoints_team2 > fpoints_team1) {
        style2 += "text-decoration: underline;";
    }

    e1.style = style1;
    e2.style = style2;
}

var c1 = "#d0a";
var c2 = "#0ad";

function switchColors() {
    temp = c1;
    c1 = c2;
    c2 = temp;
    updateColors();
}

function updateColors() {

    help1.style = "border-color: " + c1 + ";";
    help2.style = "border-color: " + c2 + ";";

    help1_.style = "color: " + c1 + ";";
    help2_.style = "color: " + c2 + ";";


    _2help1.style = "border-color: " + c1 + ";";
    _2help2.style = "border-color: " + c2 + ";";

    _2help1_.style = "color: " + c1 + ";";
    _2help2_.style = "color: " + c2 + ";";

    temp = help1_.innerHTML;
    help1_.innerHTML = help2_.innerHTML;
    help2_.innerHTML = temp;

    temp = _2help1_.innerHTML;
    _2help1_.innerHTML = _2help2_.innerHTML;
    _2help2_.innerHTML = temp;

    updatefPoints();
    updatePoints();
}
updateColors();

setInterval(() => {
    const d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    let ti = h + ":" + m + ":" + s;

    time.innerHTML = ti;
},500)

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }

function click(key){
    let e = {
        keyCode: key
    }
    myFunction(e);
}

function team1_plus1 (){
    click(49);
}

function team2_plus1() {
    click(50);
}

function team1_minus1(){
    click(81);
}

function team2_minus1(){
    click(87);
}

function switchTeams(){
    click(9);
}

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
    if(String(data).startsWith("set_var")){
        var d = String(data).slice(7).split("|");
        eval(d[0] + " = " + d[1]);
    }else if(String(data) == "update"){
        updatefPoints();
        updatePoints();
        updateColors();
    }else{
        console.log('Received', data);
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
        h = h.replace("localhost","192.168.1.136");
        makeCode(window.location.protocol + "//" + h + "/VolleyballCounter/connect/?id="+encodeURI(conn.peer));
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

var mobile_users = [];

function focus_i(){
    if(navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)){
        console.log("Mobile!")
    }else{
        i.focus();
    }
}