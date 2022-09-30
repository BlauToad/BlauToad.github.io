i = document.getElementById("textId");
d = document.getElementById("d");
e = document.getElementById("e");
t1 = document.getElementById("t1");
t2 = document.getElementById("t2");
e1 = document.getElementById("e1");
e2 = document.getElementById("e2");
max_pa = document.getElementById("max_pa");
max_p = document.getElementById("max_p");

help1 = document.getElementById("help1");
help2 = document.getElementById("help2");
help1_ = document.getElementById("help1_");
help2_ = document.getElementById("help2_");
help1__ = document.getElementById("help1__");
help2__ = document.getElementById("help2__");

_2help1_ = document.getElementById("_2help1_");
_2help2_ = document.getElementById("_2help2_");
_2help1__ = document.getElementById("_2help1__");
_2help2__ = document.getElementById("_2help2__");

time = document.getElementById("time");

i.focus();

i.addEventListener("keydown", myFunction);

points_team1 = 0;
points_team2 = 0;
fpoints_team1 = 0;
fpoints_team2 = 0;

function myFunction(event) {

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
            updatefPoints();

            switchColors();
            break;
        default:
            console.log(event.key, event.keyCode);
            return;
    }
    if (points_team1 < 0) { points_team1 = 0 }
    if (points_team2 < 0) { points_team2 = 0 }
    if (points_team1 >= max_p.value && points_team1 - 1 > points_team2) {
        points_team1 = 0;
        points_team2 = 0;
        fpoints_team1 += 1;
        updatefPoints();
    }
    if (points_team2 >= max_p.value && points_team2 - 1 > points_team1) {
        points_team1 = 0;
        points_team2 = 0;
        fpoints_team2 += 1;
        updatefPoints();
    }

    updatePoints();

    event.preventDefault();
    i.value = "";
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

function fmax_p() {
    max_pa.innerHTML = max_p.value;
}

c1 = "#d0a";
c2 = "#0ad";

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