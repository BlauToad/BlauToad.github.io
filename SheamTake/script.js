var xx_inputs = []
var gotVariables = false;
var DATA_CURRENT_NAMELIST = "Default";
var namelists = [];
var namelists_name = [];
var g = document.getElementById("_n");
var grades = document.getElementById("_nr_names");
var nr_teams = document.getElementById("_nr_teams");
var save_localstorage = document.getElementById("_save_localstorage");
var saved_namelists = document.getElementById("_saved_names");
var saved_namelists_btn = document.getElementById("_saved_names_btn");
var non = document.getElementById("_non");
var teams_text = document.getElementById("_teams");

var userLang = navigator.language || navigator.userLanguage;

var nr_inputs = [0, 0];
setInterval(function () {
    //respect the limits
    if (parseInt(grades.value) > parseInt(grades.max)) {
        grades.value = grades.max;
    }
    nr_teams.max = grades.value;
    if (parseInt(nr_teams.value) > parseInt(nr_teams.max)) {
        nr_teams.value = nr_teams.max;
    }
    //create new grade inputs
    while (grades.value > nr_inputs[0]) {
        var i = createInput("name_", nr_inputs[0]);
        g.appendChild(i);
        var c = createCheckbox("check_", nr_inputs[0]);
        g.appendChild(c);
        nr_inputs[0]++;
    }
    // deactivate grade inputs
    while (grades.value < nr_inputs[1]) {
        var d = findEById("name_", nr_inputs[1] - 1);
        d.style.display = "none";
        d.value = "";
        var e = findEById("check_", nr_inputs[1] - 1);
        e.style.display = "none";
        e.checked = true;
        nr_inputs[1]--;
    }
    //activate grade inputs
    while (grades.value > nr_inputs[1]) {
        findEById("name_", nr_inputs[1]).style.display = "inline";
        findEById("check_", nr_inputs[1]).style.display = "inline";
        nr_inputs[1]++;
    }
    //gotVariable
    if (gotVariables) {
        for (let index = 0; index < xx_inputs.length; index++) {
            const element = xx_inputs[index];
            writeEById("name_", index, element);
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

    temp_string += prefix + "names=[";
    for (let index = 0; index < grades.value; index++) {
        const element = findEById("name_", index).value;
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
        localStorage.setItem("_nl" + DATA_CURRENT_NAMELIST, temp_string);
        localStorage.setItem("_nl__nl", "?nl=[" + namelists_name.toString() + "]")
        localStorage.setItem("__localstorage", "true");
        saved_namelists_btn.hidden = false;
    } else {
        localStorage.removeItem("__localstorage");
        saved_namelists_btn.hidden = true;
    }
}, 500)

function createInput(prefix, suffix) {
    let input = document.createElement("input");
    input.type = "text";
    input.id = prefix + suffix + "_";
    input.value = "";
    return input;
}

function createCheckbox(prefix, suffix) {
    let input = document.createElement("input");
    input.type = "checkbox";
    input.id = prefix + suffix + "_";
    input.checked = true;
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
    v = localStorage.getItem("_nl"+va);
    if (v == null) {
        v = "?names=[]";
    }
    v = v.split("?");
    v.forEach(element => {
        var e = element.split("=");
        switch (e[0]) {
            case "names":
                document.title = va + " - Sheam Take";
                var f = e[1].replace("[", "").replace("]", "").split(",");
                if (f[0] == "" && f.length == 1) { f = [] }
                grades.value = f.length;
                xx_inputs = f;
                gotVariables = true;
                //console.log(f);
                //MARK CURRENTLY ACTIVE SUBJECT
                var children = [].slice.call(saved_namelists.getElementsByTagName("button"));
                children.forEach(element => {
                    if(element.innerHTML == va){
                        element.style="background-color:#006969;color:#fff;";
                    }else{
                        element.style="";
                    }
                });
                break;
            case "nl":
                var f = e[1].replace("[", "").replace("]", "").split(",");
                if (f[0] == "" && f.length == 1) { f = [] }
                for (let index = 0; index < f.length; index++) {
                    createNamelist(f[index]);
                }
                //console.log(f);
                break;
            default:
                break;
        }
    });

}

function createNamelist(name) {
    const regex = /[^A-Za-z0-9]/g;
    name = name.replace(regex, "");
    var s = true;
    if (name != "") {
        for (let index = 0; index < namelists.length; index++) {
            if (namelists[index] == name.toLowerCase()) {
                s = false;
            }
        }

        if (s == true) {
            namelists.push(name.toLowerCase());
            namelists_name.push(name);

            var btn = document.createElement("button");
            btn.innerHTML = name;
            //btn.addEventListener("click",switch_subject)
            btn.setAttribute("onclick", "switch_subject(\"" + name + "\");")
            saved_namelists.appendChild(btn);

            switch_subject(name);
            non.value = "";
        }
    }

}

{
    if (localStorage.getItem("__localstorage") == "true") {
        save_localstorage.checked = true;
        saved_namelists_btn.hidden = false;
        loadData("__nl");
    }
}

function create_new_saved_subject() {
    if (non.value != "") {
        createNamelist(non.value);
    }
}

function switch_subject(a) {
    //console.log(a);
    DATA_CURRENT_NAMELIST = a;
    loadData(a);
}

function generateTeams(){
    var an = getActiveNames();
    if(an.length == 0){
        return;
    }
    if(nr_teams.value == 0){
        var r = Math.floor(Math.random() * an.length);
        teams_text.innerHTML = "-> " + an.splice(r,1);
        return;
    }
    if(Number(nr_teams.value) > Number(nr_teams.max)){
        nr_teams.value = nr_teams.max;
    }
    if(Number(nr_teams.value) < Number(nr_teams.min)){
        nr_teams.value = nr_teams.min;
    }
    var teams = []
    for(i = 0; i < nr_teams.value; i++){
        teams.push([]);
    }
    var j = 0;
    while(an.length != 0){
        i = j % teams.length;
        var r = Math.floor(Math.random() * an.length);
        teams[i].push(an.splice(r,1));
        j++;
    }

    var tt = "";
    var err = false;
    for(i = 0; i < teams.length; i++){
        if(teams[i].length != 0){
            tt += "<a class='team' style='color: hsl("+(i*20)+" , 100%, 50%);'>--[Team " + (i+1) + "]--</a><br>";
            for(j = 0; j < teams[i].length; j++){
                tt += teams[i][j] + "<br>";
            }
            tt += "<br>";
        }else{
            err = true;
        }
    }
    if(err){
        tt += "No more teams could be generated, names are empty or disabled!"
    }

    teams_text.innerHTML = tt;

}

function getActiveNames(){
    var max = grades.value;
    var nms = [];
    for(i = 0;i<max;i++){
        n = getName(i);
        if(n != ""){
            nms.push(n);
        }
    }
    return nms;
}

function getName(id){
    var n = findEById("name_",id);
    var c = findEById("check_",id);

    if(c.checked){
        return n.value;
    }else{
        return "";
    }
}

createNamelist("Default");
loadData(DATA_CURRENT_NAMELIST);
switch_subject("Default");


translateTexts(userLang);

function translateTexts(userLang) {
    var nog = document.getElementById("*TEXT*nog");
    var noog = document.getElementById("*TEXT*noog");
    var sgiyb = document.getElementById("*TEXT*sgiyb");
    var cn = document.getElementById("*TEXT*cn");

    switch (userLang) {
        case "de":
            nog.innerHTML = "Anzahl an Namen:";
            noog.innerHTML = "Anzahl an Teams:";
            sgiyb.innerHTML = "Noten im Browser speichern?";
            sgiyb.title = "Dies verwendet JavaScripts lokalen Speicher!"
            cn.value = "Erstellen";

            saved_namelists_btn.innerHTML = "Gespeicherte Namensliste";
            non.placeholder = "Namenslisten Name";
            break;

        default:
            break;
    }
}