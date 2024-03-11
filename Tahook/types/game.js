class Game {
    players = [];

    started = false;

    peer = null;
    peer_id = null;

    constructor(update_players_function = () => { }) {
        this.peer = new Peer();

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
                this.players = this.players.filter((c) => {
                    return c.peer !== co.peer;
                });
                update_players_function(this.players.length);
            });
            co.on('close', () => {
                this.players = this.players.filter((c) => {
                    return c.peer !== co.peer;
                });
                update_players_function(this.players.length);
            });
        });
    }

    add_player(connection_peer) {
        if (this.started) {
            return false;
        }
        this.players.push(connection_peer);
        return true;
    }

    send_all(data) {
        this.players.forEach(peer => {
            peer.send(data);
        });
    }

    got_data(data, connection_peer) {
        console.log('Received from ' + connection_peer.peer, data);

    }
}