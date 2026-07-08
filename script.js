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
// Add your own song at audio/song.mp3 — see README.
// Starts when she taps the disc directly, or when she opens the slideshow.
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
    // no song added yet, or browser blocked it — fails silently
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
// SLIDESHOW (random mix of photos + videos)
// Edit the arrays below to match your actual filenames.
// Photos live in images/, videos live in videos/.
// ============================
const slideshowPhotos = [
  { type: "image", src: "images/photo1.jpg" },
  { type: "image", src: "images/photo2.jpg" },
  { type: "image", src: "images/photo3.jpg" },
  { type: "image", src: "images/photo4.jpg" },
  { type: "image", src: "images/photo5.jpg" },
  { type: "image", src: "images/photo6.jpg" }
];
const slideshowVideos = [
  { type: "video", src: "videos/video1.mp4" },
  { type: "video", src: "videos/video2.mp4" },
  { type: "video", src: "videos/video3.mp4" }
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const slideshowModal = document.getElementById("slideshowModal");
const slideshowStage = document.getElementById("slideshowStage");
const slideshowProgress = document.getElementById("slideshowProgress");
const openSlideshowBtn = document.getElementById("openSlideshow");
const slideshowCloseBtn = document.getElementById("slideshowClose");
const ssPrev = document.getElementById("ssPrev");
const ssNext = document.getElementById("ssNext");
const ssPlayPause = document.getElementById("ssPlayPause");
const ssMute = document.getElementById("ssMute");

let ssItems = [];
let ssIndex = 0;
let ssPlaying = true;
let ssMuted = false;
let ssTimer = null;
const PHOTO_DURATION = 4000; // ms each photo stays on screen

function buildSlideshowItems() {
  const combined = [...slideshowPhotos, ...slideshowVideos];
  ssItems = shuffleArray(combined);
}

function renderProgressDots() {
  slideshowProgress.innerHTML = "";
  ssItems.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === ssIndex) dot.classList.add("active");
    slideshowProgress.appendChild(dot);
  });
}

function clearStage() {
  slideshowStage.innerHTML = "";
  if (ssTimer) { clearTimeout(ssTimer); ssTimer = null; }
}

function showSlide(index) {
  clearStage();
  if (ssItems.length === 0) return;
  ssIndex = (index + ssItems.length) % ssItems.length;
  const item = ssItems[ssIndex];
  renderProgressDots();

  if (item.type === "image") {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.caption || "";
    img.onerror = () => { img.src = "https://via.placeholder.com/800x600/2b1b20/E8A0A0?text=add+" + item.src.split("/").pop(); };
    slideshowStage.appendChild(img);
    if (ssPlaying) {
      ssTimer = setTimeout(() => showSlide(ssIndex + 1), PHOTO_DURATION);
    }
  } else {
    const video = document.createElement("video");
    video.src = item.src;
    video.muted = ssMuted;
    video.playsInline = true;
    video.autoplay = true;
    video.onerror = () => {
      // missing video file — skip to next slide after a short pause
      if (ssPlaying) ssTimer = setTimeout(() => showSlide(ssIndex + 1), 1200);
    };
    if (ssPlaying) {
      video.onended = () => showSlide(ssIndex + 1);
      video.play().catch(() => {});
    } else {
      video.pause();
    }
    slideshowStage.appendChild(video);
  }
}

function openSlideshow() {
  buildSlideshowItems();
  ssPlaying = true;
  ssPlayPause.textContent = "⏸";
  slideshowModal.classList.add("open");
  showSlide(0);
}

function closeSlideshow() {
  clearStage();
  slideshowModal.classList.remove("open");
}

openSlideshowBtn.addEventListener("click", () => {
  if (!musicPlaying) playMusic();
  openSlideshow();
});
slideshowCloseBtn.addEventListener("click", closeSlideshow);
slideshowModal.addEventListener("click", (e) => {
  if (e.target === slideshowModal) closeSlideshow();
});

ssPrev.addEventListener("click", () => showSlide(ssIndex - 1));
ssNext.addEventListener("click", () => showSlide(ssIndex + 1));

ssPlayPause.addEventListener("click", () => {
  ssPlaying = !ssPlaying;
  ssPlayPause.textContent = ssPlaying ? "⏸" : "▶";
  const currentVideo = slideshowStage.querySelector("video");
  if (currentVideo) {
    ssPlaying ? currentVideo.play().catch(() => {}) : currentVideo.pause();
    if (ssPlaying) currentVideo.onended = () => showSlide(ssIndex + 1);
  } else if (ssPlaying) {
    ssTimer = setTimeout(() => showSlide(ssIndex + 1), PHOTO_DURATION);
  } else if (ssTimer) {
    clearTimeout(ssTimer);
  }
});

ssMute.addEventListener("click", () => {
  ssMuted = !ssMuted;
  ssMute.textContent = ssMuted ? "🔇" : "🔊";
  const currentVideo = slideshowStage.querySelector("video");
  if (currentVideo) currentVideo.muted = ssMuted;
});

document.addEventListener("keydown", (e) => {
  if (!slideshowModal.classList.contains("open")) return;
  if (e.key === "Escape") closeSlideshow();
  if (e.key === "ArrowRight") showSlide(ssIndex + 1);
  if (e.key === "ArrowLeft") showSlide(ssIndex - 1);
});
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
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
