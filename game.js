const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {};
let map = "";
let levelIndex = 0;
let coins = 0;

const gravity = 0.7;

const player = {
  x: 50, y: 300, w: 30, h: 30,
  vx: 0, vy: 0, onGround: false,
  color: "cyan"
};

let checkpoint = { x: 50, y: 300 };
let platforms = [];
let boss = null;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

const maps = {
  forest: createLevels("green"),
  lava: createLevels("red"),
  space: createLevels("purple")
};

function createLevels(color) {
  let levels = [];
  for (let i = 1; i <= 20; i++) {
    levels.push({
      color,
      platforms: [
        { x: 50,  y: 380, w: 200, h: 20 },
        { x: 300, y: 320, w: 150, h: 20 },
        { x: 550, y: 260, w: 150, h: 20 },
        { x: 750, y: 200, w: 100, h: 20 }
      ],
      checkpoint: { x: 300, y: 280 },
      boss: i === 20 ? createBoss() : null
    });
  }
  return levels;
}

function createBoss() {
  return { x: 720, y: 130, w: 60, h: 60, hp: 10, timer: 0 };
}

function startGame(selectedMap) {
  map = selectedMap;
  levelIndex = 0;

  document.getElementById("menu").hidden = true;
  document.getElementById("hud").hidden = false;
  canvas.hidden = false;

  loadLevel();
}

function loadLevel() {
  const level = maps[map][levelIndex];
  platforms = level.platforms;
  checkpoint = level.checkpoint;
  boss = level.boss ? { ...level.boss } : null;

  player.x = checkpoint.x;
  player.y = checkpoint.y;
  player.vx = player.vy = 0;
}

function update() {
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
      checkpoint = { x: p.x, y: p.y - 40 };
    }
  });

  if (boss) {
    boss.timer++;
    if (boss.timer % 120 === 0 && Math.abs(player.x - boss.x) < 80) {
      loadLevel(); // boss attack
    }
    if (player.x + player.w > boss.x) {
      boss.hp--;
      coins += 10;
      player.x = 50;
      if (boss.hp <= 0) nextLevel();
    }
  }

  if (player.y > canvas.height) loadLevel();
  if (player.x > canvas.width - 10 && !boss) nextLevel();
}

function nextLevel() {
  levelIndex++;
  if (levelIndex >= 20) {
    alert("🏆 MAP COMPLETE!");
    location.reload();
  }
  loadLevel();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = maps[map][levelIndex].color;
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  if (boss) {
    ctx.fillStyle = "orange";
    ctx.fillRect(boss.x, boss.y, boss.w, boss.h);

    ctx.fillStyle = "red";
    ctx.fillRect(20, 20, boss.hp * 15, 10);
  }

  document.getElementById("info").textContent =
    `Map: ${map} | Level: ${levelIndex + 1}/20 | Coins: ${coins}`;
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
