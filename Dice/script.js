// BIGGER
b = 1;
const z = location.search.slice(1);
b = window.innerWidth / (z.length * 334 /2.65);

// Margin to the Border
const m1 = 12 * b;
// Margin between dots
const m = 5 * b;
// Radius of Dots
const r = 15 * b;
//Margin to the Outline
const ol = 7 * b;

//SIZE
const s = 3 * 2 * r + 2 * m + 2 * m1;


const numbers = {
    0: [],
    1: [0, 3, 1],
    2: [0, 1, 1, 3, 1],
    3: [0, 1, 1, 1, 1, 1, 1],
    4: [1, 1, 1, 3, 1, 1, 1],
    5: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    6: [1, 1, 2, 1, 2, 1, 1],
    7: [1, 1, 5, 1, 1],
    8: [4, 1, 4],
    9: [9]
}


if (!isNaN(z)) {
    drawNumber(z);
}


function drawNumber(number) {
    var nums = [];
    var end = String(number).length;
    for (let i = 0; i < end; i++) {
        var n = number % 10;
        number = (number - n) / 10;
        nums.push(n);
    }
    var nx = [];
    let j = 0;
    for (let i = nums.length - 1; i >= 0; i--) {
        nx[j] = nums[i];
        j++;
    }

    nx.forEach(num => {
        const c = document.createElement("canvas")
        document.body.append(c);
        c.height = s;
        c.width = s;

        drawNum(c, num);
    });

}

function drawNum(canvas, number) {
    // Border:

    var context = canvas.getContext("2d");
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 5;
    context.roundRect(ol, ol, s - 2 * ol, s - 2 * ol, [r]);
    context.stroke();


    // Dots:
    var on = true;
    var pattern = Array.from(numbers[number]);
    var i = 0;
    while (pattern.length != 0) {
        if (on && pattern[0] > 0) {
            var j = i % 3;
            var k = (i - j) / 3;
            var x = m1 + m * j + (r * 2) * j + r;
            var y = m1 + m * k + (r * 2) * k + r;

            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'black';
            ctx.fill();
        }


        pattern[0]--;
        if (pattern[0] <= 0) {
            pattern.splice(0, 1);
            on = !on;
        }
        i++;
    }
}