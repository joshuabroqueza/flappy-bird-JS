const Gravity = 0.4;
const FLY = -8;
const PIPE_HEIGHT = 200;
const BIRD_X = 50;

let bird;
let pipes = [];
let bird_img;
let score = 0;

function preload() {
  bird_img = loadImage("https://image.flaticon.com/icons/svg/826/826910.svg");
}
function setup() {
  createCanvas(500, 600);
  bird = new Bird();
  pipes.push(new Pipe());
  imageMode(CENTER);
}

function draw() {
  background(255);

  for (let i = pipes.length - 1; i > 0; i--) {
    const pipe = pipes[i];

    pipe.update();
    pipe.draw();

    if (bird.hits(pipe)) {
      pipes.splice(0, pipes.length - 1);
      score = 0;
    }

    if (pipe.isOffscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.draw();

  if (frameCount % 80 === 0) {
    pipes.push(new Pipe());
  }

  fill(50);
  textSize(20);
  text(`Score: ${score}`, width - 80, 20);
}

function keyPressed() {
  if (keyCode === 32) {
    bird.fly();
  }
}

class Bird {
  constructor() {
    this.x = BIRD_X;
    this.y = height / 2;
    this.size = 40;

    this.yVelocity = 0;
  }

  update() {
    this.yVelocity += Gravity;
    this.y += this.yVelocity;

    //TODO:END
    if (this.y + this.size / 2 > height) {
      this.y = height - this.size / 2;
      this.yVelocity = 0;
    }

    if (this.yVelocity > 10) {
      this.yVelocity = 10;
    }
    if (this.yVelocity < -10) {
      this.yVelocity = -10;
    }
  }

  fly() {
    this.yVelocity += FLY;
  }

  hits(pipe) {
    if (
      this.y - this.size / 2 < pipe.top ||
      this.y + this.size / 2 > pipe.bottom
    ) {
      if (
        this.x + this.size / 2 > pipe.x &&
        this.x - this.size / 2 < pipe.x + pipe.width
      ) {
        return true;
      }
    }

    return false;
  }

  draw() {
    fill(255, 0, 100);
    noStroke();
    //circle(this.x, this.y, this.size, this.size);
    image(bird_img, this.x, this.y, this.size, this.size);
  }
}

class Pipe {
  constructor() {
    this.x = width;
    this.top = Math.random() * height - 100;
    this.bottom = this.top + PIPE_HEIGHT;
    this.width = 40;
    this.incrementScore = false;
  }

  update() {
    this.x -= 3;
    if (this.x + this.width / 2 < BIRD_X) {
      if (!this.incrementScore) {
        score++;

        this.incrementScore = true;
      }
    }
  }

  isOffscreen() {
    return this.x + this.width < 0;
  }
  draw() {
    fill(100, 255, 100);
    rect(this.x, 0, this.width, this.top);
    rect(this.x, this.bottom, this.width, height);
  }
}
