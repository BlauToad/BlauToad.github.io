let klassen_ = document.getElementById("klassen");
let punkte_ = document.getElementById("punkte");
let add_punkte_ = document.getElementById("add_punkte");
let stand_ = document.getElementById("stand");
let stufe_ = document.getElementById("stufe");
let platz1_ = document.getElementById("platz1");
let platz2_ = document.getElementById("platz2");
let platz3_ = document.getElementById("platz3");
let platz4_ = document.getElementById("platz4");
let add_game_punkte_ = document.getElementById("add_game_punkte");
let stufe_p_ = document.getElementById("stufe_p");
let display_ = document.getElementById("display");
let klassen_v_ = document.getElementById("klassen_v");
let display_v_ = document.getElementById("display_v");
let kommentar_ = document.getElementById("kommentar");


let klassen = ["5a", "5b", "5c", "5d", "6a", "6b", "6c", "6d", "6e", "7a", "7b", "7c", "7d", "8a", "8b", "8c", "8d"];
let punkte = [];
let kommentare = [];

function addPunkte(klasse, anzahl, kommentar = "") {
    let i = klassen.indexOf(klasse);
    if (i >= 0) {
        punkte[i].push(anzahl);
        kommentare[i].push(kommentar);
    }
}


//<><><><><><><><><><><><><><><[Win Points]<><><><><><><><><><><><><>
let win_points = {
    "ersterPlatz": 9,
    "zweiterPlatz": 6,
    "dritterPlatz": 4,
    "vierterPlatz": 2,
    "fünfterPlatz": 1
};
//<><><><><><><><><><><><><><><[Win Points]<><><><><><><><><><><><><>

klassen.forEach(element => {
    let option = document.createElement("option");
    option.value = element;
    option.innerHTML = element;
    klassen_.appendChild(option);

    punkte.push([]);
    kommentare.push([]);
});

klassen.forEach(element => {
    let option = document.createElement("option");
    option.value = element;
    option.innerHTML = element;
    klassen_v_.appendChild(option);
});

punkte_.value = 0;

klassen_.addEventListener("change", klassenOnChange)
add_punkte_.addEventListener("click", addPunkteOnClick)

let index = 0;
function klassenOnChange() {
    index = klassen.indexOf(klassen_.value);
    punkte_.value = 0;
    updatePoints();
}

function addPunkteOnClick() {
    let k = "Punkte ändern geklickt";
    if (kommentar_.value != "") {
        k = kommentar_.value;
    }
    addPunkte(klassen_.value, Number(punkte_.value), k)
    updatePoints();
}

function updatePoints() {
    let summe = 0;
    punkte[index].forEach(element => {
        summe += element;
    });
    stand_.innerHTML = "Aktueller Stand: <br> <b>" + summe + " Punkte</b>";
    stufePOnChange();
    updateVerlauf();
    updateChart();
}



let stufen = ["5", "6", "7", "8"];

stufen.forEach(element => {
    let option = document.createElement("option");
    option.value = element;
    option.innerHTML = element;
    stufe_.appendChild(option);
});

stufe_.addEventListener("change", stufeOnChange);
platz1_.addEventListener("change", platz1OnChange);
platz2_.addEventListener("change", platz2OnChange);
platz3_.addEventListener("change", platz3OnChange);

let part = [];

function stufeOnChange() {
    let six = (stufe_.value == "6");

    part.forEach(element => {
        element.remove();
    });

    if (six) {
        createOptions(["a", "b", "c", "d", "e"], stufe_.value, platz1_);
    } else {
        createOptions(["a", "b", "c", "d"], stufe_.value, platz1_);
    }
    platz1_.disabled = false;
    platz2_.disabled = true;
    platz3_.disabled = true;
    platz4_.disabled = true;
    add_game_punkte_.disabled = true;
}

function platz1OnChange() {
    let six = (stufe_.value == "6");
    let pos;
    if (six) {
        pos = ["a", "b", "c", "d", "e"];
    } else {
        pos = ["a", "b", "c", "d"];
    }
    let i = pos.indexOf(platz1_.value);
    if (i >= 0) {
        pos.splice(i, 1);
        createOptions(pos, stufe_.value, platz2_);
        platz1_.disabled = true;
        platz2_.disabled = false;
        platz3_.disabled = true;
        platz4_.disabled = true;
        add_game_punkte_.disabled = true;
    }
}

function platz2OnChange() {
    let six = (stufe_.value == "6");
    let pos;
    if (six) {
        pos = ["a", "b", "c", "d", "e"];
    } else {
        pos = ["a", "b", "c", "d"];
    }
    pos.splice(pos.indexOf(platz1_.value), 1);
    let i = pos.indexOf(platz2_.value);
    if (i >= 0) {
        pos.splice(i, 1);
        createOptions(pos, stufe_.value, platz3_);
        platz1_.disabled = true;
        platz2_.disabled = true;
        platz3_.disabled = false;
        platz4_.disabled = true;
        add_game_punkte_.disabled = true;
    }
}

function platz3OnChange() {
    let six = (stufe_.value == "6");
    let pos;
    if (six) {
        pos = ["a", "b", "c", "d", "e"];
    } else {
        pos = ["a", "b", "c", "d"];
    }
    pos.splice(pos.indexOf(platz1_.value), 1);
    pos.splice(pos.indexOf(platz2_.value), 1);
    let i = pos.indexOf(platz3_.value);
    if (i >= 0) {
        pos.splice(i, 1);
        createOptions(pos, stufe_.value, platz4_);
        platz1_.disabled = true;
        platz2_.disabled = true;
        platz3_.disabled = true;
        platz4_.disabled = !six;
        if (!six) {
            platz4_.value = pos[0];
        }
        add_game_punkte_.disabled = false;
    }
}

function createOption(name, platz) {
    let option = document.createElement("option");
    option.value = name;
    option.innerHTML = name;
    part.push(option);
    platz.appendChild(option);
}

function createOptions(parts, klasse, platz) {
    parts.forEach(element => {
        let option = document.createElement("option");
        option.value = element;
        option.innerHTML = klasse + element;
        part.push(option);
        platz.appendChild(option);
    });
}


add_game_punkte_.addEventListener("click", addGamePunkteOnClick);

function addGamePunkteOnClick() {
    if (platz4_.value != "") {
        addPunkte(stufe_.value + platz1_.value, win_points.ersterPlatz, "Erster Platz");
        addPunkte(stufe_.value + platz2_.value, win_points.zweiterPlatz, "Zweiter Platz");
        addPunkte(stufe_.value + platz3_.value, win_points.dritterPlatz, "Dritter Platz");
        addPunkte(stufe_.value + platz4_.value, win_points.vierterPlatz, "Vierter Platz");
        if (stufe_.value == "6") {
            let pos = ["a", "b", "c", "d", "e"];
            pos.splice(pos.indexOf(platz1_.value), 1);
            pos.splice(pos.indexOf(platz2_.value), 1);
            pos.splice(pos.indexOf(platz3_.value), 1);
            pos.splice(pos.indexOf(platz4_.value), 1);
            addPunkte(stufe_.value + pos[0], win_points.fünfterPlatz, "Fünfter Platz");
        }
        updatePoints();
        stufeOnChange();
    }
}



stufen.forEach(element => {
    let option = document.createElement("option");
    option.value = element;
    option.innerHTML = element;
    stufe_p_.appendChild(option);
});

stufe_p_.addEventListener("change", stufePOnChange);

function stufePOnChange() {
    let p_klassen = klassen.filter((k) => k.startsWith(stufe_p_.value));
    let p_punkte = [];
    for (let index = 0; index < p_klassen.length; index++) {
        let summe = 0;
        punkte[klassen.indexOf(p_klassen[index])].forEach(element => {
            summe += element;
        });
        p_punkte[index] = summe;
    }

    let sorted = doubleSelectionSort(p_klassen, p_punkte);
    let s_names = sorted.names;
    let s_numbers = sorted.numbers;

    let displayText = "";
    for (let i = 0; i < s_names.length; i++) {
        const Name = s_names[i];
        const Number = s_numbers[i];
        displayText += "<br>";
        displayText += "<b>" + (i + 1) + ".</b> Platz:";
        displayText += "<br>";
        displayText += "-> Klasse <b>" + Name + "</b>: <b>" + Number + " Punkte</b>";
    }
    display_.innerHTML = displayText;
}

function doubleSelectionSort(names, numbers) {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i; j < numbers.length; j++) {
            if (numbers[i] < numbers[j]) {
                let temp_numbers = numbers[i];
                numbers[i] = numbers[j];
                numbers[j] = temp_numbers;
                let temp_names = names[i];
                names[i] = names[j];
                names[j] = temp_names;
            }
        }
    }
    return {
        names: names,
        numbers: numbers
    }
}

klassen_v_.addEventListener("change", updateVerlauf)

function updateVerlauf() {
    let i = klassen.indexOf(klassen_v_.value);
    let text = "";
    let sum = 0;
    if (i >= 0) {
        for (let j = 0; j < kommentare[i].length; j++) {
            const k = kommentare[i][j];
            const p = punkte[i][j];
            text += "<br>";
            text += "<b>" + p + "</b>:"
            text += " " + k;
            sum += p;
        }
    }
    text += "<br>"
    text += "_____________"
    text += "<br>"
    text += "= " + sum + " Punkte";

    display_v.innerHTML = text;
}







window.onbeforeunload = confirmExit;
function confirmExit() {
    return "All Data will be lost!";
}


// charts
let chart = null;
function updateChart() {
    if (chart != null) {
        chart.destroy();
    }

    let ds = [];
    let max_length = 0;
    for (let i = 0; i < klassen.length; i++) {
        const k = klassen[i];
        let sum_change = [0];
        for (let j = 0; j < punkte[i].length; j++) {
            let sum = sum_change[j] + punkte[i][j];

            sum_change.push(sum);
        }
        ds.push({
            data: sum_change,
            fill: false,
            label: k,
            tension: 0
        });
        if (sum_change.length > max_length) {
            max_length = sum_change.length;
        }
    }

    let xValues = [];
    for (let i = 0; i < max_length; i++) {
        xValues.push(i);
    }


    chart = new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: ds
        },
        options: {
            legend: {
                display: true,
                position: "right"
            },
            colors: {
                enabled: true
            }
        }
    });
}


//end
updatePoints();
stufeOnChange();