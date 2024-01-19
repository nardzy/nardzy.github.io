
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.style.border = "2px solid #000";

document.dblclick = addEventListener("dblclick", function(e) { 
    e.preventDefault();
});

let hideMin = document.getElementById("hideMin");
let hideMax = document.getElementById("hideMax");

const randInt = (min, max) => {
    return Math.floor(min + Math.random() * (max - min + 1));
};

let changer = {
    check: false,
    x: 0,
    y: 0
};

class Grid {
    constructor() {
        this.array = [];
        this.numArr = [];
        this.hideMin = parseInt(hideMin.value);
        this.hideMax = parseInt(hideMax.value);
        this.hides = 0;
        this.created = 2;
    }
    init() {
        this.array = [];
        for (let y = 0; y < 9; y++) {
            this.array[y] = [];
            for (let x = 0; x < 9; x++) {
                let chunk = {
                    x: Math.floor(x / 3),
                    y: Math.floor(y / 3)
                };
                let num = 0;
                if (chunk.x == chunk.y) {
                    if (x % 3 === 0 && y % 3 === 0) this.resetNumArr();
                    num = this.check();
                };
                this.array[y][x] = {
                    num: num,
                    num2: num,
                    num3: 0,
                    index: {
                        x: x,
                        y: y
                    },
                    chunk: chunk
                };
            }
        }
    }
    make() {
        let err = false;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                let data = this.array[y][x];
                if (data.num == 0) {
                    this.resetNumArr();
                    this.filterNumArr(data);
                    let num = this.check();
                    if (num == undefined) {
                        err = true;
                        break;
                    } else {
                        this.array[y][x].num = this.array[y][x].num2 = num;
                    }
                }
            }
            if (err) break;
        }
        if (!err) {
            this.created = true;
            this.hide();
        }
    }
    hide() {
        this.hides = 0;
        for (let y = 0; y < 9; y+=3) {
            for (let x = 0; x < 9; x+=3) {
                let hideCount = randInt(this.hideMin, this.hideMax);
                for (let i = 0; i < hideCount;) {
                    let x2 = randInt(0, 2);
                    let y2 = randInt(0, 2);
                    if (this.array[y2 + y][x2 + x].num == 0) continue;
                    this.array[y2 + y][x2 + x].num = 0;
                    this.hides++;
                    i++;
                }
            }
        }
        document.getElementById("hideCount").innerHTML = this.hides + " Hided";
    }
    create() {
        this.created = false;
        this.init();
        this.make();
    }
    filterNumArr(data) {
        let checkNum = [];
        for (let x = 0; x < 9; x++) {
            let d2 = this.array[data.index.y][x];
            if (d2.num) {
                checkNum.push(d2.num);
            }
        }
        for (let y = 0; y < 9; y++) {
            let d2 = this.array[y][data.index.x];
            if (d2.num) {
                checkNum.push(d2.num);
            }
        }
        for (let y = 0; y < 3; y++) {
            let posY = (data.chunk.y * 3) + y;
            for (let x = 0; x < 3; x++) {
                let posX = (data.chunk.x * 3) + x;
                let d2 = this.array[posY][posX];
                if (d2.num) {
                    checkNum.push(d2.num);
                }
            }
        }
        this.numArr = this.numArr.filter(d2 => !checkNum.includes(d2));
    }
    resetNumArr() {
        this.numArr = [];
        for (let i = 1; i < 10; i++) this.numArr.push(i);
    }
    check() {
        let rng = Math.floor(Math.random() * this.numArr.length);
        let num = this.numArr[rng];
        this.numArr.splice(rng, 1);
        return num;
    }
}

let grid = new Grid();
let size = 40;
let correct = false;
let createInv = null;

document.getElementById("correct").onclick = () => {
    correct = !correct;
};
document.getElementById("remake").onclick = () => {
    try {
        clearInterval(createInv);
        createInv = setInterval(() => {
            for (let i = 0; i < 100; i++) {
                grid.create();
                if (grid.created) {
                    clearInterval(createInv);
                    break;
                }
            }
        }, 100);
    } catch(e) {
        alert(e);
    }
};

hideMin.onchange = () => {
    grid.hideMin = parseInt(hideMin.value);
};
hideMax.onchange = () => {
    grid.hideMax = parseInt(hideMax.value);
};

canvas.onmousedown = (event) => {
    changer.check = true;
    changer.x = event.clientX - 10;
    changer.y = event.clientY - 10;
};

const resize = (() => {
    canvas.width = canvas.height = size * 9;
})();

const render = () => {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, grid.array.length * size, grid.array.length * size);

    if (grid.created == true) {
        for (let y = 0; y < grid.array.length; y++) {
            let yPos = y * size;
            for (let x = 0; x < grid.array.length; x++) {
                let xPos = x * size;
                let data = grid.array[y][x];

                if (data.num > 0) {
                    ctx.font = "30px Ubuntu";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#000";
                    ctx.fillText(data.num, xPos + (size / 2), yPos + (size / 1.3));
                } else {
                    ctx.fillStyle = "rgb(255, 225, 225)";
                    ctx.fillRect(xPos, yPos, size, size);
                    if (correct) {
                        ctx.font = "30px Ubuntu";
                        ctx.textAlign = "center";
                        ctx.fillStyle = "#000";
                        ctx.fillText(data.num2, xPos + (size / 2), yPos + (size / 1.3));
                    } else {
                        if (changer.check) {
                            if (changer.x > xPos &&
                                changer.y > yPos &&
                                changer.x < xPos + size &&
                                changer.y < yPos + size) {
                                    data.num3++;
                                    data.num3 = data.num3 % 10;
                                    changer.check = false;
                            }
                        }
                        if (data.num3 > 0) {
                            ctx.font = "30px Ubuntu";
                            ctx.textAlign = "center";
                            ctx.fillStyle = "#000";
                            ctx.fillText(data.num3, xPos + (size / 2), yPos + (size / 1.3));
                        }
                    }
                }
            }
        }
    } else if (grid.created == false) {
        ctx.font = "50px Ubuntu";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText("生成ちゅー", canvas.width / 2, canvas.height / 2);
    }

    for (let y = 1; y < grid.array.length; y++) {
        ctx.beginPath();
        ctx.strokeStyle = y % 3 == 0 ? "rgb(50, 50, 50)" : "rgb(100, 100, 100)";
        ctx.lineWidth = y % 3 == 0 ? 2 : 1;
        ctx.moveTo(0, y * size);
        ctx.lineTo(grid.array.length * size, y * size);
        ctx.stroke();
    }
    for (let x = 1; x < grid.array.length; x++) {
        ctx.beginPath();
        ctx.strokeStyle = x % 3 == 0 ? "rgb(50, 50, 50)" : "rgb(100, 100, 100)";
        ctx.lineWidth = x % 3 == 0 ? 2 : 1;
        ctx.moveTo(x * size, 0);
        ctx.lineTo(x * size, grid.array.length * size);
        ctx.stroke();
    }

    changer.check = false;
    window.requestAnimationFrame(render);
};

window.onload = render;