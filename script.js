const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let grid = 20;

let snake = [{x:10,y:10}];
let food = spawnFood();
let dx = 1, dy = 0;
let score = 0;

document.addEventListener("keydown", e=>{
  if(e.key==="ArrowUp" && dy===0){dx=0;dy=-1;}
  if(e.key==="ArrowDown" && dy===0){dx=0;dy=1;}
  if(e.key==="ArrowLeft" && dx===0){dx=-1;dy=0;}
  if(e.key==="ArrowRight" && dx===0){dx=1;dy=0;}
});

function spawnFood(){
  return {
    x: Math.floor(Math.random()*grid),
    y: Math.floor(Math.random()*grid)
  };
}

function loop(){
  let head = {x:snake[0].x+dx, y:snake[0].y+dy};

  snake.unshift(head);

  if(head.x===food.x && head.y===food.y){
    score++;
    document.getElementById("score").innerText = score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  // draw
  ctx.fillStyle="#0a0a0a";
  ctx.fillRect(0,0,500,500);

  ctx.fillStyle="#0ff";
  snake.forEach(s=>{
    ctx.fillRect(s.x*20,s.y*20,18,18);
  });

  ctx.fillStyle="red";
  ctx.fillRect(food.x*20,food.y*20,18,18);
}

setInterval(loop,120);
