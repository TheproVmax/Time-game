const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {};
let history = [];
let currentMap = "";
let level = 1;
let toolIndex = 0;

const tools = ["NONE", "HIGH JUMP", "DASH"];

const player = {
  x: 50, y: 350, w: 30, h: 30,
  vx: 0, vy: 0, onGround: false
};

const gravity = 0.7;

const maps = {
  forest: { color: "green" },
  lava: { color: "red" },
  space: { color: "purple" }
};

let platforms = [];
let boss = null;

document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === "r") rewind();
});

document.addEventListener("keyup", e => keys[e.key] = false);

function toggleTool() {
  toolIndex = (toolIndex + 1) % tools.length;
}

function startGame(map) {
  currentMap = map;
  level = 1;
  document.getElementById("menu").hidden = true;
  document.getElementById("hud").hidden = false;
  loadLevel();
}

function loadLevel() {
  history = [];
  player.x = 50;
  player.y = 300;
  platforms = [];

  for (let i = 0; i < 5; i++) {
    platforms.push({
      x: 150 * i + 100,
      y: 300 - (i % 2) * 80,
      w: 100,
      h: 20
    });
  }

  // Boss on level 20
  boss = (level === 20) ? {
    x: 700,
    y: 300,
    w: 60,
    h: 60,
    hp: 5
  } : null;
}

function rewind() {
  if (history.length) Object.assign(player, history.pop());
}

function update() {
  history.push({ ...player });
  if (history.length > 240) history.shift();

  player.vx = 0;
  if (keys["ArrowLeft"]) player.vx = -4;
  if (keys["ArrowRight"]) player.vx = 4;

  if (keys["ArrowUp"] && player.onGround) {
    player.vy = tools[toolIndex] === "HIGH JUMP" ? -16 : -12;
    player.onGround = false;
  }

  if (keys["Shift"] && tools[toolIndex] === "DASH") {
    player.vx *= 2;
  }

  player.vy += gravity;
  player.x += player.vx;
  player.y += player.vy;

  player.onGround = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h > p.y &&
      player.y + player.h < p.y + p.h + 10
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  });

  // Boss logic
  if (boss && player.x + player.w > boss.x) {
    boss.hp--;
    player.x = 50;
    if (boss.hp <= 0) nextLevel();
  }

  // Fall = reset
  if (player.y > canvas.height) loadLevel();

  // Finish
  if (player.x > canvas.width - 20 && !boss) nextLevel();
}

function nextLevel() {
  level++;
  if (level > 20) {
    alert("🎉 OBBY COMPLETE!");
    location.reload();
  }
  loadLevel();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = maps[currentMap].color;
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  if (boss) {
    ctx.fillStyle = "orange";
    ctx.fillRect(boss.x, boss.y, boss.w, boss.h);
  }

  document.getElementById("levelText").textContent =
    `Map: ${currentMap.toUpperCase()} | Level ${level}/20 | Tool: ${tools[toolIndex]}`;
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
