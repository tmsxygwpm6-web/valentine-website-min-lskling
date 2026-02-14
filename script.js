<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>För Sarah ❤️</title>
<style>
html,body{
  margin:0;
  padding:0;
  overflow:hidden;
  background:black;
}
canvas{
  position:fixed;
  inset:0;
}
#valentinesButton{
  position:fixed;
  left:50%;
  bottom:40px;
  transform:translateX(-50%);
  padding:14px 24px;
  border-radius:30px;
  border:none;
  background:rgba(255,255,255,0.15);
  color:white;
  font-size:18px;
  backdrop-filter:blur(6px);
  display:none;
  cursor:pointer;
}
.quizOverlay{
  position:fixed;
  inset:0;
  display:none;
  place-items:center;
  background:rgba(0,0,0,0.6);
  backdrop-filter:blur(8px);
  font-family:Arial;
}
.quizCard{
  background:rgba(20,20,30,0.9);
  padding:20px;
  border-radius:20px;
  width:90%;
  max-width:500px;
  color:white;
  text-align:center;
}
.quizBtns{
  display:flex;
  gap:10px;
  margin-top:15px;
}
.quizBtns button{
  flex:1;
  padding:12px;
  border-radius:12px;
  border:none;
  font-size:16px;
  cursor:pointer;
}
.quizBtns .yes{background:#2ecc71;}
.quizBtns .no{background:#e74c3c;}
.progress{
  margin-top:10px;
  font-size:14px;
  opacity:0.8;
}
</style>
</head>
<body>

<canvas id="starfield"></canvas>
<button id="valentinesButton">Tryck här ❤️</button>

<div class="quizOverlay" id="quizOverlay">
  <div class="quizCard">
    <h2>En liten quiz 💘</h2>
    <p id="quizQuestion"></p>
    <div class="quizBtns">
      <button class="yes" id="yesBtn">Ja</button>
      <button class="no" id="noBtn">Nej</button>
    </div>
    <div class="progress" id="progressText"></div>
  </div>
</div>

<script>
// ================== CANVAS ==================
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize",()=>{
  canvas.width=innerWidth;
  canvas.height=innerHeight;
});

// ================== STARS ==================
const stars=[];
for(let i=0;i<400;i++){
  stars.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*1.5,
    o:Math.random()
  });
}
function drawStars(){
  stars.forEach(s=>{
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${s.o})`;
    ctx.fill();
  });
}

// ================== HEARTS ==================
let hearts=[];
function spawnHearts(x,y,big=false){
  for(let i=0;i<(big?200:80);i++){
    hearts.push({
      x,y,
      vx:(Math.random()-0.5)*(big?12:8),
      vy:(Math.random()-0.5)*(big?12:8),
      life:1
    });
  }
}
function drawHearts(){
  hearts.forEach(h=>{
    ctx.fillStyle=`rgba(255,80,170,${h.life})`;
    ctx.beginPath();
    ctx.arc(h.x,h.y,4,0,Math.PI*2);
    ctx.fill();
    h.x+=h.vx;
    h.y+=h.vy;
    h.life-=0.02;
  });
  hearts=hearts.filter(h=>h.life>0);
}

// ================== PIANO ==================
let audioStarted=false;
let audioCtx;
function startPiano(){
  if(audioStarted)return;
  audioStarted=true;
  audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  const scale=[220,261.63,329.63,392,440];
  let step=0;
  setInterval(()=>{
    const osc=audioCtx.createOscillator();
    const gain=audioCtx.createGain();
    osc.frequency.value=scale[step%scale.length];
    osc.type="sine";
    gain.gain.setValueAtTime(0.0001,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3,audioCtx.currentTime+0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime+0.5);
    step++;
  },450);
}

// ================== TEXT ==================
let frame=0;
let opacity=0;

function drawText(){
  ctx.font="28px Comic Sans MS";
  ctx.textAlign="center";
  ctx.shadowColor="rgba(255,100,200,1)";
  ctx.shadowBlur=12;
  ctx.fillStyle=`rgba(255,100,200,${opacity})`;

  if(frame<300){
    ctx.fillText("Sarah…",canvas.width/2,canvas.height/2);
    opacity+=0.01;
  }
  else if(frame<900){
    ctx.fillText("Jag älskar hur du skrattar.",canvas.width/2,canvas.height/2);
  }
  else if(frame<1500){
    ctx.fillText("Hur du kan bli lite arg… men ändå vara söt.",canvas.width/2,canvas.height/2);
  }
  else if(frame<2100){
    ctx.fillText("Hur du känner saker på riktigt.",canvas.width/2,canvas.height/2);
  }
  else if(frame<2700){
    ctx.fillText("Hur du ser de små sakerna i livet.",canvas.width/2,canvas.height/2);
  }
  else{
    ctx.fillText("Jag älskar dig, Sarah. ❤️",canvas.width/2,canvas.height/2);
    document.getElementById("valentinesButton").style.display="block";
  }

  ctx.shadowBlur=0;
}

// ================== QUIZ ==================
const questions=[
"Okej Sarah… är Ameen galet kär i dig? 😌",
"Är ditt skratt Ameens favorit-ljud? 😂",
"Är din lilla arga sida också älskad? 😏",
"Är du den mest ödmjuka och känslosamma personen han känner? 🥹",
"Är du hans favoritperson i hela universum? 🌌❤️"
];
let q=0;

function showQuestion(){
  document.getElementById("quizQuestion").textContent=questions[q];
  document.getElementById("progressText").textContent="Fråga "+(q+1)+"/5";
}

document.getElementById("yesBtn").onclick=()=>{
  q++;
  if(q>=questions.length){
    document.getElementById("quizOverlay").style.display="none";
    spawnHearts(canvas.width/2,canvas.height/2,true);
    alert("Du klarade provet, Sarah 💘");
  }else{
    showQuestion();
  }
};

document.getElementById("noBtn").onclick=()=>{
  alert("Du svarade fel 😼 Vill du göra om provet?");
  q=0;
  showQuestion();
};

document.getElementById("valentinesButton").onclick=(e)=>{
  e.target.textContent="luv you ❤️";
  startPiano();
  spawnHearts(canvas.width/2,canvas.height/2);
  document.getElementById("quizOverlay").style.display="grid";
  showQuestion();
};

// ================== LOOP ==================
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawStars();
  drawText();
  drawHearts();
  frame++;
  requestAnimationFrame(loop);
}
loop();
</script>

</body>
</html>
