const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {};
let paused = false;

const gravity = 0.6;

const player = {
  x: 50,
  y: 300,
  w: 30,
  h: 30,
  vx: 0,
  vy: 0,
  onGround: false
};

const platform = {
  x: 0,
  y: 350,
  w: 800,
  h: 50
};

// Store time states
let history = [];

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === " ") paused = !paused;
  if (e.key === "r") rewind();
});

document.addEventListener("keyup", e => keys[e.key] = false);

function rewind() {
  if (history.length > 0) {
    const state = history.pop();
    Object.assign(player, state);
  }
}

function update() {
  if (paused) return;

  // Save history
  history.push({ ...player });
  if (history.length > 300) history.shift();

  // Movement
  player.vx = 0;
  if (keys["ArrowLeft"]) player.vx = -4;
  if (keys["ArrowRight"]) player.vx = 4;

  if (keys["ArrowUp"] && player.onGround) {
    player.vy = -12;
    player.onGround = false;
  }

  player.vy += gravity;

  player.x += player.vx;
  player.y += player.vy;

  // Platform collision
  if (
    player.y + player.h >= platform.y &&
    player.x + player.w > platform.x &&
    player.x < platform.x + platform.w
  ) {
    player.y = platform.y - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  // Bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width)
    player.x = canvas.width - player.w;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Platform
  ctx.fillStyle = "lime";
  ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

  // Player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  if (paused) {
    ctx.fillStyle = "yellow";
    ctx.font = "30px Arial";
    ctx.fillText("⏸ PAUSED", 330, 200);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
