var _qrcode = document.getElementById("qrcode");
const _url_pin = document.getElementById("url_pin");
const _info_one = document.getElementById("info_one");

function execute_dynamic(script) {
    const s = document.createElement("script");
    s.src = "./" + script;
    document.body.appendChild(s);
    s.remove();
}

function setSafeText(element, text) {
    element.innerHTML = "";
    var t = document.createTextNode(text);
    element.appendChild(t);
}
execute_dynamic("types/game.js");

_qrcode.addEventListener("click", () => {
    _qrcode.style = "display: none;";
});

setTimeout(() => {

    game = new Game((e) => { setSafeText(_info_one, "☺" + e) });

    var qrcode = new QRCode(_qrcode, {
        text: "",
        width: 50 * window.innerWidth / 100,
        height: 50 * window.innerWidth / 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
    });

    function makeCode(_string) {
        console.log(_string)
        qrcode.makeCode(_string);
    }

    function calculate_points(time_spend_ms = Infinity, total_time_ms = 30000, total_points = 1000) {
        if (time_spend_ms <= 500) {
            return total_points;
        }
        var a = time_spend_ms / total_time_ms;
        a /= 2;
        a = 1 - a;
        var b = a * total_points;
        return Math.ceil(b);
    }

    _url_pin.addEventListener("click", () => {
        if (game.peer_id != null) {
            var h = window.location.host;
            makeCode(window.location.protocol + "//" + h + "/Tahook/connect/?id=" + encodeURI(game.peer_id));
            _qrcode.style = "display: block;";

        }
    });
}, 1000);
