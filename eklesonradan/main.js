// === Tüm mevcut JS'nin başı ===

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dialog = document.getElementById("dialog");
const music = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");
const startScreen = document.getElementById("startScreen");
const controls = document.getElementById("controls");
const creditsScreen = document.getElementById("creditsScreen");
const chatBox = document.getElementById("chatBox");
const chatText = document.getElementById("chatText");
const chatButtons = document.getElementById("chatButtons");

const MAP_WIDTH = 18, MAP_HEIGHT = 10;
let TILE = 40;
let currentRoom = 0;

let hasDisk = false;
let inChat = false;

const player = { x: 9, y: 4, color: "white" };

// === Burada rooms, Confetti sınıfı ve diğer kod aynen ===
// (Senin önceki gönderdiğin haliyle, kopyala)
// === Tek fark: en aşağıya şu animate fonksiyonu ekle ===

function animate() {
  draw();
  drawConfetti();
  drawBirthdayMessage();
  requestAnimationFrame(animate);
}

// === Diğer tüm fonksiyonlar, move(), interact(), chat vs. aynen kalsın ===

// === Başlangıç ayarları ===
document.getElementById("startBtn").onclick = () => {
  startScreen.style.display = "none";
  creditsScreen.style.display = "none";
  canvas.style.display = "block";
  controls.style.display = "flex";
  loadRoom(0);
  resizeCanvas();

  showBirthdayMsg = true;
  startConfetti();

  setTimeout(() => {
    showBirthdayMsg = false;
  }, 5000);
};

document.getElementById("creditsBtn").onclick = () => {
  startScreen.style.display = "none";
  creditsScreen.style.display = "flex";
};

document.getElementById("backToMenuBtn").onclick = () => {
  creditsScreen.style.display = "none";
  startScreen.style.display = "flex";
};

// Klavye kontrolleri
window.addEventListener("keydown", e => {
  if (inChat) return;
  if (e.key === "ArrowLeft") move('left');
  else if (e.key === "ArrowRight") move('right');
  else if (e.key === "ArrowUp") move('up');
  else if (e.key === "ArrowDown") move('down');
  else if (e.key === " ") interact();
});

// Yeniden boyutlandırma
window.addEventListener("resize", resizeCanvas);

// Sürekli animasyon döngüsü başlat
animate();
