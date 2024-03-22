class Leaderboard {
    super;
    constructor(s) {
        this.super = s;
    }

    static calculate_points(time_spend_ms = Infinity, total_time_ms = 30000, total_points = 1000) {
        if (time_spend_ms <= 500) {
            return total_points;
        }
        var a = time_spend_ms / total_time_ms;
        a /= 2;
        a = 1 - a;
        var b = a * total_points;
        return Math.ceil(b);
    }

    cache = [];

    cache_contains_player_id(player_id) {
        for (let i = 0; i < this.cache.length; i++) {
            const element = this.cache[i];
            if (element.player_id === player_id) {
                return true;
            }
        }
        return false;
    }

    add_answer(player_id, answer, time) {
        if (this.cache_contains_player_id(player_id)) {
            return;
        }

        this.cache.push({ player_id: player_id, answer: answer, time: time });
    }

    process_solutions(answer, total_time_ms, total_points) {
        this.super.players.forEach(player => {
            if (!this.cache_contains_player_id(player.peer)) {
                this.add_answer(player.peer, undefined, undefined);
            }
        });
        while (this.cache.length > 0) {
            const element = this.cache.pop();
            if (element.answer === answer) {
                this.add_points(element.player_id, Leaderboard.calculate_points(element.time, total_time_ms, total_points));
            } else {
                this.add_points(element.player_id, 0);
            }
        }
        this.calculate_new_leaderboard();
    }

    add_points(player_id, points) {
        var player = Player_points.find_player(this.player_points_list, player_id);
        if (player === null) {
            player = new Player_points(player_id);
            this.player_points_list.push(player);
        }

        player.add_points(points);
    }

    player_points_list = [];

    leaderboards = [];

    current_leaderboard() {
        return this.leaderboards[this.leaderboards.length - 1];
    }

    calculate_new_leaderboard() {
        //sort player points
        this.player_points_list.sort((a, b) => {
            return b.total_points() - a.total_points();
        });

        var cc = [];
        for (let i = 0; i < this.player_points_list.length; i++) {
            const element = this.player_points_list[i];
            cc.push(element);
        }
        this.leaderboards.push(cc);
    }

    calculate_placement_diffence(player_id) {
        var placement_before = -1;
        for (let i = 0; i < this.leaderboards[this.leaderboards.length - 2].length; i++) {
            const element = this.leaderboards[this.leaderboards.length - 2][i];
            if (element.player_id === player_id) {
                placement_before = i;
                break;
            }
        }
        if (placement_before === -1) {
            return 0;
        }
        var new_placement = -1;
        for (let i = 0; i < this.leaderboards[this.leaderboards.length - 1].length; i++) {
            const element = this.leaderboards[this.leaderboards.length - 1][i];
            if (element.player_id === player_id) {
                new_placement = i;
                break;
            }
        }
        if (new_placement === -1) {
            return 0;
        }
        return placement_before - new_placement;

    }


    calculate_placement_differences() {
        var placement_difs = [];
        this.super.players.forEach(player => {
            placement_difs.push({ player_id: player.peer, palcement_dif: this.calculate_placement_diffence(player.peer) });
        });
        return placement_difs;
    }

    build() {
        //this.calculate_new_leaderboard();
        _display.innerHTML = "";
        _title.innerHTML = "";
        Game.hideClock();

        const d = document.createElement("div");
        _display.appendChild(d);
        const table = document.createElement("table");
        d.appendChild(table);

        for (let i = 0; i < this.current_leaderboard().length && i < 5; i++) {
            const element = this.current_leaderboard()[i];
            const placement_dif = this.calculate_placement_diffence(element.player_id)

            const row = document.createElement("tr");
            if (i != 0) {
                row.style.borderTopStyle = "solid";
                row.style.borderTopWidth = "0.3rem";
                row.style.borderTopColor = "white";
            } else {
                row.style.fontWeight = "bolder";
            }
            table.appendChild(row);
            const td1 = document.createElement("td");
            row.appendChild(td1);

            for (let i = 0; i < this.super.players.length; i++) {
                if (this.super.players[i].peer === element.player_id) {
                    setSafeText(td1, this.super.players[i].metadata.emoji + " " + this.super.players[i].metadata.name);
                }
            }

            const td2 = document.createElement("td");
            row.appendChild(td2);
            setSafeText(td2, element.total_points() + "P");

            const td3 = document.createElement("td");
            row.appendChild(td3);
            if (placement_dif !== 0) {
                if (placement_dif < 0) {
                    setSafeText(td3, Math.abs(placement_dif) + "⬇");
                } else {
                    setSafeText(td3, Math.abs(placement_dif) + "⬆");
                }
            } else {
                setSafeText(td3, "▪️");
            }
        }

        const button = document.createElement("button");
        button.type = "button";
        setSafeText(button,"Weiter")
        _controls.appendChild(button);
        button.addEventListener("click", () => {
            button.remove();
            this.super.start_next_round();
        });

    }

    build_podium() {
        this.build();
    }



}

class Player_points {
    static find_player(player_points_arrray, player_id) {
        for (let i = 0; i < player_points_arrray.length; i++) {
            const element = player_points_arrray[i];
            if (element.player_id === player_id) {
                return element;
            }
        }
        return null;
    }

    player_id;
    round_points = [];

    constructor(peer_id) {
        this.player_id = peer_id;
    }

    add_points(points) {
        this.round_points.push(points);
    }

    total_points() {
        var sum = 0;
        this.round_points.forEach(points => {
            sum += points;
        });
        return sum;
    }
    total_points_trend() {
        var trend = [];
        for (let i = 0; i < this.round_points.length; i++) {
            var sum = 0;
            for (let j = 0; j <= i; j++) {
                sum += this.round_points[j];
            }
            trend.push(sum);
        }
    }
}