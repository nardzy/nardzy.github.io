window.onload = function() {
    let elem = {};
    let divs = document.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
        let div = divs[i];

        elem[div.id] = document.querySelector("#" + div.id);
    }

    elem.loading.style.opacity = 0;

    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d");

    canvas.oncontextmenu = function() {
        return false;
    };

    let screen = new class {
        constructor() {
            this.w = 1920;
            this.h = 1080;
            this.w2 = this.w;
            this.h2 = this.h;
        }
    }();

    const shape = (radius, shape, arc, Cradius, pos) => {
        pos = pos||[];
        let dir = 0;
        let rePos = pos[0];
        let add = rePos||0;
        let rad = add + radius;
        for (let i = 0; i < shape; i++) {
            dir = (i / shape) * (Math.PI * 2);
            rePos = pos[i];
            add = rePos||0;
            rad = add + radius;
            if (i == 0) {
                ctx.moveTo(rad * Math.cos(dir), rad * Math.sin(dir));
            } else {
                if (arc) {
                    ctx.arcTo(rad * Math.cos(dir), rad * Math.sin(dir), rad * Math.cos(dir + (Math.PI / 2)), rad * Math.sin(dir + (Math.PI / 2)), Cradius);
                } else {
                    ctx.lineTo(rad * Math.cos(dir), rad * Math.sin(dir));
                }
            }
        }
        dir = 0;
        rePos = pos[0];
        add = rePos||0;
        rad = add + radius;
        if (arc) {
            ctx.arcTo(rad * Math.cos(dir), rad * Math.sin(dir), rad * Math.cos(dir + (Math.PI / 2)), rad * Math.sin(dir + (Math.PI / 2)), Cradius);

            dir = (1 / shape) * (Math.PI * 2);
            rePos = pos[0];
            add = rePos||0;
            rad = add + radius;

            ctx.arcTo(rad * Math.cos(dir), rad * Math.sin(dir), rad * Math.cos(dir + (Math.PI / 2)), rad * Math.sin(dir + (Math.PI / 2)), Cradius);

        } else {
            ctx.lineTo(rad * Math.cos(dir), rad * Math.sin(dir));
            
            dir = (1 / shape) * (Math.PI * 2);
            rePos = pos[0];
            add = rePos||0;
            rad = add + radius;

            ctx.lineTo(rad * Math.cos(dir), rad * Math.sin(dir));
        }
    };

    let random = {
        int: (min, max) => {
            return Math.floor(min + Math.random() * (max - min + 1));
        },
        float: (min, max) => {
            return min + Math.random() * (max - min);
        },
    };

    class createObject {
        constructor() {
           this.shape = random.int(3, 7);
           this.radius = random.int(20, 50);
           this.speed = random.float(1, 3);
           this.rotateSpeed = random.float(0.001, 0.01);
           this.rotate = random.float(0, Math.PI * 2);
           this.ranMov = random.float(-0.1, 0.1);
           this.x = screen.w + this.radius * 2;
           this.y = Math.random() * screen.h;
           this.special = random.int(0, 20) == 0 ? true : false;
        }
    }

    let ground = new class {
        constructor() {
            this.rate = 0;
            this.rateMax = 10;
            this.red = 100;
            this.green = 100;
            this.blue = 100;
            this.change = 0;
            this.rgb = "rgb(0, 0, 0)";
            this.shapes = [];

            for (let i = 0; i < 10; i++) {
                this.shapes.push(new createObject());
            }
        }
        getRgb() {
            return `rgb(${this.red}, ${this.green}, ${this.blue})`;
        }
        update() {
            
            this.rate++;
            if (this.rate >= this.rateMax) {
                this.rate = 0;
                if (this.change) {
                    this.red--;
                    this.green++;
                    if (this.red <= 0) {
                        this.change = 0;
                    }
                } else {
                    this.red++;
                    this.green--;
                    if (this.green <= 0) {
                        this.change = 1;
                    }
                }
            }

            this.rgb = this.getRgb();
        }
    }();

    const resize = () => {

        screen.w = window.innerWidth;
        screen.h = window.innerHeight;
        screen.w2 = screen.w * window.devicePixelRatio;
        screen.h2 = screen.h * window.devicePixelRatio;
    
        canvas.width = screen.w2;
        canvas.height = screen.h2;
    
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
        canvas.style.width = screen.w + "px";
        canvas.style.height = screen.h + "px";

    };

    const visual = () => {

        ctx.globalAlpha = 1;
        ground.update();

        ctx.fillStyle = ground.rgb;
        ctx.fillRect(0, 0, screen.w, screen.h);

        ctx.globalAlpha = 0.7;
        for (let i = 0; i < ground.shapes.length; i++) {
            let obj = ground.shapes[i];

            if (obj.x < -obj.radius) {
                ground.shapes[i] = new createObject();
            } else {
                obj.x -= obj.speed;
                obj.y -= Math.sin(obj.ranMov);
                obj.rotate += obj.rotateSpeed;
            }

            ctx.beginPath();
            ctx.save();
            ctx.translate(obj.x, obj.y);
            ctx.rotate(obj.rotate);
            ctx.lineWidth = obj.radius / 2;
            ctx.fillStyle = "rgb(120, 120, 120)";
            ctx.strokeStyle = "rgb(55, 55, 55)";
            shape(obj.radius, obj.shape, true, 0.1);
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }

        window.requestAnimationFrame(visual);
    };

    resize();
    visual();

    window.onresize = resize;

}
