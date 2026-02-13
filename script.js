// === FULL FÄRDIG VERSION ===
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
var secondOpacity = 0;
var thirdOpacity = 0;

// --- CLICK-EFFEKTER (bakgrund + hjärt-explosion) ---
let bgShift = 0;     // 0..1
let bgTarget = 0;
let hearts = [];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function spawnHeartExplosion(cx, cy, count = 70) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;

    hearts.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (2 + Math.random() * 2),
      size: 10 + Math.random() * 18,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1,
      decay: 0.012 + Math.random() * 0.02
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

  // highlight
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

    h.vy += 0.08; // gravity
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

// --- Knapp ---
const button = document.getElementById("valentinesButton");
button.textContent = "Tryck här ❤️";
button.style.display = "none";

button.addEventListener("click", () => {
  button.textContent = "luv you ❤️";

  // bakgrundsskift
  bgTarget = 1;

  // explosion från knappen (om möjligt), annars mitten
  const rect = button.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // om canvas inte är fullpage i DOM kan coords bli fel, så fallback:
  const x = isFinite(cx) ? cx : canvas.width / 2;
  const y = isFinite(cy) ? cy : canvas.height / 2;

  spawnHeartExplosion(x, y, 80);
});

// --- Text helpers ---
function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * (fontSize + lineHeight));
  });
}

function drawText() {
  var fontSize = Math.min(30, window.innerWidth / 24);
  var lineHeight = 8;

  context.font = fontSize + "px Comic Sans MS";
  context.textAlign = "center";

  // glow
  context.shadowColor = "rgba(255, 100, 200, 1)";
  context.shadowBlur = 12;

  // 1
  if (frameNumber < 400) {
    context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
    drawTextWithLineBreaks(
      ["Jag vill bara säga en sak till dig.", "Och jag vet inte ens om ord riktigt räcker till."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity += 0.01;
  }

  if (frameNumber >= 400 && frameNumber < 800) {
    context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
    drawTextWithLineBreaks(
      ["Jag vill bara säga en sak till dig.", "Och jag vet inte ens om ord riktigt räcker till."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity -= 0.01;
  }

  if (frameNumber == 800) opacity = 0;

  // 2
  if (frameNumber > 800 && frameNumber < 1200) {
    context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
    drawTextWithLineBreaks(
      ["Innan du kom in i mitt liv var allt… bra.", "Men det var inte så här. Inte på samma sätt."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity += 0.01;
  }

  if (frameNumber >= 1200 && frameNumber < 1600) {
    context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
    drawTextWithLineBreaks(
      ["Innan du kom in i mitt liv var allt… bra.", "Men det var inte så här. Inte på samma sätt."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity -= 0.01;
  }

  if (frameNumber == 1600) opacity = 0;

  // 3
  if (frameNumber > 1600 && frameNumber < 2000) {
    context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
    drawTextWithLineBreaks(
      ["Du förändrade inte bara mina dagar —", "du förändrade hur jag upplever dem."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity += 0.01;
  }

  if (frameNumber >= 2000 && frameNumber < 2400) {
    context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
    drawTextWithLineBreaks(
      ["Du förändrade inte bara mina dagar —", "du förändrade hur jag upplever dem."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity -= 0.01;
  }

  if (frameNumber == 2400) opacity = 0;

  // 4
  if (frameNumber > 2400 && frameNumber < 2800) {
    context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
    drawTextWithLineBreaks(
      ["Jag är så otroligt lycklig över att du finns i mitt liv.", "På ett stilla, djupt sätt som känns helt självklart."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity += 0.01;
  }

  if (frameNumber >= 2800 && frameNumber < 3200) {
    context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
    drawTextWithLineBreaks(
      ["Jag är så otroligt lycklig över att du finns i mitt liv.", "På ett stilla, djupt sätt som känns helt självklart."],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity -= 0.01;
  }

  if (frameNumber == 3200) opacity = 0;

  // FINAL (fade in + knapp)
  if (frameNumber > 3200) {
    context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
    drawTextWithLineBreaks(
      ["Jag älskar dig mer än ord kan beskriva.", "Du är min trygghet, min glädje, mitt allt. ❤️", "Glad Alla Hjärtans Dag!"],
      canvas.width / 2,
      canvas.height / 2,
      fontSize,
      lineHeight
    );
    opacity = Math.min(1, opacity + 0.01);

    button.style.display = "block";
  }

  // reset glow
  context.shadowBlur = 0;
}

// --- Loop ---
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();
  updateStars();
  drawText();

  // overlays + particles on top
  drawBackgroundShift();
  updateAndDrawHearts();

  if (frameNumber < 99999) frameNumber++;

  window.requestAnimationFrame(draw);
}

// --- Resize ---
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Start
window.requestAnimationFrame(draw);
