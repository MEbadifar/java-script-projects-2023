let canvas = document.querySelector("canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let c = canvas.getContext("2d");

//"this" refer to parent object "Window" , not the class "Ball".
this.screen = {
  width: this.window.innerWidth,
  height: this.window.innerHeight,
};

this.mouse = {
  x: screen.width / 2,
  y: screen.height / 2,
};

class Ball {
  constructor(x, y, dx, dy, r, color) {
    this.gravity = 1;
    this.friction = 0.8;
    this.r = r || 20;
    this.x = x || randomIntFromInterval(0 + this.r, window.innerWidth - this.r);
    this.y =
      y || randomIntFromInterval(0 + this.r, window.innerHeight - this.r);
    this.dx = dx || (Math.random() - 0.5) * 20;
    this.dy = dy || Math.random() * 4;
    this.color = color || `rgb(231,76,60,${Math.random()})`;
    this.draw();
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    // c.fillStyle ="#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
    c.fillStyle = "red";
    c.fill();
  }

  update() {
    
    if (this.y + this.r + this.dy > screen.height) {
      this.dy = - this.dy * this.friction;
      this.dx = - this.dx * this.friction;
  
    } else {
      this.dy += this.gravity;
    }
    if (this.x + this.r + this.dx > screen.width||this.x + this.r + this.dx <=0) {
      this.dx = - this.dx;
  
    }
    this.y += this.dy;
    this.x += this.dx;
    this.draw();
  }
}

class Canvas {
  constructor() {
    this.balls = [];
    for (let i = 0; i < 50; i++) {
      this.balls.push(new Ball());
    }
  }

  animate() {
    // "clearRect" clear the Screen after every frame
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.balls.forEach((ball) => {
      ball.update();
    });
    /* the first "this" refer to RequestAnimationFrame and this Function is in object Global and not to class Canvas .
     * for reffering to Canvas  must binding Animate to  "this" in Canvase
     */
    requestAnimationFrame(this.animate.bind(this));
  }
}
let mycan = new Canvas();
mycan.animate();

window.addEventListener("mousemove", function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", function () {
  canvas.width = this.window.innerWidth;
  canvas.height = this.window.innerHeight;
});

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
