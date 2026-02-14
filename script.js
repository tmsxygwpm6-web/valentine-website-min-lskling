<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>För Sarah 💘</title>

  <style>
    html, body {
      margin: 0; padding: 0; height: 100%;
      overflow: hidden; background: #000;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }

    /* Canvas fullskärm */
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

    /* Knapp */
    #valentinesButton {
      position: fixed;
      left: 50%;
      bottom: 26px;
      transform: translateX(-50%);
      padding: 12px 18px;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 999px;
      font-size: 18px;
      cursor: inherit;
      display: none;
      color: white;
      background: rgba(255, 255, 255, 0.10);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 40px rgba(0,0,0,0.35);
      transition: transform .2s ease, background .2s ease;
    }
    #valentinesButton:hover { transform: translateX(-50%) scale(1.04); background: rgba(255,255,255,0.14); }
    #valentinesButton:active { transform: translateX(-50%) scale(0.98); }

    /* QUIZ OVERLAY */
    #quizOverlay {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(8px);
      z-index: 50;
      opacity: 1;
      transition: opacity .25s ease;
    }
    #quizOverlay.hidden {
      display: none;
    }

    /* Card + animation */
    #quizCard {
      width: min(560px, 92vw);
      border-radius: 22px;
      padding: 18px 18px 16px;
      background: rgba(10, 10, 18, 0.86);
      color: #fff;
      box-shadow: 0 18px 60px rgba(0,0,0,0.55);
      border: 1px solid rgba(255,255,255,0.14);
      transform: translateY(10px) scale(0.985);
      opacity: 0;
      animation: popIn .35s ease forwards;
    }

    @keyframes popIn {
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    #quizHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
    }

    #quizTitle {
      margin: 0;
      font-size: 18px;
      letter-spacing: 0.2px;
      opacity: 0.95;
    }

    #quizProgressText {
      font-size: 13px;
      opacity: 0.8;
      white-space: nowrap;
    }

    /* progress bar */
    #progressBarWrap {
      height: 10px;
      background: rgba(255,255,255,0.10);
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.10);
      margin: 10px 0 14px;
    }
    #progressBar {
      height: 100%;
      width: 0%;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(255,60,140,0.95), rgba(120,60,255,0.95));
      transition: width .35s ease;
    }

    #quizQuestion {
      margin: 0 0 14px;
      font-size: 18px;
      line-height: 1.35;
      min-height: 52px;
      opacity: 0.98;
      transition: transform .2s ease, opacity .2s ease;
    }

    .quizBtns {
      display: flex;
      gap: 10px;
      margin-top: 6px;
    }

    .quizBtns button {
      flex: 1;
      padding: 12px 14px;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 14px;
      font-size: 16px;
      cursor: inherit;
      color: #fff;
      background: rgba(255,255,255,0.10);
      backdrop-filter: blur(8px);
      transition: transform .18s ease, background .18s ease, border-color .18s ease;
    }
    .quizBtns button:hover { transform: translateY(-1px); background: rgba(255,255,255,0.14); }
    .quizBtns button:active { transform: translateY(1px) scale(0.99); }

    .quizBtns .yes {
      background: rgba(70, 255, 180, 0.16);
      border-color: rgba(70, 255, 180, 0.22);
    }
    .quizBtns .yes:hover { background: rgba(70, 255, 180, 0.22); }

    .quizBtns .no {
      background: rgba(255, 80, 130, 0.16);
      border-color: rgba(255, 80, 130, 0.22);
    }
    .quizBtns .no:hover { background: rgba(255, 80, 130, 0.22); }

    .hint {
      margin: 10px 0 0;
      opacity: 0.82;
      font-size: 13px;
      min-height: 18px;
    }

    /* feedback animations */
    .shake {
      animation: shake .35s ease;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-10px); }
      40% { transform: translateX(10px); }
      60% { transform: translateX(-7px); }
      80% { transform: translateX(7px); }
    }

    .fadeSlideOut {
      opacity: 0;
      transform: translateY(8px);
    }

    /* End message overlay (efter quiz) */
    #endToast {
      position: fixed;
      left: 50%;
      top: 18px;
      transform: translateX(-50%);
      padding: 10px 14px;
      border-radius: 999px;
      z-index: 60;
      color: #fff;
      background: rgba(10, 10, 18, 0.68);
      border: 1px solid rgba(255,255,255,0.14);
      backdrop-filter: blur(10px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.35);
      display: none;
      font-size: 14px;
      opacity: 0;
      transition: opacity .35s ease, transform .35s ease;
    }
    #endToast.show {
      display: block;
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  </style>
</head>
<body>

  <canvas id="starfield"></canvas>
  <button id="valentinesButton">Tryck här ❤️</button>

  <div id="quizOverlay" class="hidden">
    <div id="quizCard">
      <div id="quizHeader">
        <h2 id="quizTitle">En liten kärleks-quiz 💘</h2>
        <div id="quizProgressText">Fråga 1/5</div>
      </div>

      <div id="progressBarWrap">
        <div id="progressBar"></div>
      </div>

      <p id="quizQuestion"></p>

      <div class="quizBtns">
        <button id="btnYes" class="yes">Ja</button>
        <button id="btnNo" class="no">Nej</button>
      </div>

      <p id="quizHint" class="hint"></p>
    </div>
  </div>

  <div id="endToast">Du klarade provet, Sarah 💘</div>

  <script>
    // ===================== CANVAS SETUP =====================
    const canvas = document.getElementById("starfield");
    const context = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ===================== STARS =====================
    const stars = 500;
    const colorrange = [0, 60, 240];
    const starArray = [];

    function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let i = 0; i < stars; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 1.2;
      const hue = colorrange[getRandom(0, colorrange.length - 1)];
      const sat = getRandom(50, 100);
      const opacity = Math.random();
      starArray.push({ x, y, radius, hue, sat, opacity });
    }

    function drawStars() {
      for (let i = 0; i < stars; i++) {
        const star = starArray[i];
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `hsla(${star.hue}, ${star.sat}%, 88%, ${star.opacity})`;
        context.fill();
      }
    }

    function updateStars() {
      for (let i = 0; i < stars; i++) {
        if (Math.random() > 0.99) starArray[i].opacity = Math.random();
      }
    }

    // ===================== BACKGROUND SHIFT + HEART PARTICLES =====================
    let bgShift = 0;   // 0..1
    let bgTarget = 0;
    let hearts = [];

    function lerp(a, b, t) { return a + (b - a) * t; }

    function spawnHeartExplosion(cx, cy, count = 70, big = false) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (big ? 3 : 2) + Math.random() * (big ? 9 : 6);

        hearts.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (2 + Math.random() * 2),
          size: (big ? 18 : 10) + Math.random() * (big ? 26 : 18),
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.35,
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

        if (h.life <= 0 || h.y > canvas.height + 200) hearts.splice(i, 1);
      }
    }

    // ===================== PERSONAL TEXT SEQUENCE =====================
    let frameNumber = 0;
    let opacity = 0;

    function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
      lines.forEach((line, idx) => {
        context.fillText(line, x, y + idx * (fontSize + lineHeight));
      });
    }

    function drawText() {
      const fontSize = Math.min(30, window.innerWidth / 24);
      const lineHeight = 8;

      context.font = `${fontSize}px Comic Sans MS`;
      context.textAlign = "center";

      // glow
      context.shadowColor = "rgba(255, 100, 200, 1)";
      context.shadowBlur = 12;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // 1
      if (frameNumber < 420) {
        context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
        drawTextWithLineBreaks(["Sarah…", "jag vill bara säga en sak till dig."], cx, cy, fontSize, lineHeight);
        opacity += 0.01;
      }
      if (frameNumber >= 420 && frameNumber < 840) {
        context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
        drawTextWithLineBreaks(["Sarah…", "jag vill bara säga en sak till dig."], cx, cy, fontSize, lineHeight);
        opacity -= 0.01;
      }
      if (frameNumber === 840) opacity = 0;

      // 2
      if (frameNumber > 840 && frameNumber < 1260) {
        context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
        drawTextWithLineBreaks(
          ["Du har nära till skratt —", "och ibland nära till att bli arg…", "och jag älskar båda delarna."],
          cx, cy, fontSize, lineHeight
        );
        opacity += 0.01;
      }
      if (frameNumber >= 1260 && frameNumber < 1680) {
        context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
        drawTextWithLineBreaks(
          ["Du har nära till skratt —", "och ibland nära till att bli arg…", "och jag älskar båda delarna."],
          cx, cy, fontSize, lineHeight
        );
        opacity -= 0.01;
      }
      if (frameNumber === 1680) opacity = 0;

      // 3
      if (frameNumber > 1680 && frameNumber < 2100) {
        context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
        drawTextWithLineBreaks(["Du är så ödmjuk.", "Så äkta.", "Och du känner allt så nära."], cx, cy, fontSize, lineHeight);
        opacity += 0.01;
      }
      if (frameNumber >= 2100 && frameNumber < 2520) {
        context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
        drawTextWithLineBreaks(["Du är så ödmjuk.", "Så äkta.", "Och du känner allt så nära."], cx, cy, fontSize, lineHeight);
        opacity -= 0.01;
      }
      if (frameNumber === 2520) opacity = 0;

      // 4
      if (frameNumber > 2520 && frameNumber < 2940) {
        context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
        drawTextWithLineBreaks(
          ["Jag älskar att du älskar små saker.", "Små ögonblick.", "Små detaljer som blir stora med dig."],
          cx, cy, fontSize, lineHeight
        );
        opacity += 0.01;
      }
      if (frameNumber >= 2940 && frameNumber < 3360) {
        context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
        drawTextWithLineBreaks(
          ["Jag älskar att du älskar små saker.", "Små ögonblick.", "Små detaljer som blir stora med dig."],
          cx, cy, fontSize, lineHeight
        );
        opacity -= 0.01;
      }
      if (frameNumber === 3360) opacity = 0;

      // FINAL: stannar kvar + visar knapp
      if (frameNumber > 3360) {
        context.fillStyle = `rgba(255, 100, 200, ${opacity})`;
        drawTextWithLineBreaks(
          ["Jag älskar dig, Sarah.", "På riktigt. På alla sätt.", "Glad Alla Hjärtans Dag ❤️"],
          cx, cy, fontSize, lineHeight
        );
        opacity = Math.min(1, opacity + 0.01);
        valentinesButton.style.display = "block";
      }

      context.shadowBlur = 0;
    }

    // ===================== BUTTON + QUIZ FLOW =====================
    const valentinesButton = document.getElementById("valentinesButton");

    // QUIZ ELEMENTS
    const quizOverlay = document.getElementById("quizOverlay");
    const quizCard = document.getElementById("quizCard");
    const quizQuestion = document.getElementById("quizQuestion");
    const quizHint = document.getElementById("quizHint");
    const quizProgressText = document.getElementById("quizProgressText");
    const progressBar = document.getElementById("progressBar");
    const btnYes = document.getElementById("btnYes");
    const btnNo = document.getElementById("btnNo");
    const endToast = document.getElementById("endToast");

    const questions = [
      "Älskar Ameen dig?",
      "Älskar Ameen att du har nära till skratt?",
      "Älskar Ameen också din lilla “arg”-sida ibland?",
      "Älskar Ameen hur ödmjuk och känslosam du är?",
      "Älskar Ameen att du ser och älskar de små sakerna?"
    ];

    let qIndex = 0;

    function setProgress() {
      const total = questions.length;
      quizProgressText.textContent = `Fråga ${qIndex + 1}/${total}`;
      const pct = ((qIndex) / total) * 100;
      progressBar.style.width = `${pct}%`;
    }

    function openQuiz() {
      qIndex = 0;
      quizHint.textContent = "Svara rätt för att gå vidare 💗";
      quizOverlay.classList.remove("hidden");
      renderQuestion(true);
    }

    function renderQuestion(first = false) {
      const total = questions.length;

      setProgress();

      // liten övergång mellan frågor
      if (!first) {
        quizQuestion.classList.add("fadeSlideOut");
        setTimeout(() => {
          quizQuestion.textContent = questions[qIndex] + " (ja/nej)";
          quizQuestion.classList.remove("fadeSlideOut");
        }, 140);
      } else {
        quizQuestion.textContent = questions[qIndex] + " (ja/nej)";
      }

      // för sista steget kan baren bli full först när man är klar
      if (qIndex === total - 1) {
        progressBar.style.width = `${(qIndex / total) * 100}%`;
      }
    }

    function showToast(text) {
      endToast.textContent = text;
      endToast.classList.add("show");
      setTimeout(() => endToast.classList.remove("show"), 2600);
    }

    function failQuiz() {
      quizHint.textContent = "Nope 😼 du måste svara rätt på alla för att få vinsten.";
      quizCard.classList.remove("shake");
      void quizCard.offsetWidth; // restart animation
      quizCard.classList.add("shake");

      setTimeout(() => {
        const retry = confirm("Du har inte svarat på alla frågor rätt. Vill du göra om provet?");
        if (retry) openQuiz();
        else quizOverlay.classList.add("hidden");
      }, 250);
    }

    function finishQuiz() {
      // fyll progress till 100%
      progressBar.style.width = "100%";

      quizHint.textContent = "Perfekt… då vet du redan sanningen 💘";

      setTimeout(() => {
        quizOverlay.classList.add("hidden");
        showToast("Du klarade provet, Sarah 💘");

        // “Stort hjärta” känsla: fler hjärtan, större, och från mitten
        bgTarget = 1;
        spawnHeartExplosion(canvas.width / 2, canvas.height / 2, 220, true);
      }, 420);
    }

    btnYes.addEventListener("click", () => {
      qIndex++;
      if (qIndex >= questions.length) {
        finishQuiz();
      } else {
        renderQuestion(false);
      }
    });

    btnNo.addEventListener("click", () => {
      failQuiz();
    });

    valentinesButton.addEventListener("click", () => {
      valentinesButton.textContent = "luv you ❤️";

      // bakgrundsskift direkt
      bgTarget = 1;

      // liten hjärt-explosion vid knappen
      const rect = valentinesButton.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      spawnHeartExplosion(cx, cy, 90, false);

      // starta instrument-theme (autoplay kräver click)
      startThemeMusic();

      // starta quiz efter en liten beat
      setTimeout(openQuiz, 650);
    });

    // ===================== SIMPLE INSTRUMENT THEME (WebAudio) =====================
    // Mjuk “space/piano pad + pluck” utan text
    let audioStarted = false;
    let audioCtx, master, padGain, pluckGain;

    let themeTimer = null;
    let themeStep = 0;

    // A-minor-ish (romantiskt & lugnt)
    const scale = [220, 261.63, 293.66, 329.63, 392.0, 440.0]; // A3, C4, D4, E4, G4, A4

    function startThemeMusic() {
      if (audioStarted) return;
      audioStarted = true;

      audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      master = audioCtx.createGain();
      master.gain.value = 0.25;
      master.connect(audioCtx.destination);

      padGain = audioCtx.createGain();
      padGain.gain.value = 0.12;
      padGain.connect(master);

      pluckGain = audioCtx.createGain();
      pluckGain.gain.value = 0.22;
      pluckGain.connect(master);

      startPad();
      themeTimer = setInterval(playThemeStep, 380);
    }

    function startPad() {
      const o1 = audioCtx.createOscillator();
      const o2 = audioCtx.createOscillator();
      o1.type = "sine";
      o2.type = "triangle";
      o1.frequency.value = 220;   // A3
      o2.frequency.value = 110;   // A2

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 700;
      filter.Q.value = 0.8;

      // “andning”
      const lfo = audioCtx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.12;

      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 120;

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      o1.connect(filter);
      o2.connect(filter);
      filter.connect(padGain);

      o1.start();
      o2.start();
      lfo.start();
    }

    function playPluck(freq) {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.22);

      const filter = audioCtx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 120;

      osc.connect(filter);
      filter.connect(g);
      g.connect(pluckGain);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    }

    function playThemeStep() {
      const pattern = [0, 2, 3, 2, 4, 3, 2, 1];
      const idx = pattern[themeStep % pattern.length];
      playPluck(scale[idx]);
      themeStep++;
    }

    // ===================== MAIN LOOP =====================
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
    window.requestAnimationFrame(draw);
  </script>
</body>
</html>
