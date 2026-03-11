// Gerekli Firebase servislerini firebase-config.js dosyasından import et
import { auth, db } from './firebase-config.js';

// Gerekli Firestore ve Auth fonksiyonlarını SDK'dan import et
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, onSnapshot, query, where, getDocs, writeBatch, deleteField } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";


// --- GLOBAL DEĞİŞKENLER ---
let currentUser = null;
let currentUsername = null;
let currentPartyId = null;
let partyUnsubscribe = null; // Aktif parti dinleyicisini sonlandırmak için
let invitesUnsubscribe = null; // Davet dinleyicisini sonlandırmak için

// --- UI ELEMENTLERİ ---
const screens = document.querySelectorAll('.screen');
const authScreen = document.getElementById('auth-screen');
const mainMenuScreen = document.getElementById('main-menu-screen');
const partyLobbyScreen = document.getElementById('party-lobby-screen');
const gameScreen = document.getElementById('game-screen');

// Auth elementleri
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authError = document.getElementById('auth-error');

// Main Menu elementleri
const playerUsernameSpan = document.getElementById('player-username');
const createPartyBtn = document.getElementById('create-party-btn');
const joinCodeInput = document.getElementById('join-code-input');
const joinWithCodeBtn = document.getElementById('join-with-code-btn');
const notificationsDiv = document.getElementById('notifications');
const logoutBtn = document.createElement('button'); // Çıkış butonu oluştur
logoutBtn.textContent = 'Çıkış Yap';
logoutBtn.className = 'btn-secondary';
logoutBtn.style.backgroundColor = 'var(--danger-color)';
logoutBtn.style.color = 'white';
document.getElementById('main-menu-screen').querySelector('.screen-content').appendChild(logoutBtn);


// Party Lobby elementleri
const partyCodeSpan = document.getElementById('party-code');
const playerListUl = document.getElementById('player-list');
const inviteUsernameInput = document.getElementById('invite-username-input');
const inviteBtn = document.getElementById('invite-btn');
const partyStatusP = document.getElementById('party-status');

// Game Screen elementleri
const eggSelectionPhase = document.getElementById('egg-selection-phase');
const petCarePhase = document.getElementById('pet-care-phase');
const voteTimerSpan = document.getElementById('vote-timer');
const eggContainer = document.querySelector('.egg-container');
const cancelVoteBtn = document.getElementById('cancel-vote-btn');
const petNameH2 = document.getElementById('pet-name');
const petImageDiv = document.getElementById('pet-image');
const infoBtn = document.getElementById('info-btn');
const petStatsDiv = document.getElementById('pet-stats');
const turnPlayerB = document.getElementById('turn-player');
const actionsLeftB = document.getElementById('actions-left');
const playerMoneySpan = document.getElementById('player-money');
const marketDiv = document.querySelector('.market');


// --- YARDIMCI FONKSİYONLAR ---
function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function generatePet() {
    const roll = Math.random() * 100;
    let petType, rarity, growthDetails;

    if (roll < 5) { rarity = "Efsanevi"; petType = Math.random() < 0.5 ? "Kırmızı Panda" : "Köpekbalığı"; }
    else if (roll < 30) { rarity = "Destansı"; petType = Math.random() < 0.5 ? "Yılan" : "Solucan"; }
    else if (roll < 75) { rarity = "Ender"; petType = Math.random() < 0.5 ? "Balık" : "Tavuk"; }
    else { rarity = "Sıradan"; petType = Math.random() < 0.5 ? "Kedi" : "Köpek"; }
    
    switch(petType) {
        case "Kedi": growthDetails = { food: "Balık Maması", stages: 3, xpToLevel: 100 }; break;
        case "Köpek": growthDetails = { food: "Etli Mama", stages: 3, xpToLevel: 120 }; break;
        default: growthDetails = { food: "Standart Mama", stages: 2, xpToLevel: 150 }; break;
    }

    return { name: petType, rarity, stats: { hunger: 80, happiness: 70, level: 1, xp: 0 }, growthStage: 1, details: growthDetails };
}


// --- AUTH İŞLEMLERİ ---
onAuthStateChanged(auth, async (user) => {
    if (partyUnsubscribe) partyUnsubscribe();
    if (invitesUnsubscribe) invitesUnsubscribe();
    
    if (user) {
        currentUser = user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            currentUsername = userData.username;
            currentPartyId = userData.currentPartyId;
            playerUsernameSpan.textContent = currentUsername;
            if (currentPartyId) listenToParty(currentPartyId);
            else { showScreen('main-menu-screen'); listenToInvites(currentUsername); }
        }
    } else {
        currentUser = null; currentUsername = null; currentPartyId = null;
        showScreen('auth-screen');
    }
});

registerBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
        authError.textContent = 'Kullanıcı adı ve şifre boş olamaz.';
        return;
    }
    const email = `${username}@oyun.com`;
    authError.textContent = '';
    
    const usersQuery = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(usersQuery);
    if (!querySnapshot.empty) {
        authError.textContent = 'Bu kullanıcı adı zaten alınmış.';
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            username: username,
            currentPartyId: null
        });
    } catch (error) {
        authError.textContent = 'Kayıt başarısız: ' + error.message;
    }
});

loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
        authError.textContent = 'Kullanıcı adı ve şifre boş olamaz.';
        return;
    }
    const email = `${username}@oyun.com`;
    authError.textContent = '';

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError.textContent = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Çıkış yaparken hata:", error);
    }
});


// --- PARTİ VE DAVET İŞLEMLERİ ---
createPartyBtn.addEventListener('click', async () => {
    const partyRef = doc(collection(db, "parties"));
    const inviteCode = partyRef.id.substring(0, 6).toUpperCase();

    await setDoc(partyRef, {
        players: [currentUser.uid],
        playerUsernames: [currentUsername],
        inviteCode: inviteCode,
        status: 'waiting',
    });

    await updateDoc(doc(db, "users", currentUser.uid), {
        currentPartyId: partyRef.id
    });
    
    listenToParty(partyRef.id);
});

joinWithCodeBtn.addEventListener('click', async () => {
    const code = joinCodeInput.value.toUpperCase().trim();
    if (!code) return;

    const partyQuery = query(collection(db, "parties"), where("inviteCode", "==", code));
    const querySnapshot = await getDocs(partyQuery);

    if (querySnapshot.empty) {
        alert("Bu koda sahip bir parti bulunamadı.");
        return;
    }

    const partyDoc = querySnapshot.docs[0];
    const partyData = partyDoc.data();

    if (partyData.players.length >= 2) {
        alert("Bu parti zaten dolu.");
        return;
    }
    if (partyData.players.includes(currentUser.uid)) {
        alert("Zaten bu partidesin.");
        return;
    }
    
    await updateDoc(doc(db, "parties", partyDoc.id), {
        players: [...partyData.players, currentUser.uid],
        playerUsernames: [...partyData.playerUsernames, currentUsername],
        status: 'voting'
    });
    
    await updateDoc(doc(db, "users", currentUser.uid), {
        currentPartyId: partyDoc.id
    });
});

inviteBtn.addEventListener('click', async () => {
    const targetUsername = inviteUsernameInput.value.trim();
    if (!targetUsername || targetUsername === currentUsername) return;

    const userQuery = query(collection(db, "users"), where("username", "==", targetUsername));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
        alert("Böyle bir kullanıcı bulunamadı.");
        return;
    }

    await addDoc(collection(db, "invites"), {
        fromUsername: currentUsername,
        toUsername: targetUsername,
        partyId: currentPartyId,
        status: "pending"
    });
    alert(`${targetUsername} adlı oyuncuya davet gönderildi!`);
    inviteUsernameInput.value = '';
});

function listenToInvites(username) {
    const invitesQuery = query(collection(db, "invites"), where("toUsername", "==", username), where("status", "==", "pending"));
    
    if (invitesUnsubscribe) invitesUnsubscribe();
    invitesUnsubscribe = onSnapshot(invitesQuery, (snapshot) => {
        notificationsDiv.innerHTML = '<h3>Gelen Davetler</h3>';
        if (snapshot.empty) {
            notificationsDiv.innerHTML += '<p>Yeni davet yok.</p>';
        }
        snapshot.forEach(doc => {
            const invite = doc.data();
            const inviteDiv = document.createElement('div');
            inviteDiv.className = 'invite-notification';
            inviteDiv.innerHTML = `
                <p><b>${invite.fromUsername}</b> sizi partiye davet ediyor!</p>
                <button class="accept-invite btn-primary" data-invite-id="${doc.id}" data-party-id="${invite.partyId}">Kabul Et</button>
                <button class="decline-invite btn-secondary" data-invite-id="${doc.id}">Reddet</button>
            `;
            notificationsDiv.appendChild(inviteDiv);
        });
    });
}

document.addEventListener('click', async (e) => {
    if (e.target.matches('.accept-invite')) {
        const inviteId = e.target.dataset.inviteId;
        const partyIdToJoin = e.target.dataset.partyId;
        
        const partyDocRef = doc(db, "parties", partyIdToJoin);
        const partyDoc = await getDoc(partyDocRef);

        if (partyDoc.exists()) {
             const partyData = partyDoc.data();
             if (partyData.players.length < 2) {
                 const batch = writeBatch(db);
                 batch.update(partyDocRef, { players: [...partyData.players, currentUser.uid], playerUsernames: [...partyData.playerUsernames, currentUsername], status: 'voting' });
                 batch.update(doc(db, "users", currentUser.uid), { currentPartyId: partyIdToJoin });
                 batch.update(doc(db, "invites", inviteId), { status: "accepted" });
                 await batch.commit();
             } else {
                 alert("Parti artık dolu.");
                 await updateDoc(doc(db, "invites", inviteId), { status: "expired" });
             }
        }
    }
    if (e.target.matches('.decline-invite')) {
        const inviteId = e.target.dataset.inviteId;
        await updateDoc(doc(db, "invites", inviteId), { status: "declined" });
    }
});


// --- OYUNUN ANA DİNLEYİCİSİ VE MANTIĞI ---
function listenToParty(partyId) {
    if (partyUnsubscribe) partyUnsubscribe();
    
    partyUnsubscribe = onSnapshot(doc(db, "parties", partyId), (doc) => {
        if (!doc.exists()) {
            alert("Parti artık mevcut değil.");
            updateDoc(doc(db, "users", currentUser.uid), { currentPartyId: null });
            return;
        }
        const partyData = doc.data();
        currentPartyId = partyId;
        updateUI(partyData);
    });
}

let voteTimerInterval = null;

function updateUI(party) {
    if (party.status === 'waiting') {
        showScreen('party-lobby-screen');
        partyCodeSpan.textContent = party.inviteCode;
        playerListUl.innerHTML = party.playerUsernames.map(name => `<li>${name}</li>`).join('');
        partyStatusP.textContent = 'İkinci oyuncu bekleniyor...';
    } else if (party.status === 'voting') {
        showScreen('game-screen');
        eggSelectionPhase.style.display = 'flex';
        petCarePhase.style.display = 'none';

        const userVote = party.votes ? party.votes[currentUser.uid] : null;
        document.querySelectorAll('.egg').forEach(egg => {
            egg.classList.toggle('selected', egg.dataset.egg === userVote);
        });
        cancelVoteBtn.style.display = userVote ? 'block' : 'none';

        if (!voteTimerInterval) {
            let timeLeft = 10;
            voteTimerSpan.textContent = timeLeft;
            voteTimerInterval = setInterval(async () => {
                timeLeft--;
                voteTimerSpan.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(voteTimerInterval);
                    voteTimerInterval = null;
                    if (party.players[0] === currentUser.uid) {
                        finishVoting(currentPartyId);
                    }
                }
            }, 1000);
        }
    } else if (party.status === 'active') {
        showScreen('game-screen');
        eggSelectionPhase.style.display = 'none';
        petCarePhase.style.display = 'flex';
        if (voteTimerInterval) {
            clearInterval(voteTimerInterval);
            voteTimerInterval = null;
        }

        const pet = party.pet;
        petNameH2.textContent = `${pet.name} (${pet.rarity})`;
        petImageDiv.innerHTML = `<img src="https://placehold.co/200x200/${getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim().substring(1)}/3d3d4e?text=${pet.name.replace(' ', '+')}&font=poppins" alt="${pet.name}">`;
        
        const turnPlayerUsername = party.playerUsernames[party.players.indexOf(party.turn)];
        turnPlayerB.textContent = turnPlayerUsername;
        actionsLeftB.textContent = party.actionsLeft;
        playerMoneySpan.textContent = party.wallets[currentUser.uid];
        petStatsDiv.innerHTML = `<p>Seviye: ${pet.stats.level} (XP: ${pet.stats.xp}/${pet.details.xpToLevel})</p><p>Açlık: ${pet.stats.hunger}/100</p><p>Mutluluk: ${pet.stats.happiness}/100</p>`;
        document.querySelectorAll('.action-btn, .buy-food').forEach(btn => {
            btn.disabled = party.turn !== currentUser.uid;
        });
    }
}


// --- OYUN AKSİYONLARI ---
eggContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('egg')) {
        const selectedEgg = e.target.dataset.egg;
        updateDoc(doc(db, "parties", currentPartyId), {
            [`votes.${currentUser.uid}`]: selectedEgg
        });
    }
});

cancelVoteBtn.addEventListener('click', () => {
    updateDoc(doc(db, "parties", currentPartyId), {
        [`votes.${currentUser.uid}`]: deleteField()
    });
});

async function finishVoting(partyId) {
    const partyRef = doc(db, "parties", partyId);
    const partyDoc = await getDoc(partyRef);
    if (!partyDoc.exists()) return;
    const partyData = partyDoc.data();

    if (partyData.status !== 'voting') return;

    const votes = partyData.votes ? Object.values(partyData.votes) : [];
    const voteCounts = votes.reduce((acc, vote) => { acc[vote] = (acc[vote] || 0) + 1; return acc; }, {});
    let chosenEgg;
    if (Object.keys(voteCounts).length === 1) { chosenEgg = Object.keys(voteCounts)[0]; }
    else if (Object.keys(voteCounts).length > 1) { const tied = Object.keys(voteCounts); chosenEgg = tied[Math.floor(Math.random() * tied.length)]; }
    else { chosenEgg = `egg${Math.floor(Math.random() * 3) + 1}`; }

    const newPet = generatePet();
    
    await updateDoc(partyRef, {
        status: 'active',
        pet: newPet,
        turn: partyData.players[0],
        actionsLeft: 3,
        wallets: { [partyData.players[0]]: 500, [partyData.players[1]]: 500, }
    });
}

infoBtn.addEventListener('click', () => {
    petStatsDiv.style.display = petStatsDiv.style.display === 'none' ? 'block' : 'none';
});

marketDiv.addEventListener('click', async (e) => {
    if (e.target.matches('.buy-food')) {
        const price = parseInt(e.target.dataset.price);
        const partyRef = doc(db, "parties", currentPartyId);
        const partyDoc = await getDoc(partyRef);
        const partyData = partyDoc.data();

        if (partyData.wallets[currentUser.uid] >= price) {
            const newMoney = partyData.wallets[currentUser.uid] - price;
            const newHunger = Math.min(100, partyData.pet.stats.hunger + (price / 2));
            const newActionsLeft = partyData.actionsLeft - 1;

            const updates = {
                [`wallets.${currentUser.uid}`]: newMoney,
                'pet.stats.hunger': newHunger,
                'actionsLeft': newActionsLeft
            };
            
            if (newActionsLeft <= 0) {
                const currentPlayerIndex = partyData.players.indexOf(currentUser.uid);
                const nextPlayerIndex = (currentPlayerIndex + 1) % 2;
                updates.turn = partyData.players[nextPlayerIndex];
                updates.actionsLeft = 3;
            }
            await updateDoc(partyRef, updates);
        } else {
            alert("Yeterli paran yok!");
        }
    }
});

