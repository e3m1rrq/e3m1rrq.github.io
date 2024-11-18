// JavaScript kodu buraya eklenecek
var greetingText = document.querySelector(".text");
var currentTime = new Date().getHours();

if (currentTime >= 6 && currentTime < 12) {
  greetingText.textContent = "☀️Günaydın!";
} else if (currentTime >= 12 && currentTime < 18) {
  greetingText.textContent = "🌅İyi Öğlenler!";
} else {
  greetingText.textContent = "🌙İyi Akşamlar!";
}

let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e) => {
    let arrowParent = e.target.parentElement.parentElement; // okun ana üst öğesini seç
    arrowParent.classList.toggle("showMenu");
  });
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});
