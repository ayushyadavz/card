// ============================
// FLOATING HEARTS (ambient)
// ============================
const heartsLayer = document.getElementById("heartsLayer");
const heartEmojis = ["💗", "🤍", "💖", "🌸", "✨"];

function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
  const duration = 8 + Math.random() * 6;
  heart.style.animationDuration = duration + "s";
  heart.style.fontSize = 1 + Math.random() * 1.2 + "rem";
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}
setInterval(spawnHeart, 900);

// ============================
// CONFETTI BURST
// ============================
const confettiColors = ["#E8A0A0", "#E8B86D", "#A9C5A0", "#B69AD9", "#9AB6D9"];

function burstConfetti() {
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.animationDuration = 2.5 + Math.random() * 2 + "s";
    piece.style.opacity = 0.7 + Math.random() * 0.3;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}
document.getElementById("confettiBtn").addEventListener("click", () => {
  burstConfetti();
  blowOutCandles();
});

// ============================
// ENVELOPE OPEN
// ============================
const envelope = document.getElementById("envelope");
envelope.addEventListener("click", () => {
  envelope.classList.toggle("open");
  if (envelope.classList.contains("open")) {
    burstConfetti();
  }
});

// ============================
// MOBILE MENU
// ============================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// ============================
// MUSIC PLAYER (floating disc)
// Darkhast plays automatically on page load and loops until she stops it.
// Add your own song at audio/song.mp3 — see README.
// ============================
const musicPlayer = document.getElementById("musicPlayer");
const disc = document.getElementById("disc");
const musicState = document.getElementById("musicState");
const bgMusic = document.getElementById("bgMusic");
let musicPlaying = false;

function playMusic() {
  bgMusic.play().then(() => {
    musicPlaying = true;
    disc.classList.add("spinning");
    musicState.textContent = "now playing";
  }).catch(() => {
    // browser blocked autoplay — will retry on first tap/click anywhere
    musicState.textContent = "tap to play";
  });
}

function pauseMusic() {
  bgMusic.pause();
  musicPlaying = false;
  disc.classList.remove("spinning");
  musicState.textContent = "tap to play";
}

musicPlayer.addEventListener("click", () => {
  musicPlaying ? pauseMusic() : playMusic();
});

// try to autoplay Darkhast as soon as the page loads
window.addEventListener("load", playMusic);

// most browsers block autoplay with sound until the user interacts —
// this catches the very first tap/click anywhere on the page as a fallback
document.body.addEventListener("click", () => {
  if (!musicPlaying && !videoModal.classList.contains("open")) playMusic();
}, { once: true });

// ============================
// SCROLL PROGRESS RIBBON
// ============================
const progressRibbon = document.getElementById("progressRibbon");
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressRibbon.style.width = pct + "%";
});

// ============================
// SCROLL REVEAL ANIMATIONS
// ============================
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ============================
// LIGHTBOX (click photo to enlarge)
// ============================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".polaroid img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
}
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ============================
// FLIP CARDS (reasons i love you)
// ============================
document.querySelectorAll(".flip-card").forEach(card => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
});

// ============================
// PENGUIN + CANDLES
// On load: penguin waddles in and settles next to the cake — candles stay lit.
// Tapping the confetti button makes the penguin blow the candles out;
// they relight themselves on their own after a few seconds.
// ============================
const penguin = document.getElementById("penguin");
const cakeScene = document.getElementById("cakeScene");
let relightTimer = null;
let isBlowing = false;

function startCakeScene() {
  penguin.classList.add("walk-in");
  penguin.addEventListener("animationend", function onWalk(e) {
    if (e.animationName !== "penguinWalk") return;
    penguin.removeEventListener("animationend", onWalk);
    penguin.classList.add("arrived", "idle");
  });
}
startCakeScene();

function blowOutCandles() {
  if (isBlowing) return;
  isBlowing = true;
  clearTimeout(relightTimer);

  penguin.classList.add("arrived"); // make sure it's in position even if clicked early
  penguin.classList.remove("idle");
  penguin.classList.add("blowing");
  cakeScene.classList.add("blowing");

  setTimeout(() => {
    cakeScene.classList.add("blown-out");
  }, 350);

  setTimeout(() => {
    penguin.classList.remove("blowing");
    cakeScene.classList.remove("blowing");
    penguin.classList.add("idle");
    isBlowing = false;
  }, 750);

  // candles relight themselves after a few seconds
  relightTimer = setTimeout(() => {
    cakeScene.classList.remove("blown-out");
  }, 5000);
}

// ============================
// OUR VIDEO
// Add your edited video at videos/our-video.mp4 (see index.html).
// Opening it pauses Darkhast (keeping its position); closing it
// resumes Darkhast right where it left off.
// ============================
const videoModal = document.getElementById("videoModal");
const openVideoBtn = document.getElementById("openVideo");
const videoCloseBtn = document.getElementById("videoClose");
const ourVideo = document.getElementById("ourVideo");

let wasDarkhastPlayingBeforeVideo = false;

function openVideo() {
  // remember whether Darkhast was playing, then pause it (keeps its position)
  wasDarkhastPlayingBeforeVideo = musicPlaying;
  if (musicPlaying) pauseMusic();

  videoModal.classList.add("open");
  ourVideo.currentTime = 0;
  ourVideo.play().catch(() => {});
}

function closeVideo() {
  ourVideo.pause();
  videoModal.classList.remove("open");

  // resume Darkhast right where it left off, but only if it was playing before
  if (wasDarkhastPlayingBeforeVideo) playMusic();
}

openVideoBtn.addEventListener("click", openVideo);
videoCloseBtn.addEventListener("click", closeVideo);
videoModal.addEventListener("click", (e) => {
  if (e.target === videoModal) closeVideo();
});

// if the video finishes playing on its own, bring Darkhast back too
ourVideo.addEventListener("ended", () => {
  if (wasDarkhastPlayingBeforeVideo) playMusic();
});

document.addEventListener("keydown", (e) => {
  if (!videoModal.classList.contains("open")) return;
  if (e.key === "Escape") closeVideo();
});

if (!isTouchDevice) {
  let lastSpawn = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastSpawn < 90) return;
    lastSpawn = now;
    const heart = document.createElement("span");
    heart.className = "cursor-heart";
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  });
}