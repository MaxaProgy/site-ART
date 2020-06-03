window.setInterval(onCanvasClick, 6000);
ccc.addEventListener("click", onCanvasClick);
var Configs = {
    backgroundColor: '#030722',
    particleNum: 700,
    step: 17,
    base: 3000,
    zInc: 0.000009
};


// Vars
var fadeTime = 2000; // in ms
var fadeTimeStart;

var canvas;
var context;
var screenWidth;
var screenHeight;
var centerX;
var centerY;
var particles = [];
var hueBase = 0;
var simplexNoise;
var zoff = 0;
var gui;
var can2;
var ctx2;

// Initialize

function init() {
    canvas = document.getElementById('ccc');
    can2 = document.createElement("canvas");
    ctx = can2.getContext("2d");
    ctx2 = canvas.getContext("2d");
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize(null);

    for (var i = 0, len = Configs.particleNum; i < len; i++) {
        initParticle((particles[i] = new Particle()));
    }

    simplexNoise = new SimplexNoise();

    canvas.addEventListener('click', onCanvasClick, true);

    gui = new dat.GUI();
    gui.add(Configs, 'step', 1, 5);
    gui.add(Configs, 'base', 1500, 4000);
    gui.add(Configs, 'zInc', 0.001, 0.01);
    gui.close();


    requestAnimationFrame(update);
    ctx.lineWidth = 0.7;
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.fillStyle = Configs.backgroundColor;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

}


// Event listeners

function onWindowResize(e) {
    can2.width = screenWidth = canvas.width = window.innerWidth;
    can2.height = screenHeight = canvas.height = window.innerHeight;
    centerX = screenWidth / 10;
    centerY = screenHeight / 10;
}

function onCanvasClick(e) {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = Configs.backgroundColor;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    simplexNoise = new SimplexNoise();
    fadeTimeStart = undefined;
}


// Functions

function getNoise(x, y, z) {
    var octaves = 2,
        fallout = 0.5,
        amp = 1, f = 1, sum = 1,
        i;

    for (i = 0; i < octaves; ++i) {
        amp *= fallout;
        sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 4.4;
        f *= 3;
    }

    return sum;
}

function initParticle(p) {
    p.x = p.pastX = screenWidth * Math.random();
    p.y = p.pastY = screenHeight * Math.random();
    p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 200 / Math.PI;
    p.color.s = 1;
    p.color.l = 0.6;
    p.color.a = 0;
}


// Update

function update(time) {
    var step = Configs.step;
    var base = Configs.base;
    var i, p, angle;

    for (i = 0; i < particles.length; i++) {
        p = particles[i];

        p.pastX = p.x;
        p.pastY = p.y;

        angle = Math.PI * 6 * getNoise(p.x / base * 1.75, p.y / base * 1.75, zoff);
        p.x += Math.cos(angle) * step;
        p.y += Math.sin(angle) * step;

        if (p.color.a < 1) p.color.a += 0.001;

        ctx.beginPath();
        ctx.strokeStyle = p.color.toString();
        ctx.moveTo(p.pastX, p.pastY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
            initParticle(p);
        }
    }

    hueBase += 0.4;
    zoff += Configs.zInc;

    // Code to fade in the view
    if (fadeTimeStart === undefined) {
        fadeTimeStart = time;
    }
    var fTime = (time - fadeTimeStart) / fadeTime;
    if (fTime < 1) {
        ctx2.globalAlpha = fTime;
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        ctx2.drawImage(can2, 0, 0);
    } else {
        ctx2.globalAlpha = 1;
        ctx2.drawImage(can2, 0, 0);
    }

    requestAnimationFrame(update);
}


/**
 * HSLA
 */
function HSLA(h, s, l, a) {
    this.h = h || 0;
    this.s = s || 0;
    this.l = l || 0;
    this.a = a || 0;
}

HSLA.prototype.toString = function () {
    return 'hsla(' + this.h + ',' + (this.s * 100) + '%,' + (this.l * 100) + '%,' + this.a + ')';
};

/**
 * Particle
 */
function Particle(x, y, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.color = color || new HSLA();
    this.pastX = this.x;
    this.pastY = this.y;
}


// Run

init();
