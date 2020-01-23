const el = document.getElementById('root');
const output = document.getElementById('output');
const svg = document.getElementById('svgview');
const touchSize = '80';

const svgns = 'http://www.w3.org/2000/svg';
const colours = [
    '#ff0000',
    '#ff7f00',
    '#ffff00',
    '#80ff00',
    '#00ff00',
    '#00ff80',
    '#00ffff',
    '#0080ff',
    '#0000ff',
    '#8000ff',
    '#ff00ff',
    '#ff007f'
];

// 10 possible fingers
let touchPoints = [];

const init = () => {
    document.addEventListener('DOMContentLoaded', setupHandlers);
};

const setupHandlers = () => {
    svgview.addEventListener('touchstart', handleTouchStart, false);    
    svgview.addEventListener('touchend', handleTouchEnd, false);    
    svgview.addEventListener('touchcancel', handleTouchEnd, false);    
    svgview.addEventListener('touchmove', handleTouchMove, false);    
};

const generateColour = () => colours[Math.floor(Math.random() * colours.length)];
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
        svg.appendChild(graphic);

        let touchPoint = { graphic, touch };
        touchPoints.push(touchPoint);
    }
};

const handleTouchMove = e => {
    e.preventDefault();
    // loop through existing touches and update the position of the graphic

    //let msg = '';
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = getTouchById(e.changedTouches[i].identifier);
        touch.graphic.setAttribute('cx', e.changedTouches[i].pageX);
        touch.graphic.setAttribute('cy', e.changedTouches[i].pageY);
        //msg = e.changedTouches[i].identifier + ':' + e.changedTouches[i].pageX + ',' + e.changedTouches[i].pageY;
    }
    //debug(msg + '<br>');
};

const handleTouchEnd = e => {
    e.preventDefault();
    //debug(e.changedTouches.length);

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = getTouchById(e.changedTouches[i].identifier);
        const index = touchPoints.indexOf(touch);
        svg.removeChild(touch.graphic);
        touchPoints.splice(index, 1);
    }
};


const debug = msg => output.innerHTML = msg + output.innerHTML;

init();
