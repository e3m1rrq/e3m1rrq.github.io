document.addEventListener("DOMContentLoaded", function () {
  const executeBtn = document.getElementById("executeBtn");
  const commandInput = document.getElementById("commandInput");
  const outputDiv = document.getElementById("output");
  const cityInput = document.getElementById("cityInput");

  

  function executeCommand() {
    const command = commandInput.value.trim().toLowerCase();
    let message = "";

    

    switch (command) {
      
      
      
      case "havadurumu":
       message = "Bu komut şuanlık devredışı. Komut güncellemesi en yakın zamanda düzeltilecektir."
        break;
      case "merhaba":
        message = "Merhaba, nasılsınız? Umarım iyi bir gün geçiriyorsunuzdur. Size yardımcı olabilmem için 'yardım' kodunu kullanabilirsiniz.";
        break;
      case "teşekkürler":
        message = "Size yardımcı olabildiysem ne mutlu bana. İyi eğlenceler ve iyi günler dilerim.";
        break;
      case "yardım":
        message = "Komutlar: hakkında sumfetch kimsin amaç spotify instagram tarih havadurumu quickabdest kimim jhs ";
        break;
      case "hakkında":
        message = "Emir, 14 yaşında, kedilere, yazılıma, bilgisayara, teknolojilere, satranca, edebiyata, komikliklere oldukça meraklı.";
        break;
      case "sumfetch":
        message = window.open("index.html", "Yönlendirildiniz.");
        break;
      case "kimsin":
        message = "Bu çok kaba oldu. 'hakkında' kullanırsan daha nazik olur.";
        break;
      case "amaç":
        message = "Kendimi geliştirmek için açtığım, deney yaptığım bir site.";
        break;
      case "tarih":
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        message = today.toLocaleDateString('tr-TR', options);
        break;
      case "kimim":
        message = "Ziyaretçi.";
        break;
      case "jhs":
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "Tüm güç bende.");
        break;
      case "quickabdest":
        message = "Quickabdest alındı, artık abdestlisin 👌";
        break;
      case "spotify":
        window.open("https://open.spotify.com/user/31tsxmadimijk3aofa3yh5pskjhy?si=751caad4c16d43ca&nd=1", "Spotify");
        break;
      case "instagram":
        window.open("https://www.instagram.com/e3m1rrq/", "Instagram");
        break;
        default:
        message = "Geçerli bir komut girin veya belirli komutları deneyin (merhaba, yardım, teşekkürler).";
    }

    outputDiv.innerHTML = `<p><strong>Komut: </strong>${command}</p><p><strong>Sonuç: </strong>${message}</p>`;

    commandInput.value = "";
  }

  executeBtn.addEventListener("click", function () {
    executeCommand();
  });

  commandInput.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      executeCommand();
    }
  });
});
