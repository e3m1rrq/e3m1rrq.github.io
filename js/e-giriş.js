function handleEnter(event) {
    if (event.keyCode === 13) {
        checkPassword();
    }
}

function checkPassword() {
    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;

    if (password === "pGBtyUU768") {
        alert("Giriş başarılı! Devam etmek için 'Tamam' butonuna tıklayın.");
        window.location.href = "e-aktar.html";
    } else {
        const errorBox = document.getElementById("error-box");
        errorBox.textContent = "Hatalı şifre, sayfayı biraz dikkatli incelemelisin. (Fazla zor değil)";
        errorBox.style.display = "block";
    }
}

function toggleTheme() {
    const body = document.body;
    const glowText = document.querySelector(".glow-text");

    if (body.classList.contains("dark-theme")) {
        body.classList.remove("dark-theme");
        glowText.style.color = "black";
    } else {
        body.classList.add("dark-theme");
        glowText.style.color = "black";
    }
}

// Sürüklemeyi engelle
window.addEventListener("dragstart", (e) => {
    e.preventDefault();
});

// Sağ tıklamayı engelle
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});