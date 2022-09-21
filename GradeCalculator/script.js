var xx_grades = [
    [],
    [],
    []
]
var gotVariables = false;
var DATA_SAVED_SUBJECTS = "";
var DATA_CURRENT_SUBJET = "Default";
var subjects = [];
var subjects_name = [];
var g = document.getElementById("_g");
var og = document.getElementById("_og");
var vg = document.getElementById("_vg");
var grades = document.getElementById("_grades");
var o_grades = document.getElementById("_o_grades");
var v_grades = document.getElementById("_v_grades");
var v_grade_average = document.getElementById("_voc_average");
var g_average = document.getElementById("_g_average");
var o_average = document.getElementById("_o_average");
var v_average = document.getElementById("_v_average");
var t_average = document.getElementById("_total_average");
var t_average_r = document.getElementById("_total_average_r");
var slider_percentage = document.getElementById("_grade_percentage");
var g_percentage = document.getElementById("_g_percentage");
var o_percentage = document.getElementById("_og_percentage");
var save_localstorage = document.getElementById("_save_localstorage");
var saved_subjects = document.getElementById("_saved_subjects");
var saved_subjects_btn = document.getElementById("_saved_subjects_btn");
var nos = document.getElementById("_nos");

var userLang = navigator.language || navigator.userLanguage;

var nr_grades = [0, 0];
var nr_o_grades = [0, 0];
var nr_v_grades = [0, 0];
setInterval(function () {
    //respect the limits
    if (parseInt(grades.value) > parseInt(grades.max)) {
        grades.value = grades.max;
    }
    if (parseInt(o_grades.value) > parseInt(o_grades.max)) {
        o_grades.value = o_grades.max;
    }
    if (parseInt(v_grades.value) > parseInt(v_grades.max)) {
        v_grades.value = v_grades.max;
    }
    //create new grade inputs
    while (grades.value > nr_grades[0]) {
        var i = createInput("grades_", nr_grades[0]);
        g.appendChild(i);
        nr_grades[0]++;
    }
    while (o_grades.value > nr_o_grades[0]) {
        var i = createInput("ogradeso_", nr_o_grades[0]);
        og.appendChild(i);
        nr_o_grades[0]++;
    }
    while (v_grades.value > nr_v_grades[0]) {
        var i = createInput("vgradesv_", nr_v_grades[0]);
        vg.appendChild(i);
        nr_v_grades[0]++;
    }
    // deactivate grade inputs
    while (grades.value < nr_grades[1]) {
        findEById("grades_", nr_grades[1] - 1).style.display = "none";
        nr_grades[1]--;
    }
    while (o_grades.value < nr_o_grades[1]) {
        findEById("ogradeso_", nr_o_grades[1] - 1).style.display = "none";
        nr_o_grades[1]--;
    }
    while (v_grades.value < nr_v_grades[1]) {
        findEById("vgradesv_", nr_v_grades[1] - 1).style.display = "none";
        nr_v_grades[1]--;
    }
    //activate grade inputs
    while (grades.value > nr_grades[1]) {
        findEById("grades_", nr_grades[1]).style.display = "block";
        nr_grades[1]++;
    }
    while (o_grades.value > nr_o_grades[1]) {
        findEById("ogradeso_", nr_o_grades[1]).style.display = "block";
        nr_o_grades[1]++;
    }
    while (v_grades.value > nr_v_grades[1]) {
        findEById("vgradesv_", nr_v_grades[1]).style.display = "block";
        nr_v_grades[1]++;
    }
    //calc average
    o_average.innerHTML = calcAverage("ogradeso_", o_grades.value)
    v_average.innerHTML = calcAverage("vgradesv_", v_grades.value)
    //hide / show voc average
    if (v_grades.value > 0) {
        v_grade_average.style.display = "block";
        v_grade_average.value = calcAverage("vgradesv_", v_grades.value);
        g_average.innerHTML = calcAverage("grades_", grades.value, [v_grade_average.value]);
    } else {
        v_grade_average.style.display = "none";
        g_average.innerHTML = calcAverage("grades_", grades.value);
    }
    //slider percentage
    g_percentage.innerHTML = slider_percentage.value + "%"
    o_percentage.innerHTML = (100 - slider_percentage.value) + "%"
    //total average
    var a = parseFloat(g_average.innerHTML) * (slider_percentage.value / 100) + parseFloat(o_average.innerHTML) * ((100 - slider_percentage.value) / 100);
    t_average.innerHTML = a;
    t_average_r.innerHTML = Math.round(a);
    //gotVariable
    if (gotVariables) {
        for (let index = 0; index < xx_grades[0].length; index++) {
            const element = xx_grades[0][index];
            writeEById("grades_", index, element);
        }
        for (let index = 0; index < xx_grades[1].length; index++) {
            const element = xx_grades[1][index];
            writeEById("ogradeso_", index, element);
        }
        for (let index = 0; index < xx_grades[2].length; index++) {
            const element = xx_grades[2][index];
            writeEById("vgradesv_", index, element);
        }
        gotVariables = false;
    }
}, 50);

setInterval(function () {
    //changeURL
    //var temp_string = window.location.origin + window.location.pathname;
    //var prefix = "?";

    //change localstorage
    var temp_string = "";
    var prefix = "?";

    temp_string += prefix + "percentage=" + slider_percentage.value;

    temp_string += prefix + "grades=[";
    for (let index = 0; index < grades.value; index++) {
        const element = findEById("grades_", index).value;
        temp_string += element;
        temp_string += ","
    }
    temp_string = temp_string.slice(0, temp_string.length - 1);
    temp_string += "]";

    temp_string += prefix + "ogrades=[";
    for (let index = 0; index < o_grades.value; index++) {
        const element = findEById("ogradeso_", index).value;
        temp_string += element;
        temp_string += ","
    }
    temp_string = temp_string.slice(0, temp_string.length - 1);
    temp_string += "]";

    temp_string += prefix + "vgrades=[";
    for (let index = 0; index < v_grades.value; index++) {
        const element = findEById("vgradesv_", index).value;
        temp_string += element;
        temp_string += ","
    }
    temp_string = temp_string.slice(0, temp_string.length - 1);
    temp_string += "]";

    //replace url
    //history.replaceState({ id: 'Grade Calculator', source: 'JS' }, "Grade Calculator", temp_string);

    // replace localstorage
    if (save_localstorage.checked == true) {
        //document.cookie = temp_string;
        localStorage.setItem(DATA_CURRENT_SUBJET, temp_string);
        localStorage.setItem("__subjects", "?subjects=[" + subjects_name.toString() + "]")
        localStorage.setItem("__localstorage", "true");
        saved_subjects_btn.hidden = false;
    } else {
        localStorage.removeItem("__localstorage");
        saved_subjects_btn.hidden = true;
    }
}, 500)

function calcAverage(prefix, max_id, additional_summands) {
    var i = 0;
    var sum = 0;
    for (var j = 0; j < max_id; j++) {
        x = document.getElementById(prefix + j + "_").value;
        i++;
        sum = sum + parseFloat(x);
    }
    if (additional_summands) {
        additional_summands.forEach(element => {
            i++;
            sum = sum + parseFloat(element);
        });
    }
    var r = 0;
    if (i != 0) {
        r = parseFloat(sum / i);
    }
    return r;
}

function createInput(prefix, suffix) {
    let input = document.createElement("input");
    input.type = "number";
    input.id = prefix + suffix + "_";
    input.value = "1"
    input.min = "0";
    input.max = "15"
    input.step = "0.25"
    return input;
}

function findEById(prefix, id) {
    return document.getElementById(prefix + id + "_");
}

function writeEById(prefix, id, value) {
    findEById(prefix, id).value = value;
}


function loadData(va) {
    //var v = window.location.search.split("?");
    v = localStorage.getItem(va);
    if (v == null) {
        v = "?percentage=50?grades=[]?ogrades=[]?vgrades=[]";
    }
    v = v.split("?");
    v.forEach(element => {
        var e = element.split("=");
        switch (e[0]) {
            case "percentage":
                slider_percentage.value = e[1];

                //MARK URRENTLY ACTIVE SUBJECT
                var children = [].slice.call(saved_subjects.getElementsByTagName("button"));
                children.forEach(element => {
                    if(element.innerHTML == va){
                        element.style="background-color:#f00a;";
                    }else{
                        element.style="";
                    }
                });
                break;
            case "grades":
                document.title = va + " - GradeCalculator";
                var f = e[1].replace("[", "").replace("]", "").split(",");
                if (f[0] == "" && f.length == 1) { f = [] }
                grades.value = f.length;
                xx_grades[0] = f;
                gotVariables = true;
                //console.log(f);
                break;
            case "ogrades":
                var f = e[1].replace("[", "").replace("]", "").split(",");
                if (f[0] == "" && f.length == 1) { f = [] }
                o_grades.value = f.length;
                xx_grades[1] = f;
                gotVariables = true;
                //console.log(f);
                break;
            case "vgrades":
                var f = e[1].replace("[", "").replace("]", "").split(",");
                if (f[0] == "" && f.length == 1) { f = [] }
                v_grades.value = f.length;
                xx_grades[2] = f;
                gotVariables = true;
                //console.log(f);
                break;
            case "subjects":
                var f = e[1].replace("[", "").replace("]", "").split(",");
                if (f[0] == "" && f.length == 1) { f = [] }
                v_grades.value = f.length;
                for (let index = 0; index < f.length; index++) {
                    createSubject(f[index]);
                }
                //console.log(f);
                break;
            default:
                break;
        }
    });

}

function createSubject(name) {
    const regex = /[^A-Za-z0-9]/g;
    name = name.replace(regex, "");
    var s = true;
    if (name != "") {
        for (let index = 0; index < subjects.length; index++) {
            if (subjects[index] == name.toLowerCase()) {
                s = false;
            }
        }

        if (s == true) {
            subjects.push(name.toLowerCase());
            subjects_name.push(name);

            var btn = document.createElement("button");
            btn.innerHTML = name;
            //btn.addEventListener("click",switch_subject)
            btn.setAttribute("onclick", "switch_subject(\"" + name + "\");")
            saved_subjects.appendChild(btn);

            switch_subject(name);
            nos.value = "";
        }
    }

}

{
    if (localStorage.getItem("__localstorage") == "true") {
        save_localstorage.checked = true;
        loadData("__subjects");
    }
}

function create_new_saved_subject() {
    if (nos.value !== "") {
        createSubject(nos.value);
    }
}

function switch_subject(a) {
    //console.log(a);
    DATA_CURRENT_SUBJET = a;
    loadData(a);
}

createSubject("Default");
loadData(DATA_CURRENT_SUBJET);
switch_subject("Default");


translateTexts(userLang);

function translateTexts(userLang) {
    var nog = document.getElementById("*TEXT*nog");
    var noog = document.getElementById("*TEXT*noog");
    var novg = document.getElementById("*TEXT*novg");
    var sgiyb = document.getElementById("*TEXT*sgiyb");
    var cn = document.getElementById("*TEXT*cn");

    switch (userLang) {
        case "de":
            nog.innerHTML = "Anzahl an schriftlichen Noten:";
            noog.innerHTML = "Anzahl an mündlichen Noten:";
            novg.innerHTML = "Anzahl an Vokabeltest Noten:";
            sgiyb.innerHTML = "Noten im Browser speichern?";
            sgiyb.title = "Dies verwendet JavaScripts lokalen Speicher!"
            cn.value = "Erstellen";

            saved_subjects_btn.innerHTML = "Gespeicherte Schulfächer";
            nos.placeholder = "Schulfachname";
            break;

        default:
            break;
    }
}