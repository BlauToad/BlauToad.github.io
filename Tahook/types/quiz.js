class Type_quiz {
    title = "Title";
    read_time_ms = 5000;
    answering_time_ms = 30000;
    points_factor = 1;
    answers = [];
    random_order = false;

    create(title = "Example Title", read_time_ms = 5000, answering_time_ms = 30000, points_factor = 1, random_order = false) {
        this.title = title;
        this.read_time_ms = read_time_ms;
        this.answering_time_ms = answering_time_ms;
        this.points_factor = points_factor;
        this.random_order = random_order;
    }

    add_answer(text = "Your Answer", is_right = false) {
        if (this.answers.length >= 8) {
            return false;
        }
        this.answers.push({ text: text, is_right: is_right });
    }

    build(show_answer = false) {
        var table = document.createElement("table");
        table.style.width = "100%";
        _display.innerHTML = "";
        _display.appendChild(table);

        this.answers = this.answers.sort(() => {
            return Math.random() < 0.5;
        })

        for (let i = 0; i < this.answers.length; i += 2) {
            const element1 = this.answers[i];
            const element2 = this.answers[i + 1];

            var row = document.createElement("tr");
            row.style.width = "100%";
            var e1 = document.createElement("td");
            e1.style.width = "50%";
            var d1 = document.createElement("div");
            d1.appendChild(creatSVG(Game.answer_icons[i % 8]));
            var a1 = document.createElement("a");
            d1.appendChild(a1);
            setSafeText(a1, element1.text);
            e1.appendChild(d1);
            row.appendChild(e1);
            if (show_answer && element1.is_right !== true) {
                d1.style.backgroundColor = Game.answer_dark_colors[i % 8];
                d1.classList.add(["dark"]);
                setSafeText(a1, "✘  " + element1.text);
            } else {
                d1.style.backgroundColor = Game.answer_colors[i % 8];
                setSafeText(a1, element1.text);
            }

            if (element2 !== null) {
                var e2 = document.createElement("td");
                e2.style.width = "50%";
                var d2 = document.createElement("div");
                d2.appendChild(creatSVG(Game.answer_icons[(i + 1) % 8]));
                var a2 = document.createElement("a");
                d2.appendChild(a2);
                e2.appendChild(d2);
                row.appendChild(e2);
                if (show_answer && element2.is_right !== true) {
                    d2.style.backgroundColor = Game.answer_dark_colors[(i + 1) % 8];
                    d2.classList.add(["dark"]);
                    setSafeText(a2, "✘  " + element2.text);
                } else {
                    d2.style.backgroundColor = Game.answer_colors[(i + 1) % 8];
                    setSafeText(a2, element2.text);
                }
            }

            table.appendChild(row);
        }
    }


    load(json_data) {
        var j = JSON.parse(json_data);
        this.title = j.title;
        this.read_time_ms = j.read_time_ms;
        this.answering_time_ms = j.answering_time_ms;
        this.points_factor = j.points_factor;
        this.answers = j.answers;
        this.random_order = j.random_order;
    }
}