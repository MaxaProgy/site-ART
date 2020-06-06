window.addEventListener("load", function() {
    let search = document.querySelector('.search');
    let searchInp = search.children[0];
    let searchLbl = search.children[1];
    let searchBtn = search.children[2];
    let searchBrd = search.children[3];
    let searchCls = search.children[4];
    let searchTxt, clonedTxt, clonedLbl, clonedLblWrap, animating = false, busy = true;
    let TLTxt = new TimelineLite();
    let TLSrch = new TimelineLite({onReverseComplete: () => {
            TLTxt.clear();
            animating = false;
        }});

    createTxt('Enter a search query', searchLbl, 'search-text');
    searchTxt = document.querySelectorAll('.search-text');

    searchBtn.addEventListener('click', () => {
        if (!animating) animSearch();
    });

    searchBrd.addEventListener('click', () => {
        if (!animating) animSearch();
    });

    searchInp.addEventListener('focus', () => {
        if (busy || searchInp.value.trim().length) return;
        TLTxt.isActive() ? TLTxt.play() : TLTxt.restart().timeScale(1).staggerTo(searchTxt, .07, {opacity: 0}, .035);
    });

    searchInp.addEventListener('blur', () => {
        if (busy || searchInp.value.trim().length) return;
        TLTxt.reverse().timeScale(1.3);
    });

    search.addEventListener('submit', e => {
        e.preventDefault();
        busy = true;
        TLTxt.paused() ? TLTxt.clear() : TLTxt.play();
        let val = searchInp.value.trim();
        searchInp.disabled = true;
        if (val.length) {
            cloneLbl();
            createLblTxt(val);
        }
        else TLSrch.reverse();
        searchInp.value = '';
        searchInp.blur();
    });

    searchCls.addEventListener('mousedown', e => {
        e.preventDefault();
    });

    searchCls.addEventListener('click', () => {
        if (busy) return;
        busy = true;
        let val = searchInp.value.trim();
        searchInp.disabled = true;
        if (val.length) {
            cloneLbl();
            createLblTxt(val);
        }
        else {
            TLTxt.isActive() ? TLTxt.play() : TLTxt.progress() == 1 ? TLTxt.clear() :
                TLTxt.restart().timeScale(1).staggerTo(searchTxt, .07, {opacity: 0}, .035);
            TLSrch.reverse();
        }
        searchInp.value = '';
        searchInp.blur();
    });

    function createTxt(text, elLbl, textClass) {
        let splitText = [];
        for (let i = text.length; i--;) {
            splitText.unshift(`<span class='${textClass}'>${text[i]}</span>`);
        }
        elLbl.innerHTML = splitText.join('');
    }

    function createLblTxt(val) {
        createTxt(val, clonedLbl, 'cloned-text');
        clonedTxt = document.querySelectorAll('.cloned-text');
        animClonedTxt(Array.from(clonedTxt).reverse());
    }

    function animSearch() {
        animating = true;
        TLSrch.restart()
            .to(searchBrd, .4, {scaleX: 2, x: -25, y: -25, ease: Sine.easeIn})
            .to(searchBtn, .4, {rotationX: 90, ease: Sine.easeIn}, '-=.4')
            .to(searchBrd, .4, {rotation: 180, x: '-=6', y: '+=10', ease: Power2.easeInOut})
            .set(searchBrd, {transformOrigin: '0', marginRight: '-38px'})
            .to(searchBrd, .6, {scaleX: 13, ease: Power1.easeOut})
            .set(search, {className: '+=edge', onComplete: showTxt})
            .to(searchInp, .6, {scaleX: 1, ease: Sine.easeInOut}, '-=.3')
            .set(searchCls, {className: '+=visible'})
            .addPause();
    }

    function showTxt() {
        let tl = new TimelineLite({onStart: () => {searchInp.disabled = true}});
        tl.staggerTo(searchTxt, .07, {opacity: 1}, .035);
        setTimeout(() => {
            searchInp.disabled = false;
            busy = false;
        }, 300)
    }

    function animClonedTxt(el) {
        let scrollW = clonedLbl.scrollWidth;
        let offsetW = scrollW - clonedLbl.offsetWidth;
        let tl = new TimelineLite({onComplete: () => {clonedLblWrap.remove()}});
        tl.staggerTo(el, .08, {opacity: 0}, .04);
        let tlDur = tl.totalDuration();
        let offsetTime = (offsetW * tlDur) / scrollW;
        if (offsetW > 0) {
            TweenLite.fromTo(clonedLbl, offsetTime, {x: -offsetW}, {x: 0, delay: .2, ease: SlowMo.ease.config(0.1, 0.1, false)});
        }
        setTimeout(() => {
            TLSrch.reverse();
        }, Math.max((tlDur - .35) * 1000, 0));
    }

    function cloneLbl() {
        clonedLblWrap = document.createElement('div');
        clonedLblWrap.className = 'search-label';
        search.appendChild(clonedLblWrap);
        clonedLbl = document.createElement('div');
        clonedLblWrap.appendChild(clonedLbl);
    }
});


console.clear();
console.log('lsakdfalskjdflnksd');

const config = {
    src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png',
    rows: 15,
    cols: 7 };


// UTILS

const randomRange = (min, max) => min + Math.random() * (max - min);

const randomIndex = array => randomRange(0, array.length) | 0;

const removeFromArray = (array, i) => array.splice(i, 1)[0];

const removeItemFromArray = (array, item) => removeFromArray(array, array.indexOf(item));

const removeRandomFromArray = array => removeFromArray(array, randomIndex(array));

const getRandomFromArray = (array) =>
    array[randomIndex(array) | 0];


// TWEEN FACTORIES

const resetPeep = ({ stage, peep }) => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    // using an ease function to skew random to lower values to help hide that peeps have no legs
    const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
    const startY = stage.height - peep.height + offsetY;
    let startX;
    let endX;

    if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
    } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
    }

    peep.x = startX;
    peep.y = startY;
    peep.anchorY = startY;

    return {
        startX,
        startY,
        endX };

};

const normalWalk = ({ peep, props }) => {
    const {
        startX,
        startY,
        endX } =
        props;

    const xDuration = 10;
    const yDuration = 0.25;

    const tl = gsap.timeline();
    tl.timeScale(randomRange(0.5, 1.5));
    tl.to(peep, {
            duration: xDuration,
            x: endX,
            ease: 'none' },
        0);
    tl.to(peep, {
            duration: yDuration,
            repeat: xDuration / yDuration,
            yoyo: true,
            y: startY - 10 },
        0);

    return tl;
};

const walks = [
    normalWalk];


// CLASSES

class Peep {
    constructor({
                    image,
                    rect })
    {
        this.image = image;
        this.setRect(rect);

        this.x = 0;
        this.y = 0;
        this.anchorY = 0;
        this.scaleX = 1;
        this.walk = null;
    }

    setRect(rect) {
        this.rect = rect;
        this.width = rect[2];
        this.height = rect[3];

        this.drawArgs = [
            this.image,
            ...rect,
            0, 0, this.width, this.height];

    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleX, 1);
        ctx.drawImage(...this.drawArgs);
        ctx.restore();
    }}


// MAIN

const img = document.createElement('img');
img.onload = init;
img.src = config.src;

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const stage = {
    width: 0,
    height: 0 };


const allPeeps = [];
const availablePeeps = [];
const crowd = [];

function init() {
    createPeeps();

    // resize also (re)populates the stage
    resize();

    gsap.ticker.add(render);
    window.addEventListener('resize', resize);
}

function createPeeps() {
    const {
        rows,
        cols } =
        config;
    const {
        naturalWidth: width,
        naturalHeight: height } =
        img;
    const total = rows * cols;
    const rectWidth = width / rows;
    const rectHeight = height / cols;

    for (let i = 0; i < total; i++) {
        allPeeps.push(new Peep({
            image: img,
            rect: [
                i % rows * rectWidth,
                (i / rows | 0) * rectHeight,
                rectWidth,
                rectHeight] }));


    }
}

function resize() {
    stage.width = canvas.clientWidth;
    stage.height = canvas.clientHeight;
    canvas.width = stage.width * devicePixelRatio;
    canvas.height = stage.height * devicePixelRatio;

    crowd.forEach(peep => {
        peep.walk.kill();
    });

    crowd.length = 0;
    availablePeeps.length = 0;
    availablePeeps.push(...allPeeps);

    initCrowd();
}

function initCrowd() {
    while (availablePeeps.length) {
        // setting random tween progress spreads the peeps out
        addPeepToCrowd().walk.progress(Math.random());
    }
}

function addPeepToCrowd() {
    const peep = removeRandomFromArray(availablePeeps);
    const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
            peep,
            stage }) }).

    eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
    });

    peep.walk = walk;

    crowd.push(peep);
    crowd.sort((a, b) => a.anchorY - b.anchorY);

    return peep;
}

function removePeepFromCrowd(peep) {
    removeItemFromArray(crowd, peep);
    availablePeeps.push(peep);
}

function render() {
    canvas.width = canvas.width;
    ctx.save();
    ctx.scale(devicePixelRatio, devicePixelRatio);

    crowd.forEach(peep => {
        peep.render(ctx);
    });

    ctx.restore();
}