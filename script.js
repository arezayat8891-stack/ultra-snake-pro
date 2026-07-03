const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 25;

let snake = [{x:10,y:10}];
let food = spawn();
let enemy = {x:5,y:5};

let dx = 1, dy = 0;
let score = 0;
let speed = 120;
let obstacles = [];

let high = localStorage.getItem("hs") || 0;

function spawn(){
  return {
    x: Math.floor(Math.random()*grid),
    y: Math.floor(Math.random()*grid)
  };
}

// 🎮 controls
document.addEventListener("keydown", e=>{
  if(e.key==="ArrowUp" && dy===0){dx=0;dy=-1;}
  if(e.key==="ArrowDown" && dy===0){dx=0;dy=1;}
  if(e.key==="ArrowLeft" && dx===0){dx=-1;dy=0;}
  if(e.key==="ArrowRight" && dx===0){dx=1;dy=0;}
});

// 🧱 random obstacles
function genObstacles(){
  obstacles = [];
  for(let i=0;i<10;i++){
    obstacles.push({
      x: Math.floor(Math.random()*grid),
      y: Math.floor(Math.random()*grid)
    });
  }
}
genObstacles();

// 🤖 enemy AI (simple chase)
function moveEnemy(){
  if(enemy.x < snake[0].x) enemy.x++;
  if(enemy.x > snake[0].x) enemy.x--;
  if(enemy.y < snake[0].y) enemy.y++;
  if(enemy.y > snake[0].y) enemy.y--;
}

function update(){
  let head = {x:snake[0].x+dx, y:snake[0].y+dy};

  // 🌌 teleport edges
  if(head.x<0) head.x=grid-1;
  if(head.y<0) head.y=grid-1;
  if(head.x>=grid) head.x=0;
  if(head.y>=grid) head.y=0;

  // 💀 collision
  if(
    snake.some(s=>s.x===head.x && s.y===head.y) ||
    obstacles.some(o=>o.x===head.x && o.y===head.y) ||
    (enemy.x===head.x && enemy.y===head.y)
  ){
    if(score>high){
      high=score;
      localStorage.setItem("hs",high);
    }
    alert(`💀 GAME OVER | Score: ${score} | High: ${high}`);
    location.reload();
  }

  snake.unshift(head);

  if(head.x===food.x && head.y===food.y){
    score++;
    food = spawn();

    // ⚡ difficulty scaling
    speed = Math.max(40, 120 - score*3);

    // 🧱 more obstacles
    if(score % 3 === 0) genObstacles();
  } else {
    snake.pop();
  }

  moveEnemy();
}

function draw(){
  ctx.fillStyle="#050505";
  ctx.fillRect(0,0,500,500);

  // grid neon
  ctx.strokeStyle="#111";
  for(let i=0;i<500;i+=25){
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.lineTo(i,500);
    ctx.stroke();
  }

  // food
  ctx.shadowBlur=20;
  ctx.shadowColor="red";
  ctx.fillStyle="red";
  ctx.fillRect(food.x*20,food.y*20,18,18);

  // snake
  ctx.shadowBlur=25;
  ctx.shadowColor="#0ff";
  ctx.fillStyle="#0ff";
  snake.forEach((s,i)=>{
    ctx.fillRect(s.x*20,s.y*20,18,18);
  });

  // enemy
  ctx.shadowBlur=25;
  ctx.shadowColor="purple";
  ctx.fillStyle="purple";
  ctx.fillRect(enemy.x*20,enemy.y*20,18,18);

  // obstacles
  ctx.shadowBlur=0;
  ctx.fillStyle="gray";
  obstacles.forEach(o=>{
    ctx.fillRect(o.x*20,o.y*20,18,18);
  });
}

function loop(){
  update();
  draw();
  setTimeout(()=>requestAnimationFrame(loop), speed);
}

loop();
