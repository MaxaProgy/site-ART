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