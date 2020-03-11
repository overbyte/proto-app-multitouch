const el = document.getElementById('root');
const output = document.getElementById('output');
const touchSize = '80';
const countdownMax = 3;
const minTouchPoints = 2;

const svgns = 'http://www.w3.org/2000/svg';
const colours = [
    '#ff0000',
    '#ff7700',
    '#ffff00',
    '#77ff00',
    '#00ff00',
    '#00ff77',
    '#00ffff',
    '#0077ff',
    '#0000ff',
    '#7700ff',
    '#ff00ff',
    '#ff0077'
];

// 10 possible fingers
let touchPoints = [];
let countdownInterval = 0;
let countdown = 0;

const init = () => {
    generateSvg();
    document.addEventListener('DOMContentLoaded', setupHandlers);
};

const generateSvg = () => {
    svgview = document.createElementNS(svgns, 'svg');
    svgview.setAttribute('width', window.innerWidth);
    svgview.setAttribute('height', window.innerHeight);
    el.appendChild(svgview);
};

const setupHandlers = () => {
    svgview.addEventListener('touchstart', handleTouchStart, false);
    svgview.addEventListener('touchend', handleTouchEnd, false);
    svgview.addEventListener('touchcancel', handleTouchEnd, false);
    svgview.addEventListener('touchmove', handleTouchMove, false);
};

const removeHandlers = () => {
    svgview.removeEventListener('touchstart', handleTouchStart, false);
    svgview.removeEventListener('touchend', handleTouchEnd, false);
    svgview.removeEventListener('touchcancel', handleTouchEnd, false);
    svgview.removeEventListener('touchmove', handleTouchMove, false);
};

const selectFromTouchPoints = () => {
    const selectionIndex = Math.floor(touchPoints.length * Math.random());
    console.log(`selection index: ${selectionIndex} from ${touchPoints.length}`);
    touchPoints.splice(0, 0, ...touchPoints.splice(selectionIndex));

    // temporarily add an identifier to each graphic
    touchPoints.forEach((touchPoint, i) => {
        const txt = document.createElementNS(svgns, 'text');
        txt.setAttribute('x', touchPoint.touch.pageX);
        txt.setAttribute('y', touchPoint.touch.pageY);
        txt.setAttribute('font-size', 16);
        txt.setAttribute('font-family', 'sans-serif'); txt.setAttribute('class', 'touch-num');
        svgview.appendChild(txt);
        txt.textContent = i;
        console.log(txt);
        debug(txt);
    });
    console.log(touchPoints);
};

const generateColour = () => colours[Math.ceil(Math.random() * colours.length) - 1];
const getTouchById = id => touchPoints.filter(item => item.touch.identifier === id)[0];
const createSvgEl = type => document.createElementNS(svgns, type);

const handleTouchStart = e => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];

        const graphic = createSvgEl('circle');
        const col = generateColour();
        graphic.setAttribute('fill', col);
        graphic.setAttribute('cx', touch.pageX);
        graphic.setAttribute('cy', touch.pageY);
        graphic.setAttribute('r', touchSize);
        graphic.setAttribute('style', 'transform-origin: '+touch.pageX + 'px ' + touch.pageY + 'px');
        graphic.setAttribute('class', 'touch-gfx');
        svgview.appendChild(graphic);

        let touchPoint = { graphic, touch };
        touchPoints.push(touchPoint);
    }

    if (touchPoints.length >= minTouchPoints) {
        restartCountdown();
    }
};

const restartCountdown = () => {
    clearInterval(countdownInterval);
    countdown = countdownMax;
    debug(countdown);

    countdownInterval = setInterval(() => {
        countdown--;
        debug(countdown);

        if (countdown === 0) {
            clearInterval(countdownInterval);
            removeHandlers();
            selectFromTouchPoints();
        }
    }, 1000);
};

const handleTouchMove = e => {
    e.preventDefault();

    // loop through existing touches and update the position of the graphic
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = getTouchById(e.changedTouches[i].identifier);
        touch.graphic.setAttribute('cx', e.changedTouches[i].pageX);
        touch.graphic.setAttribute('cy', e.changedTouches[i].pageY);
        touch.graphic.setAttribute('style', 'transform-origin: '+e.changedTouches[i].pageX + 'px ' + e.changedTouches[i].pageY + 'px');
        // and the touch
        touch.touch = e.changedTouches[i];
    }
};

const handleTouchEnd = e => {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = getTouchById(e.changedTouches[i].identifier);
        const index = touchPoints.indexOf(touch);
        svg.removeChild(touch.graphic);
        touchPoints.splice(index, 1);
    }

    if (touchPoints.length >= minTouchPoints) {
        restartCountdown();
    } else {
        clearInterval(countdownInterval);
    }
};


const debug = msg => output.innerHTML = msg;

init();
