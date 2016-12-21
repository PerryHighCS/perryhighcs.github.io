var MAX_SIZE = 120;
var NUM_GEARS = 10;

var canvas;
var parent;
var gears = [];

var centerX;
var centerY;
var width;
var height;

function doGears(newParent) {
    canvas = document.createElement("canvas"); //document.getElementById("test");
    parent = newParent;

    canvas.width = 512;
    canvas.height = 512;

    width = canvas.width;
    height = canvas.height;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    gears.push(new Gear(Math.random() * canvas.width, Math.random() * canvas.height, MAX_SIZE));

    for (var i = 1; i < NUM_GEARS; i++) {
        var angle = Math.random() * 2 * Math.PI;
        var size = (Math.random() * (MAX_SIZE - 30)) + 30;

        var distance = size + gears[i - 1].r;
        var xpos = gears[i - 1].x + (distance * Math.cos(angle));
        var ypos = gears[i - 1].y + (distance * Math.sin(angle));

        if (xpos < 0) {
            xpos += width;
        }
        if (ypos < 0) {
            ypos += width;
        }

        xpos %= width;
        ypos %= height;

        gears.push(new Gear(xpos, ypos, size));
    }

    draw();
}

function draw() {
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(16,16,16,1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < gears.length; i++) {
        gears[i].draw(ctx);
    }

    parent.style.background = "url(" + canvas.toDataURL("image/png") + ") repeat";
}

function Gear(x_, y_, r_) {
    this.x = x_;
    this.y = y_;
    this.r = r_;

    this.draw = function(ctx) {
        ctx.fillStyle = 'rgba(128,128,128,1)';

        this.drawGear(this.x, this.y, this.r, ctx);

        if (this.x - this.r < 0) {
            this.drawGear(this.x + width, this.y, this.r, ctx);
        }
        if (this.y - this.r < 0) {
            this.drawGear(this.x, this.y + height, this.r, ctx);
        }
        if ((this.x - this.r < 0) && (this.y - this.r < 0)) {
            this.drawGear(this.x + width, this.y + height, this.r, ctx);
        }
        
        if (this.x + this.r > width) {
            this.drawGear(this.x - width, this.y, this.r, ctx);
        }
        if (this.y + this.r > height) {
            this.drawGear(this.x, this.y - height, this.r, ctx);
        }
        if ((this.x + this.r > width) && (this.y + this.r > height)) {
            this.drawGear(this.x - width, this.y - height, this.r, ctx);;
        }
    };

    this.drawGear = function(x, y, r, ctx) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    };
}