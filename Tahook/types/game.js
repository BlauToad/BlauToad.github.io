class Game {
    static answer_icons = [
        "M1,21H23L12,2",
        "M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z",
        "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
        "M3,3V21H21V3",
        "M12,2.5L2,9.8L5.8,21.5H18.2L22,9.8L12,2.5Z",
        "M1 3H23L12 22",
        "M14.5,7.66L20.64,6.97L17,12L20.68,16.97L14.5,16.32L12.03,22L9.5,16.34L3.36,17.03L7,12L3.32,7.03L9.5,7.68L11.97,2L14.5,7.66Z",
        "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15Z"
    ];
    static answer_colors = ["#ff0000", "#0066ff", "#ffcc00", "#66ff00", "#5fd3bc", "#9955ff", "#ff0066", "#ff6600"];
    static answer_dark_colors = ["#aa0000", "#0044aa", "#aa8800", "#338000", "#2ca089", "#6600ff", "#aa0044", "#aa4400"];

    leaderboard;

    players = [];

    started = false;

    peer = null;
    peer_id = null;

    rounds = [];

    constructor(update_players_function = () => { }) {
        this.leaderboard = new Leaderboard(this);

        this.peer = new Peer({
            host: "peerjs.pinkforest.games",
            secure: true,
            key: "PwbCF2rGWWjaJ7OeOn2n"
        });

        this.peer.on('open', (id) => {
            this.peer_id = id;
        });

        this.peer.on('connection', (co) => {
            if (!this.add_player(co)) {
                co.send("ERROR-started");
                co.close();
                return;
            }
            console.log('Connected! ' + co.peer);

            co.on('data', (data) => {
                this.got_data(data, co);
            });
            co.on('open', () => {
                update_players_function(this.players.length);
            });
            co.on('error', () => {
                console.log("Error! " + co.peer)
                this.players = this.players.filter((c) => {
                    return c.peer !== co.peer;
                });
                update_players_function(this.players.length);
            });
            co.on('close', () => {
                console.log("Disconnected! " + co.peer);
                this.players = this.players.filter((c) => {
                    return c.peer !== co.peer;
                });
                update_players_function(this.players.length);
            });
            co.on('disconnected', () => {
                console.log("Disconnected! " + co.peer);
                this.players = this.players.filter((c) => {
                    return c.peer !== co.peer;
                });
                update_players_function(this.players.length);
            });
        });

    }

    start() {
        var countdown = 1000;
        Game.displayClock(countdown);

        setTimeout(() => {
            this.started = true;
            _players.innerHTML = "";
            //termp ===
            var round = {
                type: 1,
                data: '{"title": "Test Question","read_time_ms": 1000,"answering_time_ms": 1000,"points_factor": 1,"answers": [{"text": "Wrong Answer 1"},{"text": "Right Answer","is_right": true}],"random_order": false}'
            }

            this.start_round(round);
        }, countdown);

    }

    add_round(round) {
        this.rounds.push(round);
    }

    start_next_round() {
        const round = this.rounds.splice(1, 1);
        this.start_round(round);
    }

    start_round(round) {
        if (Object.keys(round).includes("type") && Object.keys(round).includes("data")) {
            this.start_r(round.type, round.data);
        }
    }

    start_r(type_int, data) {
        if (type_int === 1) {
            this.start_quiz(data);
        }
    }

    start_quiz(data) {
        execute_dynamic("types/quiz.js", () => {
            var xy = new Type_quiz();
            xy.load(data);

            Game.hideClock();

            var ddd = document.createElement("div");
            ddd.style.animationDuration = xy.read_time_ms + "ms";
            _loading.appendChild(ddd);
            _loading.style.borderColor = "#444";
            _loading.style.backgroundColor = "#0008";

            var xb = document.createElement("h3");
            setSafeText(xb, xy.title);
            xb.style.animationDuration = xy.read_time_ms + "ms";
            _title.appendChild(xb);

            setTimeout(() => {
                Game.displayClock(xy.answering_time_ms);

                _loading.style.borderColor = "";
                _loading.innerHTML = "";
                _loading.style.backgroundColor = "";

                xy.build();
                setTimeout(() => {
                    xy.build(true);

                    var button = document.createElement("button");
                    button.type = "button";
                    setSafeText(button, "Weiter");
                    _controls.appendChild(button);
                    button.addEventListener("click", () => {
                        this.start_leaderboard();
                        button.remove();
                    });
                }, xy.answering_time_ms);

            }, xy.read_time_ms);

        });
    }

    start_leaderboard() {
        if(this.rounds.length === 0){
            this.leaderboard.build_podium();
        }else{
            this.leaderboard.build();
        }
    }

    add_player(connection_peer) {
        if (this.started) {
            return false;
        }
        if (connection_peer.metadata === null) {
            return false;
        }
        if (Object.keys(connection_peer.metadata).filter((ee) => { return (ee === "emoji" || ee === "name") }).length !== 2) {
            return false;
        }
        this.players.push(connection_peer);
        return true;
    }

    async send_all(data) {
        this.players.forEach(peer => {
            peer.send(data);
        });
    }

    got_data(data, connection_peer) {
        if (data.startsWith("pong#")) {
            var peer_recieved = Number(data.slice(5));
            var latency1 = peer_recieved - this.ms_ping_start;
            var latency2 = Date.now() - peer_recieved;
            console.log([connection_peer.peer, latency1, latency2])
            return;
        }
        console.log('Received from ' + connection_peer.peer, data);

    }
    ms_ping_start = 0;
    ping_all() {
        this.ms_ping_start = Date.now();
        this.send_all("ping");
    }

    static hideClock() {
        _clock.innerHTML = "";
        _clock.style.backgroundColor = "";
        _clock.style.borderColor = "";
    }

    static displayClock(time_ms) {
        Game.hideClock();
        _clock.style.backgroundColor = "#006969";
        _clock.style.borderColor = "#0008";

        var h3 = document.createElement("h3");
        _clock.appendChild(h3);
        setSafeText(h3, Math.ceil(time_ms / 1000));

        var xv = null
        if (time_ms % 1000 !== 0) {
            setTimeout(() => {
                i--;
                update_time();
                xv = setInterval(() => {
                    update_time();
                }, 1000);
            }, time_ms % 1000);
        } else {
            xv = setInterval(() => {
                update_time();
            }, 1000);
        }

        var i = 0;
        function update_time() {
            i++;
            var xd = time_ms - (time_ms % 1000) - (1000 * i);
            if (xd < 0) {
                clearInterval(xv);
                return;
            }
            setSafeText(h3, xd / 1000)
        }
    }
}