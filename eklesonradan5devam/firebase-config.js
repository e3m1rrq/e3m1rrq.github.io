// Firebase SDK'sından gerekli fonksiyonları import et
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// --- FIREBASE CONFIG ---
// DİKKAT: Bu bilgiler projenize özeldir ve herkese açık platformlarda paylaşılmamalıdır.
const firebaseConfig = {
    apiKey: "AIzaSyDKzxG2Ny6HP5ACU9jImbdF3t6D11IoSvc",
    authDomain: "yapsunu-6f74d.firebaseapp.com",
    projectId: "yapsunu-6f74d",
    storageBucket: "yapsunu-6f74d.appspot.com",
    messagingSenderId: "317485942676",
    appId: "1:317485942676:web:6bf22b344a64d56a76b181",
    measurementId: "G-W2JVPWGLSZ"
};

// --- FIREBASE BAŞLATMA ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- EXPORT ---
// Başlatılan Firebase servislerini projenin diğer dosyalarında kullanabilmek için export et
export { app, auth, db };
