<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>För Sarah 💘</title>
<style>
  :root{
    --glass: rgba(255,255,255,0.10);
    --glass2: rgba(255,255,255,0.14);
    --card: rgba(10,10,18,0.86);
    --shadow: rgba(0,0,0,0.55);
  }
  html,body{
    margin:0; padding:0; height:100%;
    overflow:hidden; background:#000;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  }
  #starfield{position:fixed; inset:0; width:100vw; height:100vh; display:block;}

  /* Heart cursor */
  body, button{
    cursor: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 64 64'>\
<path fill='%23ff4da6' d='M32 56s-20-12.6-28-26C-3.2 17.6 6.1 6 18 10.2c5.1 1.8 8.2 6.6 14 12.4 5.8-5.8 8.9-10.6 14-12.4C57.9 6 67.2 17.6 60 30c-8 13.4-28 26-28 26z'/>\
</svg>") 16 16, auto;
  }

  #valentinesButton{
    position:fixed; left:50%; bottom:26px; transform:translateX(-50%);
    padding:12px 18px;
    border:1px solid rgba(255,255,255,0.14);
    border-radius:999px;
    font-size:18px;
    color:#fff;
    background: var(--glass);
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.35);
    display:none;
    cursor: inherit;
    transition: transform .2s ease, background .2s ease;
    z-index: 5;
  }
  #valentinesButton:hover{ transform:translateX(-50%) scale(1.04); background: var(--glass2); }
  #valentinesButton:active{ transform:translateX(-50%) scale(0.98); }

  /* Quiz overlay */
  #quizOverlay{
    position:fixed; inset:0;
    display:none;
    place-items:center;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(10px);
    z-index: 20;
  }
  #quizCard{
    width:min(620px, 92vw);
    border-radius: 24px;
    padding: 18px 18px 16px;
    background: var(--card);
    color:#fff;
    box-shadow: 0 18px 70px var(--shadow);
    border: 1px solid rgba(255,255,255,0.14);
    transform: translateY(10px) scale(0.985);
    opacity: 0;
    animation: popIn .35s ease forwards;
  }
  @keyframes popIn{ to { transform: translateY(0) scale(1); opacity:1; } }

  #quizHeader{
    display:flex; align-items:center; justify-content:space-between;
    gap: 12px; margin-bottom: 10px;
  }
  #quizTitle{ margin:0; font-size: 18px; opacity:.95; letter-spacing:.2px; }
  #quizProgressText{ font-size: 13px; opacity:.8; white-space:nowrap; }

  /* Progress bar */
  #progressBarWrap{
    height: 10px;
    background: rgba(255,255,255,0.10);
    border-radius: 999px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.10);
    margin: 10px 0 14px;
  }
  #progressBar{
    height:100%;
    width:0%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,60,140,0.98), rgba(120,60,255,0.98));
    transition: width .45s cubic-bezier(.2,.9,.2,1);
    position: relative;
  }
  /* “sparkle” sheen */
  #progressBar::after{
    content:"";
    position:absolute; inset:-20px -60px -20px -60px;
    background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.35) 45%, transparent 70%);
    transform: translateX(-40%);
    animation: sheen 1.35s ease-in-out infinite;
    opacity: .55;
  }
  @keyframes sheen{
    0%{ transform: translateX(-60%); opacity:.0; }
    20%{ opacity:.55; }
    100%{ transform: translateX(60%); opacity:.0; }
  }

  #quizQuestion{
    margin: 0 0 14px;
    font-size: 18px;
    line-height: 1.35;
    min-height: 64px;
    opacity: .98;
    transition: opacity .18s ease, transform .18s ease;
  }
  .fadeSlideOut{ opacity:0; transform: translateY(8px); }

  .quizBtns{ display:flex; gap:10px; margin-top: 6px; }
  .quizBtns button{
    flex:1;
    padding:12px 14px;
    border-radius: 14px;
    border:1px solid rgba(255,255,255,0.14);
    font-size: 16px;
    color:#fff;
    background: rgba(255,255,255,0.10);
    cursor: inherit;
    transition: transform .18s ease, background .18s ease, border-color .18s ease;
  }
  .quizBtns button:hover{ transform: translateY(-1px); background: rgba(255,255,255,0.14); }
  .quizBtns button:active{ transform: translateY(1px) scale(0.99); }

  .quizBtns .yes{
    background: rgba(70,255,180,0.16);
    border-color: rgba(70,255,180,0.22);
  }
  .quizBtns .no{
    background: rgba(255,80,130,0.16);
    border-color: rgba(255,80,130,0.22);
  }

  #quizHint{ margin: 10px 0 0; opacity:.82; font-size: 13px; min-height: 18px; }

  .shake{ animation: shake .35s ease; }
  @keyframes shake{
    0%,100%{ transform: translateX(0); }
    20%{ transform: translateX(-10px); }
    40%{ transform: translateX(10px); }
    60%{ transform: translateX(-7px); }
    80%{ transform: translateX(7px); }
  }

  /* Cinematic end text */
  #centerMessage{
    position: fixed;
    left:50%; top:50%;
    transform: translate(-50%, -50%) scale(0.96);
    color:#fff;
    text-align:center;
    z-index: 15;
    display:none;
    opacity:0;
    transition: opacity .35s ease, transform .35s ease;
    pointer-events:none;
    text-shadow: 0 10px 60px rgba(0,0,0,0.6);
  }
  #centerMessage.show{
    display:block;
    opacity:1;
    transform: translate(-50%, -50%) scale(1);
  }
  #centerMessage .big{
    font-size: min(56px, 9vw);
    letter-spacing: .3px;
    margin: 0 0 10px;
  }
  #centerMessage .sub{
    font-size: min(18px, 4.2vw);
    opacity: .88;
    margin: 0;
  }

  /* subtle top toast (optional) */
  #topToast{
    position: fixed;
    left: 50%;
    top: 18px;
    transform: translateX(-50%);
    padding: 10px 14px;
    border-radius: 999px;
    color:#fff;
    background: rgba(10,10,18,0.68);
    border: 1px solid rgba(255,255,255,0.14);
    backdrop-filter: blur(10px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.35);
    display:none;
    opacity:0;
    transition: opacity .35s ease;
    z-index: 25;
    font-size: 14px;
  }
  #topToast.show{ display:block; opacity:1; }
</style>
</head>
<body>

<canvas id="starfield"></canvas>
<button id="valentinesButton">Tryck här ❤️</button>

<div id="quizOverlay">
  <div id="quizCard">
    <div id="quizHeader">
      <h2 id="quizTitle">En liten kärleks-quiz 💘</h2>
      <div id="quizProgressText">Fråga 1/5</div>
    </div>

    <div id="progressBarWrap"><div id="progressBar"></div></div>

    <p id="quizQuestion"></p>
    <div class="quizBtns">
      <button class="yes" id="btnYes">Ja</button>
      <button class="no"  id="btnNo">Nej</button>
    </div>
    <p id="quizHint"></p>
  </div>
</div>

<div id="topToast">Du klarade provet, Sarah 💘</div>

<div id="centerMessage">
  <h1 class="big">Du klarade provet, Sarah 💘</h1>
  <p class="sub">Okej… nu är det officiellt: du är min favorit i hela universum.</p>
</div>

<script>
/* ===================== CANVAS SETUP ===================== */
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
  canvas.width = window.innerWidth || 800;
  canvas.height = window.innerHeight || 600;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  initStars();
});

/* ===================== STARS ===================== */
const starsCount = 520;
let stars = [];

function initStars(){
  stars = [];
  for(let i=0;i<starsCount;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.35 + 0.1,
      o: Math.random(),
      tw: Math.random()*0.02 + 0.005
    });
  }
}
initStars();

function drawStars(){
  for(const s of stars){
    // tiny twinkle
    s.o += (Math.random()-0.5)*s.tw;
    if(s.o < 0.1) s.o = 0.1;
    if(s.o > 1) s.o = 1;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${s.o})`;
    ctx.fill();
  }
}

/* ===================== CINEMATIC BACKGROUND SHIFT + VIGNETTE ===================== */
let bgShift = 0; // 0..1
let bgTarget = 0;

function lerp(a,b,t){ return a + (b-a)*t; }

function drawCinematicOverlay(){
  bgShift = lerp(bgShift, bgTarget, 0.03);

  // soft gradient wash (only when target > 0)
  if(bgShift > 0.001){
    const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    g.addColorStop(0, `rgba(255,60,140,${0.20*bgShift})`);
    g.addColorStop(1, `rgba(120,60,255,${0.20*bgShift})`);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // vignette
  const rg = ctx.createRadialGradient(
    canvas.width/2, canvas.height/2, Math.min(canvas.width,canvas.height)*0.15,
    canvas.width/2, canvas.height/2, Math.max(canvas.width,canvas.height)*0.72
  );
  rg.addColorStop(0, "rgba(0,0,0,0)");
  rg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = rg;
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

/* ===================== REALISTIC HEART PARTICLES ===================== */
let hearts = [];

// map color variation a bit
function heartColor(){
  // subtle variation around pink/magenta
  const r = 255;
  const g = 60 + Math.floor(Math.random()*60);
  const b = 140 + Math.floor(Math.random()*90);
  return `rgb(${r},${g},${b})`;
}

function spawnHeartExplosion(cx, cy, count=80, big=false){
  const n = big ? Math.max(count, 240) : count;
  for(let i=0;i<n;i++){
    const angle = Math.random()*Math.PI*2;
    const baseSpeed = big ? 3.2 : 2.2;
    const speed = baseSpeed + Math.random()*(big ? 10 : 6);

    hearts.push({
      x: cx, y: cy,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed - (2 + Math.random()*2),
      size: (big ? 16 : 9) + Math.random()*(big ? 26 : 18),
      rot: Math.random()*Math.PI*2,
      vr: (Math.random()-0.5)*(big ? 0.45 : 0.35),
      life: 1,
      decay: (big ? 0.006 : 0.010) + Math.random()*(big ? 0.010 : 0.018),
      color: heartColor(),
      wobble: Math.random()*0.12 + 0.04
    });
  }
}

function drawHeartShape(x, y, size, rotation, alpha, color){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;

  const s = size;

  ctx.beginPath();
  ctx.moveTo(0, s*0.35);
  ctx.bezierCurveTo(0, -s*0.2, -s, -s*0.2, -s, s*0.35);
  ctx.bezierCurveTo(-s, s, 0, s*1.12, 0, s*1.35);
  ctx.bezierCurveTo(0, s*1.12, s, s, s, s*0.35);
  ctx.bezierCurveTo(s, -s*0.2, 0, -s*0.2, 0, s*0.35);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  // glossy highlight
  ctx.globalAlpha = alpha*0.28;
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.beginPath();
  ctx.ellipse(-s*0.22, s*0.18, s*0.18, s*0.12, -0.35, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
  ctx.globalAlpha = 1;
}

function updateAndDrawHearts(){
  if(!hearts.length) return;

  const drag = 0.985;       // air resistance
  const gravity = 0.085;    // gravity
  for(let i=hearts.length-1; i>=0; i--){
    const h = hearts[i];

    // physics
    h.vx *= drag;
    h.vy = h.vy*drag + gravity;

    // gentle “wobble”
    h.vx += Math.sin((h.life*20) + h.rot)*h.wobble * 0.3;

    h.x += h.vx;
    h.y += h.vy;
    h.rot += h.vr;

    h.life -= h.decay;

    const a = Math.max(0, h.life);
    drawHeartShape(h.x, h.y, h.size, h.rot, a, h.color);

    if(h.life <= 0 || h.y > canvas.height + 250) hearts.splice(i,1);
  }
}

/* ===================== ROMANTISK PIANO (WebAudio) ===================== */
let audioStarted = false;
let audioCtx, masterGain, pianoTimer = null;
let pianoStep = 0;

// soft, romantic progression-ish
const scale = [220, 261.63, 293.66, 329.63, 392.0, 440.0]; // A3 C4 D4 E4 G4 A4
const pattern = [0,2,3,2,4,3,2,1, 0,2,3,4,3,2,1,0];

function startPiano(){
  if(audioStarted) return;
  audioStarted = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.20;
  masterGain.connect(audioCtx.destination);

  // start gentle pad-like base
  startPad();

  pianoTimer = setInterval(playPianoStep, 380);
}

function startPad(){
  const o1 = audioCtx.createOscillator();
  const o2 = audioCtx.createOscillator();
  o1.type = "sine";
  o2.type = "triangle";
  o1.frequency.value = 220;
  o2.frequency.value = 110;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 650;
  filter.Q.value = 0.8;

  const g = audioCtx.createGain();
  g.gain.value = 0.09;

  // slow “breath”
  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.11;

  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 120;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  o1.connect(filter);
  o2.connect(filter);
  filter.connect(g);
  g.connect(masterGain);

  o1.start(); o2.start(); lfo.start();
}

function playPluck(freq){
  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;

  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.24, audioCtx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.22);

  const hp = audioCtx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 120;

  osc.connect(hp);
  hp.connect(g);
  g.connect(masterGain);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.25);
}

function playPianoStep(){
  const idx = pattern[pianoStep % pattern.length];
  playPluck(scale[idx]);
  pianoStep++;
}

/* ===================== LOVE TEXT SEQUENCE (lekfull + längre) ===================== */
const button = document.getElementById("valentinesButton");
button.textContent = "Tryck här ❤️";

let frameNumber = 0;
let textOpacity = 0;

function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight){
  lines.forEach((line, i) => ctx.fillText(line, x, y + i*(fontSize + lineHeight)));
}

function drawLoveText(){
  const fontSize = Math.min(30, window.innerWidth / 24);
  const lineHeight = 8;

  ctx.font = `${fontSize}px Comic Sans MS`;
  ctx.textAlign = "center";

  // glow
  ctx.shadowColor = "rgba(255, 100, 200, 1)";
  ctx.shadowBlur = 12;

  const cx = canvas.width/2;
  const cy = canvas.height/2;

  // Each block is 520 frames (fade in 260, fade out 260), last block stays.
  function block(start, lines){
    const t = frameNumber - start;
    if(t < 0) return false;

    // fade in
    if(t >= 0 && t < 260){
      ctx.fillStyle = `rgba(255,100,200,${textOpacity})`;
      drawTextWithLineBreaks(lines, cx, cy, fontSize, lineHeight);
      textOpacity = Math.min(1, textOpacity + 0.01);
      return true;
    }
    // fade out
    if(t >= 260 && t < 520){
      ctx.fillStyle = `rgba(255,100,200,${textOpacity})`;
      drawTextWithLineBreaks(lines, cx, cy, fontSize, lineHeight);
      textOpacity = Math.max(0, textOpacity - 0.01);
      return true;
    }
    // reset at end
    if(t === 520) textOpacity = 0;
    return false;
  }

  // sequence (longer + playful)
  if(block(0, [
    "Sarah…",
    "ibland stannar jag upp och tänker:",
    "hur blev jag ens så här lyckligt lottad?"
  ])) { ctx.shadowBlur = 0; return; }

  if(block(520, [
    "Det finns människor som lyser upp ett rum.",
    "Du? Du lyser upp hela min dag.",
    "Och det är typ… lite orättvist mot resten av världen 😅"
  ])) { ctx.shadowBlur = 0; return; }

  if(block(1040, [
    "Ditt skratt är min favoritgrej.",
    "Det är som en knapp som direkt gör allt bättre.",
    "Jag blir automatiskt glad. Varje gång. 😂✨"
  ])) { ctx.shadowBlur = 0; return; }

  if(block(1560, [
    "Och ja… du kan bli arg ibland.",
    "Men även då är du fortfarande du.",
    "Och det betyder att jag fortfarande älskar dig (nästan mer) 😏❤️"
  ])) { ctx.shadowBlur = 0; return; }

  if(block(2080, [
    "Du känner saker på riktigt.",
    "Du är ödmjuk, varm och så himla äkta.",
    "Du får små saker att kännas stora."
  ])) { ctx.shadowBlur = 0; return; }

  if(block(2600, [
    "Jag älskar hur du älskar.",
    "Hur du ser detaljer, ögonblick, små gester.",
    "Som om du samlar på fina saker i hjärtat."
  ])) { ctx.shadowBlur = 0; return; }

  if(block(3120, [
    "När jag säger att jag älskar dig",
    "så menar jag: jag väljer dig.",
    "I skrattet. I känslorna. I allt.",
    "Om och om igen."
  ])) { ctx.shadowBlur = 0; return; }

  // FINAL (stays)
  ctx.fillStyle = `rgba(255,100,200,${textOpacity})`;
  drawTextWithLineBreaks([
    "Jag älskar dig, Sarah.",
    "Du är mitt lugn, min glädje och min favoritperson.",
    "Tryck på knappen… jag har en liten lek till dig 💘"
  ], cx, cy, fontSize, lineHeight);

  textOpacity = Math.min(1, textOpacity + 0.01);
  button.style.display = "block";

  ctx.shadowBlur = 0;
}

/* ===================== QUIZ (SNYGGARE + PROGRESS ANIM) ===================== */
const quizOverlay = document.getElementById("quizOverlay");
const quizCard = document.getElementById("quizCard");
const quizQuestion = document.getElementById("quizQuestion");
const quizHint = document.getElementById("quizHint");
const quizProgressText = document.getElementById("quizProgressText");
const progressBar = document.getElementById("progressBar");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const topToast = document.getElementById("topToast");
const centerMessage = document.getElementById("centerMessage");

const questions = [
  "Okej Sarah… viktigaste frågan först: är Ameen helt galet kär i dig? 😌💘",
  "Är ditt skratt typ Ameens favorit-ljud i hela världen (och lite beroendeframkallande)? 😂✨",
  "När du blir lite arg… tycker Ameen ändå att du är söt (och försöker hålla sig för skratt)? 😭❤️",
  "Är du den ödmjukaste, finaste och mest känslosamma människan Ameen känner? 🥹🌷",
  "Sista boss-frågan: är du Ameens favoritperson i hela universum, multiversum och allt däremellan? 🌌💞"
];

let qIndex = 0;

function setProgress(){
  const total = questions.length;
  quizProgressText.textContent = `Fråga ${qIndex+1}/${total}`;
  const pct = (qIndex / total) * 100;
  progressBar.style.width = `${pct}%`;
}

function renderQuestion(first=false){
  setProgress();
  quizHint.textContent = "Svara rätt för att gå vidare 💗";

  if(!first){
    quizQuestion.classList.add("fadeSlideOut");
    setTimeout(() => {
      quizQuestion.textContent = questions[qIndex] + " (ja/nej)";
      quizQuestion.classList.remove("fadeSlideOut");
    }, 160);
  } else {
    quizQuestion.textContent = questions[qIndex] + " (ja/nej)";
  }
}

function openQuiz(){
  qIndex = 0;
  quizOverlay.style.display = "grid";
  // reset progress animation
  progressBar.style.width = "0%";
  // force reflow
  void progressBar.offsetWidth;
  renderQuestion(true);
}

function failQuiz(){
  quizHint.textContent = "Ehh… det där kändes som ett fusk-svar 😼 Gör om!";
  quizCard.classList.remove("shake");
  void quizCard.offsetWidth;
  quizCard.classList.add("shake");
  // reset to first question after a tiny beat
  setTimeout(() => {
    qIndex = 0;
    renderQuestion(true);
  }, 350);
}

function showTopToast(text){
  topToast.textContent = text;
  topToast.classList.add("show");
  setTimeout(() => topToast.classList.remove("show"), 2200);
}

function finishQuiz(){
  progressBar.style.width = "100%";
  quizHint.textContent = "Perfekt… då vet du redan sanningen 💘";
  setTimeout(() => {
    quizOverlay.style.display = "none";

    // big center message (instead of alert)
    centerMessage.classList.add("show");
    setTimeout(() => centerMessage.classList.remove("show"), 4200);

    showTopToast("Du klarade provet, Sarah 💘");

    // cinematic: stronger background + huge heart explosion
    bgTarget = 1;
    spawnHeartExplosion(canvas.width/2, canvas.height/2, 280, true);
  }, 520);
}

btnYes.addEventListener("click", () => {
  qIndex++;
  if(qIndex >= questions.length){
    finishQuiz();
  } else {
    renderQuestion(false);
  }
});

btnNo.addEventListener("click", failQuiz);

/* ===================== BUTTON CLICK: MUSIC + FX + QUIZ ===================== */
button.addEventListener("click", () => {
  button.textContent = "luv you ❤️";
  startPiano();

  bgTarget = 1;

  const rect = button.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;

  const x = isFinite(cx) ? cx : canvas.width/2;
  const y = isFinite(cy) ? cy : canvas.height/2;

  spawnHeartExplosion(x, y, 95, false);

  setTimeout(openQuiz, 650);
});

/* ===================== MAIN LOOP ===================== */
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawStars();
  drawLoveText();

  drawCinematicOverlay();
  updateAndDrawHearts();

  frameNumber++;
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
</script>
</body>
</html>
