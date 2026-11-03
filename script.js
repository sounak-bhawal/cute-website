// Question flow dataset with cute Pochacco-themed romance & bribes
const questions = [
  {
    step: "Peace Treaty • Step 1",
    emoji: "🥺🐾",
    question: "Are you still super mad at your favorite person in the entire universe?",
    sub: "(Don't look at me with that cute pouty face, it's illegal to be this adorable when grumpy)",
    yesBtn: "Maybe a little... 💚",
    noBtn: "Still furious! 😤"
  },
  {
    step: "Peace Treaty • Step 2",
    emoji: "👉👈",
    question: "Okay okay, you have valid reasons... but do I still get points for being cute and obsessed with you?",
    sub: "My defense attorney: 'Your honor, my client loves her to bits.'",
    yesBtn: "Yes, you're cute 🐶",
    noBtn: "Zero points! 🙅‍♀️"
  },
  {
    step: "Peace Treaty • Step 3",
    emoji: "🍫🧋",
    question: "Will you accept a peace bribe of unlimited cuddles, snacks, and your favorite momos right now?",
    sub: "I will literally order or make anything you crave. No limits today!",
    yesBtn: "Bribe accepted! 🤤",
    noBtn: "I cannot be bought! 🚫"
  },
  {
    step: "Peace Treaty • Step 4",
    emoji: "💆‍♂️🫦",
    question: "What if I throw in a lifetime subscription to forehead & neck kisses?",
    sub: "Plus I promise not to annoy you for at least the next 3 hours (terms & conditions apply 😜)",
    yesBtn: "Deal! 💋",
    noBtn: "No way! 🙈"
  },
  {
    step: "Final Chapter",
    emoji: "🧸💚",
    question: "Can we please stop fighting now and just be cute, cozy, and clingy again? I miss my girl.",
    sub: "You are my favorite human and my whole heart. Come here! 🐾",
    yesBtn: "YES! Come here right now! 🐶💚",
    noBtn: "Still No! 😜"
  }
];

// Tease messages when trying to hover the No button
const teaseMessages = [
  "Nice try! Can't click that! 😜",
  "Pochacco says: No is not an option! 🐶",
  "Oops, button slipped away! 💨",
  "You know you want to say yes! 💚",
  "Error 404: 'No' not found! 🐾",
  "Resistance is futile, cutie! 🥰"
];

// State variables
let currentStep = 0;

// DOM Elements
const tagBadge = document.getElementById("tag-badge");
const mascotEmoji = document.getElementById("mascot-emoji");
const questionText = document.getElementById("question-text");
const subText = document.getElementById("sub-text");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const teaseMessage = document.getElementById("tease-message");
const contentWrapper = document.getElementById("content-wrapper");
const celebrationScreen = document.getElementById("celebration-screen");
const restartBtn = document.getElementById("restart-btn");
const whatsappLink = document.getElementById("whatsapp-link");
const musicToggle = document.getElementById("music-toggle");

// Web Audio API Synth for playful chimes & pops
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playPopSound() {
  if (!soundEnabled) return;
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(360 + Math.random() * 120, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(680 + Math.random() * 150, audioCtx.currentTime + 0.09);
  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function playSuccessChime() {
  if (!soundEnabled) return;
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.28);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.08);
    osc.stop(audioCtx.currentTime + idx * 0.08 + 0.3);
  });
}

// Reset 'No' button into normal row layout beside the Yes button
function resetNoButtonPosition() {
  noBtn.style.position = "static";
  noBtn.style.left = "auto";
  noBtn.style.top = "auto";
  noBtn.style.transform = "none";
}

// Render question slide
function renderSlide(index) {
  const q = questions[index];
  
  contentWrapper.style.opacity = "0";

  setTimeout(() => {
    tagBadge.textContent = q.step;
    mascotEmoji.textContent = q.emoji;
    questionText.textContent = q.question;
    subText.textContent = q.sub;
    yesBtn.querySelector(".btn-text").textContent = q.yesBtn;
    noBtn.querySelector(".btn-text").textContent = q.noBtn;

    resetNoButtonPosition();
    teaseMessage.textContent = "";

    contentWrapper.style.opacity = "1";
  }, 140);
}

// Dodge mechanic: strictly constrained inside visible screen bounds
function dodgeNoButton() {
  playPopSound();

  const randomTease = teaseMessages[Math.floor(Math.random() * teaseMessages.length)];
  teaseMessage.textContent = randomTease;

  const btnWidth = noBtn.offsetWidth || 100;
  const btnHeight = noBtn.offsetHeight || 38;
  
  // Safe margins inside screen
  const marginX = 24;
  const marginTop = 60;
  const marginBottom = 24;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const minX = marginX;
  const maxX = Math.max(minX, viewportWidth - btnWidth - marginX);
  const minY = marginTop;
  const maxY = Math.max(minY, viewportHeight - btnHeight - marginBottom);

  const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

  noBtn.style.position = "fixed";
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
  noBtn.style.zIndex = "999";
}

// Trigger dodge strictly on hover / mouseenter
noBtn.addEventListener("mouseenter", dodgeNoButton);
noBtn.addEventListener("mouseover", dodgeNoButton);

// Touch support for mobile
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  dodgeNoButton();
}, { passive: false });

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dodgeNoButton();
});

// When user clicks YES
yesBtn.addEventListener("click", () => {
  playSuccessChime();

  if (window.confetti) {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#7da85b', '#b8d89e', '#fbfbf2', '#ffccd8']
    });
  }

  currentStep++;
  if (currentStep < questions.length) {
    renderSlide(currentStep);
  } else {
    showCelebration();
  }
});

// Celebration screen at the end
function showCelebration() {
  contentWrapper.classList.add("hidden");
  celebrationScreen.classList.remove("hidden");
  resetNoButtonPosition();

  if (window.confetti) {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#7da85b', '#b8d89e', '#527a33', '#ffffff']
    });
  }

  const message = encodeURIComponent(
    "Pochacco convinced me! 🐶💚 I officially forgive you. Now bring me my treats and come give me my hugs! 🐾"
  );
  whatsappLink.href = `https://wa.me/?text=${message}`;
}

// Restart flow
restartBtn.addEventListener("click", () => {
  currentStep = 0;
  celebrationScreen.classList.add("hidden");
  contentWrapper.classList.remove("hidden");
  renderSlide(currentStep);
});

// Toggle Sound
musicToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  musicToggle.querySelector(".icon").textContent = soundEnabled ? "🎵" : "🔇";
  if (soundEnabled) {
    playSuccessChime();
  }
});

// Initialize on Load
window.addEventListener("DOMContentLoaded", () => {
  renderSlide(0);
});
