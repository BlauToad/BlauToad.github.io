class Type_quiz {
    answer_icons = ["▲", "⬥", "●", "∎", "⬟", "▼", "✜", "✿"];
    answers = [];
    title = "Title";

    constructor(title, read_time_ms = 5000,) {
        this.title = title;
    }

    add_answer(text = "Your Answer", is_right = false) {
        this.answers.push({ text: text, is_right: is_right });
    }

    build() {
        var table = document.createElement("table");

    }
}