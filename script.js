// === FULL FÄRDIG VERSION (Sarah + hjärt-explosion + bakgrundsskift + längre text + roligare quiz + piano) ===
// Kräver: <canvas id="starfield"></canvas> och <button id="valentinesButton"></button>

var canvas = document.getElementById("starfield");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
var stars = 500;
var colorrange = [0, 60, 240];
var starArray = [];

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Stjärnor ---
for (var i = 0; i < stars; i++) {
  var x = Math.random() * canvas.offsetWidth;
  var y = Math.random() * canvas.offsetHeight;
  var radius = Math.random() * 1.2;
  var hue = colorrange[getRandom(0, colorrange.length - 1)];
  var sat = getRandom(50, 100);
  var opacity = Math.random();
  starArray.push({ x, y, radius, hue, sat, opacity });
}

function drawStars() {
  for (var i = 0; i < stars; i++) {
    var star = starArray[i];
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, 360);
    context.fillStyle = "hsla(" + star.hue + ", " + star.sat + "%, 88%, " + star.opacity + ")";
    context.fill();
  }
}

function updateStars() {
  for (var i = 0; i < stars; i++) {
    if (Math.random() > 0.99) {
      starArray[i].opacity = Math.random();
    }
  }
}

// --- Textsekvens ---
var frameNumber = 0;
var opacity = 0;

// --- CLICK-EFFEKTER (bakgrund + hjärt-explosion) ---
let bgShift = 0; // 0..1
let bgTarget = 0;
let hearts = [];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function spawnHeartExplosion(cx, cy, count = 70, big = false) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (big ? 3 : 2) + Math.random() * (big ? 9 : 6);

    hearts.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (2 + Math.random() * 2),
      size: (big ? 18 : 10) + Math.random() * (big ? 26 : 18),
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * (big ? 0.35 : 0.3),
      life: 1,
      decay: (big ? 0.008 : 0.012) + Math.random() * (big ? 0.015 : 0.02)
    });
  }
}

function drawBackgroundShift() {
  bgShift = lerp(bgShift, bgTarget, 0.03);
  if (bgShift < 0.001) return;

  const g = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0, `rgba(255, 60, 140, ${0.18 * bgShift})`);
  g.addColorStop(1, `rgba(120, 60, 255, ${0.18 * bgShift})`);

  context.fillStyle = g;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHeart(x, y, size, rotation, alpha) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.globalAlpha = alpha;

  const s = size;

  context.beginPath();
  context.moveTo(0, s * 0.3);
  context.bezierCurveTo(0, -s * 0.2, -s, -s * 0.2, -s, s * 0.35);
  context.bezierCurveTo(-s, s, 0, s * 1.15, 0, s * 1.35);
  context.bezierCurveTo(0, s * 1.15, s, s, s, s * 0.35);
  context.bezierCurveTo(s, -s * 0.2, 0, -s * 0.2, 0, s * 0.3);
  context.closePath();

  context.fillStyle = "rgba(255, 80, 170, 1)";
  context.fill();

  context.globalAlpha = alpha * 0.35;
  context.fillStyle = "rgba(255, 255, 255, 1)";
  context.beginPath();
  context.ellipse(-s * 0.25, s * 0.15, s * 0.18, s * 0.12, -0.4, 0, Math.PI * 2);
  context.fill();

  context.restore();
  context.globalAlpha = 1;
}

function updateAndDrawHearts() {
  if (!hearts.length) return;

  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];

    h.vy += 0.08;
    h.x += h.vx;
    h.y += h.vy;
    h.rot += h.vr;
    h.life -= h.decay;

    drawHeart(h.x, h.y, h.size, h.rot, Math.max(0, h.life));

    if (h.life <= 0 || h.y > canvas.height + 200) {
      hearts.splice(i, 1);
    }
  }
}

// ====== ROMANTISK PIANO (WebAudio) ======
let audioStarted = false;
let audioCtx;
let masterGain;
const pianoScale = [220, 261.63, 293.66, 329.63, 392.0, 440.0];
let pianoStep = 0;

function startPiano() {
  if (audioStarted) return;
  audioStarted = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.22;
  masterGain.connect(audioCtx.destination);

  setInterval(playPianoNote, 420);
}

function playPianoNote() {
  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = pianoScale[pianoStep % pianoScale.length];

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);

  pianoStep++;
}

// --- QUIZ (auto-HTML/CSS) ---
(function setupQuizUI() {
  const css = `
    .quizOverlay{position:fixed;inset:0;display:none;place-items:center;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);z-index:9999;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
    .quizCard{width:min(560px,92vw);border-radius:22px;padding:18px 18px 16px;background:rgba(10,10,18,.86);color:#fff;box-shadow:0 18px 60px rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.14);transform:translateY(10px) scale(.985);opacity:0;animation:quizPopIn .35s ease forwards}
    @keyframes quizPopIn{to{transform:translateY(0) scale(1);opacity:1}}
    .quizHeader{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
    .quizTitle{margin:0;font-size:18px;opacity:.95}
    .quizProgressText{font-size:13px;opacity:.8;white-space:nowrap}
    .progressBarWrap{height:10px;background:rgba(255,255,255,.10);border-radius:999px;overflow:hidden;border:1px solid rgba(255,255,255,.10);margin:10px 0 14px}
    .progressBar{height:100%;width:0%;border-radius:999px;background:linear-gradient(90deg,rgba(255,60,140,.95),rgba(120,60,255,.95));transition:width .35s ease}
    .quizQuestion{margin:0 0 14px;font-size:18px;line-height:1.35;min-height:52px}
    .quizBtns{display:flex;gap:10px;margin-top:6px}
    .quizBtn{flex:1;padding:12px 14px;border:1px solid rgba(255,255,255,.14);border-radius:14px;font-size:16px;color:#fff;background:rgba(255,255,255,.10);cursor:pointer;transition:transform .18s ease,background .18s ease,border-color .18s ease}
    .quizBtn:hover{transform:translateY(-1px);background:rgba(255,255,255,.14)}
    .quizBtn:active{transform:translateY(1px) scale(.99)}
    .quizBtn.yes{background:rgba(70,255,180,.16);border-color:rgba(70,255,180,.22)}
    .quizBtn.no{background:rgba(255,80,130,.16);border-color:rgba(255,80,130,.22)}
    .hint{margin:10px 0 0;opacity:.82;font-size:13px;min-height:18px}
    .shake{animation:quizShake .35s ease}
    @keyframes quizShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-7px)}80%{transform:translateX(7px)}}
    .fadeOut{opacity:0;transform:translateY(8px);transition:opacity .14s ease,transform .14s ease}
    .toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);padding:10px 14px;border-radius:999px;z-index:10000;color:#fff;background:rgba(10,10,18,.68);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(10px);box-shadow:0 12px 40px rgba(0,0,0,.35);display:none;font-size:14px;opacity:0;transition:opacity .35s ease}
    .toast.show{display:block;opacity:1}
    .retryRow{display:flex;gap:10px;margin-top:10px}
    .smallBtn{flex:1;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.10);color:#fff;cursor:pointer}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.className = "quizOverlay";
  overlay.id = "quizOverlay";
  overlay.innerHTML = `
    <div class="quizCard" id="quizCard">
      <div class="quizHeader">
        <h2 class="quizTitle">En liten kärleks-quiz 💘</h2>
        <div class="quizProgressText" id="quizProgressText">Fråga 1/5</div>
      </div>
      <div class="progressBarWrap"><div class="progressBar" id="progressBar"></div></div>
      <p class="quizQuestion" id="quizQuestion"></p>
      <div class="quizBtns">
        <button class="quizBtn yes" id="quizYes">Ja</button>
        <button class="quizBtn no" id="quizNo">Nej</button>
      </div>
      <p class="hint" id="quizHint"></p>
      <div id="retryArea" style="display:none;">
        <div class="retryRow">
          <button class="smallBtn" id="retryBtn">Gör om</button>
          <button class="smallBtn" id="closeBtn">Stäng</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.id = "quizToast";
  toast.textContent = "Du klarade provet, Sarah 💘";
  document.body.appendChild(toast);
})();

const quiz = {
  overlay: document.getElementById("quizOverlay"),
  card: document.getElementById("quizCard"),
  qText: document.getElementById("quizQuestion"),
  hint: document.getElementById("quizHint"),
  progressText: document.getElementById("quizProgressText"),
  progressBar: document.getElementById("progressBar"),
  yes: document.getElementById("quizYes"),
  no: document.getElementById("quizNo"),
  toast: document.getElementById("quizToast"),
  retryArea: document.getElementById("retryArea"),
  retryBtn: document.getElementById("retryBtn"),
  closeBtn: document.getElementById("closeBtn")
};

// Roligare frågor 😈💘
const questions = [
  "Okej viktig fråga… älskar Ameen dig mer än pizza, sömn och livet självt? 😌",
  "Tycker Ameen att ditt skratt är farligt gulligt och borde klassas som hjärtattack-varning? 💓",
  "När du blir lite arg… tycker Ameen ändå att du är världens sötaste människa? 😏",
  "Är Sarah officiellt den mest ödmjuka och känslosamma personen Ameen någonsin träffat? 🥹",
  "Sista frågan… är Sarah Ameens favoritperson i hela universum? 🌌❤️"
];

let qIndex = 0;

function showToast(text) {
  quiz.toast.textContent = text;
  quiz.toast.classList.add("show");
  setTimeout(() => quiz.toast.classList.remove("show"), 2600);
}

function setProgress() {
  const total = questions.length;
  quiz.progressText.textContent = `Fråga ${qIndex + 1}/${total}`;
  quiz.progressBar.style.width = `${(qIndex / total) * 100}%`;
}

function renderQuestion(first = false) {
  setProgress();
  quiz.retryArea.style.display = "none";
  quiz.yes.style.display = "";
  quiz.no.style.display = "";
  quiz.hint.textContent = "Svara Ja för att gå vidare 💗";

  if (!first) {
    quiz.qText.classList.add("fadeOut");
    setTimeout(() => {
      quiz.qText.textContent = questions[qIndex] + " (ja/nej)";
      quiz.qText.classList.remove("fadeOut");
    }, 140);
  } else {
    quiz.qText.textContent = questions[qIndex] + " (ja/nej)";
  }
}

function openQuiz() {
  qIndex = 0;
  quiz.overlay.style.display = "grid";
  renderQuestion(true);
}

function failQuiz() {
  quiz.hint.textContent = "Du har inte svarat på alla frågor rätt. Vill du göra om provet?";
  quiz.card.classList.remove("shake");
  void quiz.card.offsetWidth;
  quiz.card.classList.add("shake");

  quiz.yes.style.display = "none";
  quiz.no.style.display = "none";
  quiz.retryArea.style.display = "block";
}

function finishQuiz() {
  quiz.progressBar.style.width = "100%";
  quiz.hint.textContent = "Perfekt… då vet du redan sanningen 💘";

  setTimeout(() => {
    quiz.overlay.style.display = "none";
    showToast("Du klarade provet, Sarah 💘");
    bgTarget = 1;
    spawnHeartExplosion(canvas.width / 2, canvas.height / 2, 260, true);
  }, 420);
}

quiz.yes.addEventListener("click", () => {
  qIndex++;
  if (qIndex >= questions.length) finishQuiz();
  else renderQuestion(false);
});

quiz.no.addEventListener("click", () => {
  failQuiz();
});

quiz.retryBtn.addEventListener("click", () => {
  openQuiz();
});

quiz.closeBtn.addEventListener("click", () => {
  quiz.overlay.style.display = "none";
});

// --- Knapp click: hjärt-explosion + piano + quiz ---
button.addEventListener("click", () => {
  button.textContent = "luv you ❤️";
  startPiano();

  bgTarget = 1;

  const rect = button.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const x = isFinite(cx) ? cx : canvas.width / 2;
  const y = isFinite(cy) ? cy : canvas.height / 2;

  spawnHeartExplosion(x, y, 80);

  setTimeout(openQuiz, 650);
});

// --- Text helpers ---
function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * (fontSize + lineHeight));
  });
}

// === LÄNGRE KÄRLEKSFÖRKLARING (Sarah) ===
function drawText() {
  var fontSize = Math.min(30, window.innerWidth / 24);
  var lineHeight = 8;

  context.font = fontSize + "px Comic Sans MS";
  context.textAlign = "center";
  context.shadowColor = "rgba(255, 100, 200, 1)";
  context.shadowBlur = 12;

  // 1
  if (frameNumber < 400) {
    context.fillStyle = `rgba(255,100,200,${opacity})`;
    drawTextWithLineBreaks(
      ["Sarah…", "ibland stannar jag upp och tänker på hur lycklig jag är."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity += 0.01;
  }
  if (frameNumber >= 400 && frameNumber < 800) {
    context.fillStyle = `rgba(255,100,200,${opacity})`;
    drawTextWithLineBreaks(
      ["Sarah…", "ibland stannar jag upp och tänker på hur lycklig jag är."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity -= 0.01;
  }
  if (frameNumber == 800) opacity = 0;

  // 2
  if (frameNumber > 800 && frameNumber < 1400) {
    context.fillStyle = `rgba(255,100,200,${opacity})`;
    drawTextWithLineBreaks(
      ["Du har det där skrattet som kan förändra en hel dag.",
       "Och ja… du kan bli arg ibland.",
       "Men till och med det är en del av det jag älskar."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity += 0.01;
  }
  if (frameNumber >= 1400 && frameNumber < 2000) {
    context.fillStyle = `rgba(255,100,200,${opacity})`;
    drawTextWithLineBreaks(
      ["Du har det där skrattet som kan förändra en hel dag.",
       "Och ja… du kan bli arg ibland.",
       "Men till och med det är en del av det jag älskar."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity -= 0.01;
  }
  if (frameNumber == 2000) opacity = 0;

  // 3
  if (frameNumber > 2000 && frameNumber < 2600) {
    context.fillStyle = `rgba(255,100,200,${opacity})`;
    drawTextWithLineBreaks(
      ["Du känner saker på riktigt.",
       "Du är ödmjuk.",
       "Du bryr dig om små detaljer som andra missar.",
       "Och det gör dig så otroligt speciell."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity += 0.01;
  }
  if (frameNumber >= 2600 && frameNumber < 3200) {
    context.fillStyle = `rgba(255,100,200,${opacity})`;
    drawTextWithLineBreaks(
      ["Du känner saker på riktigt.",
       "Du är ödmjuk.",
       "Du bryr dig om små detaljer som andra missar.",
       "Och det gör dig så otroligt speciell."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity -= 0.01;
  }
  if (frameNumber == 3200) opacity = 0;

  // 4
  if (frameNumber > 3200 && frameNumber < 3800) {
    context.fillStyle = `rgba(255,100,200,${opacity})`;
    drawTextWithLineBreaks(
      ["När jag säger att jag älskar dig,",
       "så menar jag allt med dig.",
       "Ditt skratt.",
       "Din känslighet.",
       "Din styrka.",
       "Dina små saker som bara är du."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity += 0.01;
  }
  if (frameNumber >= 3800 && frameNumber < 4400) {
    context.fillStyle = `rgba(255,100,200,${opacity})`;
    drawTextWithLineBreaks(
      ["När jag säger att jag älskar dig,",
       "så menar jag allt med dig.",
       "Ditt skratt.",
       "Din känslighet.",
       "Din styrka.",
       "Dina små saker som bara är du."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity -= 0.01;
  }
  if (frameNumber == 4400) opacity = 0;

  // FINAL
  if (frameNumber > 4400) {
    context.fillStyle = `rgba(255,100,200,${opacity})`;
    drawTextWithLineBreaks(
      ["Jag älskar dig, Sarah.",
       "Inte bara för den du är.",
       "Utan för hur du får mig att känna.",
       "Du är mitt lugn.",
       "Min glädje.",
       "Mitt hjärta. ❤️"],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity = Math.min(1, opacity + 0.01);
    button.style.display = "block";
  }

  context.shadowBlur = 0;
}

// --- Loop ---
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();
  updateStars();
  drawText();

  drawBackgroundShift();
  updateAndDrawHearts();

  frameNumber++;
  window.requestAnimationFrame(draw);
}

// --- Resize ---
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Start
window.requestAnimationFrame(draw);
