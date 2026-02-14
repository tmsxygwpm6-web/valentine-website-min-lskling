<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>För Sarah 💘</title>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  background: black;
  font-family: Arial, sans-serif;
}

#starfield {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: block;
}

/* Hjärt-cursor */
body, button {
  cursor: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 64 64'>\
<path fill='%23ff4da6' d='M32 56s-20-12.6-28-26C-3.2 17.6 6.1 6 18 10.2c5.1 1.8 8.2 6.6 14 12.4 5.8-5.8 8.9-10.6 14-12.4C57.9 6 67.2 17.6 60 30c-8 13.4-28 26-28 26z'/>\
</svg>") 16 16, auto;
}

#valentinesButton {
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 999px;
  border: none;
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: 18px;
  display: none;
}

#quizOverlay {
  position: fixed;
  inset: 0;
  display: none;
  place-items: center;
  background: rgba(0,0,0,0.6);
}

#quizCard {
  background: rgba(20,20,30,0.9);
  padding: 20px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  color: white;
  text-align: center;
}

.quizBtns {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.quizBtns button {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: none;
  background: rgba(255,255,255,0.2);
  color: white;
  font-size: 16px;
}
</style>
</head>
<body>

<canvas id="starfield"></canvas>
<button id="valentinesButton">Tryck här ❤️</button>

<div id="quizOverlay">
  <div id="quizCard">
    <h2>En liten quiz 💘</h2>
    <p id="quizQuestion"></p>
    <div class="quizBtns">
      <button id="btnYes">Ja</button>
      <button id="btnNo">Nej</button>
    </div>
    <p id="progressText"></p>
  </div>
</div>

<script>
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ===== STARS ===== */
const stars = [];
for (let i = 0; i < 500; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    o: Math.random()
  });
}

function drawStars() {
  for (let s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + s.o + ")";
    ctx.fill();
  }
}

/* ===== TEXT ===== */
let frame = 0;
let opacity = 0;

function drawText() {
  ctx.font = "28px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,100,200," + opacity + ")";
  
  if (frame < 200) {
    ctx.fillText("Sarah…", canvas.width/2, canvas.height/2);
    opacity += 0.01;
  } else if (frame < 400) {
    ctx.fillText("Du har nära till skratt,", canvas.width/2, canvas.height/2);
    opacity -= 0.01;
  } else if (frame < 600) {
    ctx.fillText("och ibland nära till att bli arg…", canvas.width/2, canvas.height/2);
    opacity += 0.01;
  } else {
    ctx.fillText("Jag älskar allt med dig ❤️", canvas.width/2, canvas.height/2);
    document.getElementById("valentinesButton").style.display = "block";
  }
}

/* ===== HEART EXPLOSION ===== */
let hearts = [];

function explode(x, y) {
  for (let i = 0; i < 100; i++) {
    hearts.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1
    });
  }
}

function drawHearts() {
  for (let h of hearts) {
    ctx.fillStyle = "rgba(255,80,170," + h.life + ")";
    ctx.beginPath();
    ctx.arc(h.x, h.y, 4, 0, Math.PI * 2);
    ctx.fill();
    h.x += h.vx;
    h.y += h.vy;
    h.life -= 0.02;
  }
}

/* ===== QUIZ ===== */
const questions = [
  "Älskar Ameen dig?",
  "Älskar Ameen ditt skratt?",
  "Älskar Ameen din lilla arga sida?",
  "Älskar Ameen hur ödmjuk du är?",
  "Älskar Ameen att du älskar små saker?"
];

let q = 0;

function showQuestion() {
  document.getElementById("quizQuestion").textContent = questions[q];
  document.getElementById("progressText").textContent = "Fråga " + (q+1) + "/5";
}

document.getElementById("btnYes").onclick = () => {
  q++;
  if (q >= questions.length) {
    document.getElementById("quizOverlay").style.display = "none";
    explode(canvas.width/2, canvas.height/2);
    alert("Du klarade provet, Sarah 💘");
  } else {
    showQuestion();
  }
};

document.getElementById("btnNo").onclick = () => {
  alert("Du svarade fel 😼");
  q = 0;
  showQuestion();
};

document.getElementById("valentinesButton").onclick = (e) => {
  e.target.textContent = "luv you ❤️";
  explode(canvas.width/2, canvas.height/2);
  document.getElementById("quizOverlay").style.display = "grid";
  showQuestion();
};

/* ===== LOOP ===== */
function loop() {
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
