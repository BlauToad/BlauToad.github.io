var _qrcode = document.getElementById("qrcode");
const _url_pin = document.getElementById("url_pin");
const _info_one = document.getElementById("info_one");
const _players = document.getElementById("players");
const _display = document.getElementById("display");
const _title = document.getElementById("title");
const _clock = document.getElementById("clock");
const _loading = document.getElementById("loading");
const _controls = document.getElementById("controls");


function execute_dynamic(script, function_onload) {
    const s = document.createElement("script");
    s.src = "./" + script;
    document.body.appendChild(s);
    s.addEventListener("load", function_onload);
    s.remove();
}

function execute_dynamic_multiple(scripts = [], function_onload = () => { }) {
    if (scripts.length !== 1) {
        execute_dynamic(scripts[0], () => {
            scripts.splice(0, 1);
            execute_dynamic_multiple(scripts, function_onload)
        });
    } else {
        execute_dynamic(scripts[0], function_onload);
    }
}

function setSafeText(element, text) {
    element.innerHTML = "";
    var t = document.createTextNode(text);
    element.appendChild(t);
}

function creatSVG(path_string) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", "3rem");
    svg.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", path_string);
    svg.appendChild(path);
    return svg;
}

execute_dynamic_multiple(["types/game.js", "types/leaderboard.js"], () => {
    var started = false;

    const player_joining = (e) => {
        setSafeText(_info_one, "☺" + e);

        if (!game.started && !started) {

            _players.innerHTML = "";
            game.players.forEach(pe => {
                const p = document.createElement("div");
                const h = document.createElement("h3");
                setSafeText(h, pe.metadata.emoji);
                const a = document.createElement("a");
                setSafeText(a, pe.metadata.name);
                p.appendChild(h);
                p.appendChild(a);
                _players.appendChild(p);
            });

            _controls.innerHTML = "";

            var b = document.createElement("button");
            b.type = "button";
            setSafeText(b, "Start!")
            b.addEventListener("click", () => {
                game.start();
                started = true;
                b.remove();
            });
            _controls.appendChild(b);
        }
    }

    game = new Game(player_joining);
    game.add_player({ peer: "123", metadata: { name: "123", emoji: "🌟" } });
    game.add_player({ peer: "234", metadata: { name: "234", emoji: "🌟" } });
    game.add_player({ peer: "345", metadata: { name: "345", emoji: "🌟" } });
    game.add_player({ peer: "456", metadata: { name: "456", emoji: "🌟" } });
    game.add_player({ peer: "567", metadata: { name: "567", emoji: "🌟" } });
    game.add_player({ peer: "678", metadata: { name: "678", emoji: "🌟" } });
    game.leaderboard.add_answer("123", 1, 100);
    game.leaderboard.add_answer("234", 1, 800);
    game.leaderboard.add_answer("345", 1, 503);
    game.leaderboard.add_answer("456", 4, 590);
    game.leaderboard.process_solutions(1, 30000, 1000);
    game.leaderboard.add_answer("123", 1, 100);
    game.leaderboard.add_answer("234", 4, 800);
    game.leaderboard.add_answer("456", 4, 590);
    game.leaderboard.process_solutions(4, 10000, 1000);
    player_joining(game.players.length);

    var qrcode = new QRCode(_qrcode, {
        text: "",
        width: 50 * window.innerWidth / 100,
        height: 50 * window.innerWidth / 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
    });

    _url_pin.addEventListener("click", () => {
        if (game.peer_id != null) {
            qrcode.makeCode(window.location.protocol + "//" + window.location.host + "/Tahook/connect/?id=" + encodeURI(game.peer_id));
            _qrcode.style = "display: block;";

        }
    });

    setTimeout(() => {
        console.log(window.location.protocol + "//" + window.location.host + "/Tahook/connect/?id=" + encodeURI(game.peer_id))
    }, 500);
});

_qrcode.addEventListener("click", () => {
    _qrcode.style = "display: none;";
});