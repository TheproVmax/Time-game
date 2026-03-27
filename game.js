const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {}, map="", level=0;
let coins = 0;
let skin = "cyan";
let checkpoint = {x:50,y:300};

const gravity = 0.7;

const player = {
  x:50,y:300,w:30,h:30,vx:0,vy:0,onGround:false
};

const maps = {
  forest: createLevels("green"),
  lava: createLevels("red"),
  space: createLevels("purple")
};

let platforms=[], boss=null;

document.addEventListener("keydown",e=>keys[e.key]=true);
document.addEventListener("keyup",e=>keys[e.key]=false);

function createLevels(color){
  let levels=[];
  for(let i=1;i<=20;i++){
    levels.push({
      color,
      platforms:[
        {x:100,y:350,w:200,h:20},
        {x:350,y:300-20*i,w:150,h:20},
        {x:600,y:250,w:150,h:20}
      ],
      checkpoint:{x:350,y:260},
      boss: i===20 ? createBoss() : null
    });
  }
  return levels;
}

function createBoss(){
  return {
    x:650,y:250,w:70,h:70,
    hp:10,
    attackTimer:0
  };
}

function startGame(m){
  map=m;
  level=0;
  coins=0;
  document.getElementById("menu").hidden=true;
  document.getElementById("hud").hidden=false;
  loadLevel();
}

function loadLevel(){
  let l = maps[map][level];
  platforms=l.platforms;
  checkpoint=l.checkpoint;
  boss = l.boss ? {...l.boss} : null;
  player.x=checkpoint.x;
  player.y=checkpoint.y;
}

function toggleShop(){
  document.getElementById("shop").hidden =
    !document.getElementById("shop").hidden;
}

function buySkin(c,price){
  if(coins>=price){
    skin=c;
    coins-=price;
  }
}

function update(){
  player.vx=0;
  if(keys["ArrowLeft"]) player.vx=-4;
  if(keys["ArrowRight"]) player.vx=4;
  if(keys["ArrowUp"]&&player.onGround){
    player.vy=-12;
    player.onGround=false;
  }

  player.vy+=gravity;
  player.x+=player.vx;
  player.y+=player.vy;
  player.onGround=false;

  platforms.forEach(p=>{
    if(player.x<p.x+p.w&&player.x+player.w>p.x &&
       player.y+player.h>p.y&&player.y+player.h<p.y+p.h+10){
      player.y=p.y-player.h;
      player.vy=0;
      player.onGround=true;
      checkpoint={x:p.x,y:p.y-40};
    }
  });

  if(boss){
    boss.attackTimer++;
    if(boss.attackTimer%120===0){
      if(Math.abs(player.x-boss.x)<80) loadLevel();
    }
    if(player.x+player.w>boss.x){
      boss.hp--;
      coins+=10;
      player.x=50;
      if(boss.hp<=0) nextLevel();
    }
  }

  if(player.y>canvas.height) loadLevel();
  if(player.x>canvas.width-20 && !boss) nextLevel();
}

function nextLevel(){
  level++;
  if(level>=20){
    alert("🏆 MAP COMPLETE!");
    location.reload();
  }
  loadLevel();
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle=maps[map][level].color;
  platforms.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));

  ctx.fillStyle=skin;
  ctx.fillRect(player.x,player.y,player.w,player.h);

  if(boss){
    ctx.fillStyle="orange";
    ctx.fillRect(boss.x,boss.y,boss.w,boss.h);
    ctx.fillStyle="red";
    ctx.fillRect(600,20,boss.hp*20,10);
  }

  document.getElementById("info").textContent=
    `Map:${map} | Level:${level+1}/20 | Coins:${coins}`;
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
