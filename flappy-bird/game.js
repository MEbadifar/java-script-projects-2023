var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var DEGREE = Math.PI / 180;

var frames = 0;
var sprite = new Image();
sprite.src = "img/original.png";

var SCORE = new Audio();
SCORE.src = "sound/score.wav";
var FLAP = new Audio();
FLAP.src = "sound/jump.wav";
var HIT = new Audio();
HIT.src = "sound/hit.wav";
var DIE = new Audio();
DIE.src = "sound/die.wav";
var START = new Audio();
START.src = "sound/start.wav";

var state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
};
function clickhandler() {
  switch (state.current) {
    case state.getReady:
      START.play();
      state.current = state.game;
      break;

    case state.game:
      FLAP.play();
      bird.flap();
      break;

    default:
      bird.speed = 0;
      bird.rotation = 0;
      pipes.position = [];
      score.value = 0;
      state.current = state.getReady;
      break;
  }
}
document.addEventListener("click", clickhandler);
document.addEventListener("keydown", function (e) {
  /**
   * ! 32 is "space " asscii code
   */
  if (e.which == 32) {
    clickhandler();
  }
});
/**
 * ! Background Picture
 */
var bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,
  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};
/**
 * ! forderground Picture
 */
var fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  dx: 2,
  y: cvs.height - 112,
  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
  update: function () {
    if (state.current == state.game) {
      /**
       * ! moving the forderground: when the half of the forderground is outside than the forderground come back to its position
       * ! if the half of the forderground is outside of the canvas than this.x will be 0
       */
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  },
};
/**
 * ! Bird Picture
 */
var bird = {
  animation: [
    {
      sX: 276,
      sY: 112,
    },
    {
      sX: 276,
      sY: 139,
    },

    {
      sX: 276,
      sY: 164,
    },
    {
      sX: 276,
      sY: 139,
    },
  ],
  w: 34,
  h: 26,
  x: 50,
  y: 150,
  speed: 0,
  gravity: 0.25,
  animationIndex: 0,
  rotation: 0,
  jump: 3.1,
  radius: 12,
  draw: function () {
    let bird = this.animation[this.animationIndex];
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.w / 2,
      this.w,
      this.h
    );
    ctx.restore();
  },
  update: function () {
    /**
     * ! every 5 or 10 frames change the bird pic or index(simulate the bird flying)
     */
    let period = state.current == state.getReady ? 10 : 5;
    this.animationIndex += frames % period == 0 ? 1 : 0;
    this.animationIndex = this.animationIndex % this.animation.length;
    if (state.current == state.getReady) {
      this.y = 150;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.speed < this.jump) {
        this.rotation = -25 * DEGREE;
      } else {
        this.rotation = 90 * DEGREE;
      }
    }

    if (this.y + this.h / 2 >= cvs.height - fg.h) {
      this.y = cvs.height - fg.h - this.h / 2;
      this.animationIndex = 1;

      if (state.current == state.game) {
        DIE.play();
        state.current = state.over;
      }
    }
  },
  flap: function () {
    this.speed = -this.jump;
  },
};
/**
 * ! getReady Picture
 */
var getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width / 2 - 173 / 2,
  y: 80,
  draw: function () {
    if (state.current == state.getReady) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};
/**
 * ! game Over Picture
 */
var gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width / 2 - 225 / 2,
  y: 90,
  draw: function () {
    if (state.current == state.over) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};
/**
 * ! pipes Picture
 */
var pipes = {
  top: { sX: 553, sY: 0 },
  bottom: { sX: 502, sY: 0 },
  w: 53,
  h: 400,
  dx: 2,
  gap: 80,
  position: [],
  maxYPos: -150,
  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;
      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPos,
        this.w,
        this.h
      );
    }
  },
  update: function () {
    /**
     * !create new Pipes
     */
    if (state.current != state.game) return;
    /**
     * !every 100 frames create new pip
     */
    if (frames % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1),
      });
    }
    /**
     * ! "for" movienig the Pipes to left
     */
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= this.dx;
      let bottomPipesPos = p.y + this.h + this.gap;
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        HIT.play();
        state.current = state.over;
      }
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipesPos &&
        bird.y - bird.radius < bottomPipesPos + this.h
      ) {
        HIT.play();
        state.current = state.over;
      }

      /**
       * ! deleting every passed pipes from array "position"
       */
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        SCORE.play();
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },
};
/**
 * ! Score section
 */
var score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,
  draw: function () {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    if (state.current == state.game) {
      ctx.linewidth = 2;
      ctx.font = "35px IMPACT";
      ctx.fillText(this.value, cvs.width / 2, 50);
      ctx.strokeText(this.value, cvs.width / 2, 50);
    } else if (state.current == state.over) {
      ctx.font = "25px IMPACT";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);

      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },
};

function update() {
  bird.update();
  fg.update();
  pipes.update();
}

//draw new frame and runn it
function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

function animate() {
  update();
  draw();
  frames++;
  requestAnimationFrame(animate);
}

animate();
