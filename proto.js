/*
// not implemented on iOS 13 atm
navigator.getWakeLock('screen')
    .then(wakelock => {
        wakelock.createRequest();
        debug('wakelock active');
    });
*/

const el = document.getElementById('root');         // target #root
const output = document.getElementById('output');   // target #output for debug text output
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
let svgview;

const init = () => {
    svgview = createSvg();
    el.appendChild(svgview);
    document.addEventListener('DOMContentLoaded', setupHandlers);
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

const generateColour = () => colours[Math.ceil(Math.random() * colours.length) - 1];
const getTouchById = id => touchPoints.filter(item => item.touch.identifier === id)[0];
const createSvgEl = type => document.createElementNS(svgns, type);
const debug = msg => output.innerHTML = msg;

const handleTouchStart = e => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const graphic = createTouchPointSvg(touch);
        svgview.appendChild(graphic);

        let touchPoint = { graphic, touch };
        touchPoints.push(touchPoint);
    }

    if (touchPoints.length >= minTouchPoints) {
        restartCountdown();
    }
};

const createSvg = () => {
    svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    return svg;
};

const getCenterPoint = () => {
    return {
        cx: window.innerWidth / 2,
        cy: window.innerHeight / 2
    };
};

const selectFromTouchPoints = () => {
    const selectionIndex = Math.floor(touchPoints.length * Math.random());
    console.log(`selection index: ${selectionIndex} from ${touchPoints.length}`);
    touchPoints.splice(0, 0, ...touchPoints.splice(selectionIndex));

    // temporarily add an identifier to each graphic
    touchPoints.forEach((touchPoint, i) => {
        const txt = createTouchpointText(touchPoint);
        svgview.appendChild(txt);
        txt.textContent = i;
    });
    console.log(touchPoints);
};

const createTouchPointSvg = touch => {
    const graphic = createSvgEl('circle');
    const col = generateColour();
    graphic.setAttribute('fill', col);
    graphic.setAttribute('cx', touch.pageX);
    graphic.setAttribute('cy', touch.pageY);
    graphic.setAttribute('r', touchSize);
    graphic.setAttribute('style',  `transform-origin: ${touch.pageX}px ${touch.pageY}px`);
    graphic.setAttribute('class', 'touch-gfx');
    return graphic; 
};

const createTouchpointText = touchPoint => {
    const txt = document.createElementNS(svgns, 'text');
    txt.setAttribute('x', touchPoint.touch.pageX);
    txt.setAttribute('y', touchPoint.touch.pageY);
    txt.setAttribute('font-size', 16);
    txt.setAttribute('font-family', 'sans-serif'); txt.setAttribute('class', 'touch-num');
    return txt;
};

const showCenter = () => {
    const center = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
    const rad = 5;
    const line1 = generateLine(center.x - rad, center.y - rad, center.x + rad, center.y + rad);
    const line2 = generateLine(center.x + rad, center.y - rad, center.x - rad, center.y + rad);
    svgview.appendChild(line1);
    svgview.appendChild(line2);
};

const generateLine = (x1, y1, x2, y2) => {
    const line = createSvgEl('line');
    line.setAttribute('class', 'center-line');
    line.setAttribute('x1', x1);
    line.setAttribute('x2', x2);
    line.setAttribute('y1', y1);
    line.setAttribute('y2', y2);
    return line;
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
            showCenter();
            debug(':)');
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
        touch.graphic.setAttribute('style', `transform-origin: ${e.changedTouches[i].pageX}px ${e.changedTouches[i].pageY}px`);
        // and the touch
        touch.touch = e.changedTouches[i];
    }
};

const handleTouchEnd = e => {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = getTouchById(e.changedTouches[i].identifier);
        const index = touchPoints.indexOf(touch);
        svgview.removeChild(touch.graphic);
        touchPoints.splice(index, 1);
    }

    if (touchPoints.length >= minTouchPoints) {
        restartCountdown();
    } else {
        clearInterval(countdownInterval);
    }
};


init();
