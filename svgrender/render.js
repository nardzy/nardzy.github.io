let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

// ベースの色　メモ
ctx.fillStyle = "#fff";
ctx.strokeStyle = "#999";

let paths = [];
let svgSize = parseFloat(document.querySelector("#svgsize").value);
let svgData = new Path2D(document.querySelector("#svgdata").value);
let fillColor = document.querySelector("#fillcolor").value;
let strokeColor = document.querySelector("#strokecolor").value;

document.querySelector("#svgdata").onchange = function() {
    try {
        svgData = new Path2D(document.querySelector("#svgdata").value);
    } catch(e) {
        alert(e);
    }
};
document.querySelector("#svgsize").onchange = function() {
    try {
        svgSize = parseFloat(document.querySelector("#svgsize").value);
    } catch(e) {
        alert(e);
    }
};
document.querySelector("#strokesize").onchange = function() {
    try {
        ctx.lineWidth = parseFloat(document.querySelector("#strokesize").value)||1;
    } catch(e) {
        alert(e);
    }
};
document.querySelector("#fillcolor").onchange = function() {
    try {
        fillColor = document.querySelector("#fillcolor").value;
    } catch(e) {
        alert(e);
    }
};
document.querySelector("#strokecolor").onchange = function() {
    try {
        strokeColor = document.querySelector("#strokecolor").value;
    } catch(e) {
        alert(e);
    }
};
document.querySelector("#svgadd").onclick = function() {
    paths.push({
        path: svgData,
        fillColor: fillColor,
        strokeColor: strokeColor
    });
};
document.querySelector("#svgrem").onclick = function() {
    paths.pop();
};

const render = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    paths.forEach((svg) => {
        ctx.fillStyle = svg.fillColor;
        ctx.strokeStyle = svg.strokeColor;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(svgSize, svgSize);
        ctx.fill(svg.path);
        ctx.stroke(svg.path);
        ctx.restore();
    });

    window.requestAnimationFrame(render);
};
render();
