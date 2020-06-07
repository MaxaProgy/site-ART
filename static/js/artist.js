var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    width = window.innerWidth,
    height = window.innerHeight,
    lines = [],
    cycle = 9;

canvas.width = width;
canvas.height = height;

ctx.strokeStyle = "rgb(255,255,255)";
ctx.fillStyle = "rgba(0,0,0,0.01)";

init();

function init() {
    lines = [];
    for (var i = 0; i < 10; i++) {
        newLine();
    }
}

function newLine() {
    lines.push({
        x1: width / 2,
        y1: height,
        cp1x: width / 2 - Math.random() * width / 2,
        cp1y: height / 2 - Math.random() * height / 2,
        cp2x: width - Math.random() * width,
        cp2y: height - Math.random() * height,
        x2: width - Math.random() * width,
        y2: -height / 2,
        rotation: Math.random() * 360,
        angle1: Math.random() * 10,
        angle2: Math.random() * 10,
        angle3: Math.random() * 10
    });
}

function render() {
    ctx.strokeStyle = colorCycle();

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        line.cp1x += Math.sin(line.angle1 += 0.005);
        line.cp1y += Math.sin(line.angle1);

        line.cp2y -= Math.sin(line.angle2 -= 0.005);
        line.cp2x -= Math.sin(line.angle2);

        line.x1 -= Math.sin(line.angle3 += 0.005);
        line.y1 -= Math.sin(line.angle3);

        line.x2 -= Math.sin(line.angle3 += 0.005);
        line.y2 -= Math.sin(line.angle3);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.bezierCurveTo(line.cp1x, line.cp1y, line.cp2x, line.cp2y, line.x2, line.y2);
        ctx.stroke();

        ctx.restore();
    }

    requestAnimationFrame(render);
}

function colorCycle() {
    cycle += .01;
    if (cycle > 100) {
        cycle = 0;
    }

    var r = Math.floor(Math.sin(.3 * cycle + 0) * 127 + 128),
        g = Math.floor(Math.sin(.3 * cycle + 2) * 127 + 128),
        b = Math.floor(Math.sin(.3 * cycle + 4) * 127 + 128),
        a = Math.random() * 1;
    return "rgba(" + r + "," + g + "," + b + "," + 0.1 + ")";
}


render();
// Нашла красивую вставку для гармаонии =)

