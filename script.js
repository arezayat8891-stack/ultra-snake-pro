const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 25;

let snake = [{x:10,y:10}];
let food = spawnFood();
let dx = 1, dy = 0;

let score = 0;
let highScore = localStorage.getItem("hs") || 0;

let speed = 120;
let particles = [];

document.getElementById("score").innerText = score;

function spawnFood(){
  return {
    x: Math.floor(Math.random()*grid),
    y: Math.floor(Math.random()*grid)
  };
}

document.addEventListener("keydown", e=>{
  if(e.key==="ArrowUp" && dy===0){dx=0;dy=-1;}
  if(e.key==="ArrowDown" && dy===0){dx=0;dy=1;}
  if(e.key==="ArrowLeft" && dx===0){dx=-1;dy=0;}
  if(e.key==="ArrowRight" && dx===0){dx=1;dy=0;}
});

function explode(x,y){
  for(let i=0;i<8;i++){
    particles.push({
      x:x,y:y,
      dx:(Math.random()-0.5)*2,
      dy:(Math.random()-0.5)*2,
      life:20
    });
  }
}

function update(){
  let head = {x:snake[0].x+dx, y:snake[0].y+dy};

  // collision
  if(
    head.x<0||head.y<0||
    head.x>=grid||head.y>=grid||
    snake.some(s=>s.x===head.x && s.y===head.y)
  ){
    if(score > highScore){
      highScore = score;
      localStorage.setItem("hs", highScore);
    }
    alert("💀 Game Over | Score: "+score+" | High: "+highScore);
    location.reload();
  }

  snake.unshift(head);

  if(head.x===food.x && head.y===food.y){
    score++;
    document.getElementById("score").innerText = score;

    explode(food.x, food.y);

    food = spawnFood();

    // 🔥 dynamic speed
    speed = Math.max(50, 120 - score*2);
  } else {
    snake.pop();
  }

  // particles update
  particles.forEach(p=>{
    p.x += p.dx;
    p.y += p.dy;
    p.life--;
  });

  particles = particles.filter(p=>p.life>0);
}

function draw(){
  // background cyber grid
  ctx.fillStyle="#050505";
  ctx.fillRect(0,0,500,500);

  ctx.strokeStyle="#0f0f0f";
  for(let i=0;i<500;i+=25){
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.lineTo(i,500);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,i);
    ctx.lineTo(500,i);
    ctx.stroke();
  }

  // food glow
  ctx.shadowBlur=25;
  ctx.shadowColor="red";
  ctx.fillStyle="red";
  ctx.fillRect(food.x*20,food.y*20,18,18);

  // snake glow gradient
  ctx.shadowBlur=30;
  ctx.shadowColor="#0ff";

  snake.forEach((s,i)=>{
    ctx.fillStyle = i===0 ? "#00ffff" : "#0088ff";
    ctx.fillRect(s.x*20,s.y*20,18,18);
  });

  // particles
  ctx.shadowBlur=0;
  ctx.fillStyle="orange";
  particles.forEach(p=>{
    ctx.fillRect(p.x*20,p.y*20,5,5);
  });
}

function loop(){
  update();
  draw();
  setTimeout(()=>requestAnimationFrame(loop), speed);
}

loop();
