var xx_grades = [[], [], []]
var gotVariables = false;
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

    //change cookie
    var temp_string = "data=";
    var prefix = "?";

    temp_string += prefix+"percentage=" + slider_percentage.value;
    if (grades.value > 0) {
        temp_string += prefix+"grades=[";
        for (let index = 0; index < grades.value; index++) {
            const element = findEById("grades_", index).value;
            temp_string += element;
            temp_string += ","
        }
        temp_string = temp_string.slice(0, temp_string.length - 1);
        temp_string += "]";
    }
    if (o_grades.value > 0) {
        temp_string += prefix+"ogrades=[";
        for (let index = 0; index < o_grades.value; index++) {
            const element = findEById("ogradeso_", index).value;
            temp_string += element;
            temp_string += ","
        }
        temp_string = temp_string.slice(0, temp_string.length - 1);
        temp_string += "]";
    }
    if (v_grades.value > 0) {
        temp_string += prefix+"vgrades=[";
        for (let index = 0; index < v_grades.value; index++) {
            const element = findEById("vgradesv_", index).value;
            temp_string += element;
            temp_string += ","
        }
        temp_string = temp_string.slice(0, temp_string.length - 1);
        temp_string += "]";
    }
    //replace url
    //history.replaceState({ id: 'Grade Calculator', source: 'JS' }, "Grade Calculator", temp_string);

    // replace cookie
    const d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    temp_string += "; expires="+d.toUTCString()+"; ";
    document.cookie = temp_string;

    document.cookie.SameSite = SameSiteMode.None;
    document.cookie.Secure = true;
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

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function findEById(prefix, id) {
    return document.getElementById(prefix + id + "_");
}

function writeEById(prefix, id, value) {
    findEById(prefix, id).value = value;
}


{
    //var v = window.location.search.split("?");
    var v = getCookie('data').split("?");
    v.forEach(element => {
        var e = element.split("=");
        switch (e[0]) {
            case "percentage":
                slider_percentage.value = e[1];
                break;
            case "grades":
                var f = e[1].replace("[", "").replace("]", "").split(",");
                if (f[0] == "" && f.length == 1) { f = [] }
                grades.value = f.length;
                xx_grades[0] = f;
                gotVariables = true;
                console.log(f);
                break;
            case "ogrades":
                var f = e[1].replace("[", "").replace("]", "").split(",");
                if (f[0] == "" && f.length == 1) { f = [] }
                o_grades.value = f.length;
                xx_grades[1] = f;
                gotVariables = true;
                console.log(f);
                break;
            case "vgrades":
                var f = e[1].replace("[", "").replace("]", "").split(",");
                if (f[0] == "" && f.length == 1) { f = [] }
                v_grades.value = f.length;
                xx_grades[2] = f;
                gotVariables = true;
                console.log(f);
                break;
            default:
                break;
        }
    });
}

{
    if(cook){

    }
}