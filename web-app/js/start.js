import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, get, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const nfcInput = document.getElementById('nfc-input');
const feedback = document.getElementById('feedback');
let inputBuffer = '';
let inputTimeout;

// Keep focus on input
nfcInput.focus();
document.addEventListener('click', () => nfcInput.focus());
setInterval(() => {
    if (document.activeElement !== nfcInput) {
        nfcInput.focus();
    }
}, 1000);

// Listen for NFC reader input
nfcInput.addEventListener('input', (e) => {
    clearTimeout(inputTimeout);
    inputBuffer += e.target.value;
    e.target.value = '';
    
    // Wait 100ms for complete card ID
    inputTimeout = setTimeout(() => {
        processCardId(inputBuffer.trim());
        inputBuffer = '';
    }, 100);
});

async function processCardId(cardId) {
    if (!cardId || cardId.length < 3) return;
    
    console.log('Card detected:', cardId);
    
    try {
        // Check if card exists
        const cardRef = ref(database, `cards/${cardId}`);
        const cardSnapshot = await get(cardRef);
        
        // Register card if new
        if (!cardSnapshot.exists()) {
            await set(cardRef, {
                uid: cardId,
                name: `Card_${cardId.substring(0, 8)}`,
                registered: new Date().toISOString()
            });
        }

        // Start timer
        const timerRef = ref(database, `activeTimers/${cardId}`);
        await set(timerRef, {
            startTime: Date.now(),
            station: 'start'
        });

        showFeedback('✅ Timer Started!', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        showFeedback('❌ Error: ' + error.message, 'error');
    }
}

function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback-message ${type}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
}

// Store active timers data globally
let activeTimersData = {};
let cardsCache = {};

// Listen for active timers
const activeTimersRef = ref(database, 'activeTimers');
onValue(activeTimersRef, async (snapshot) => {
    const timers = snapshot.val() || {};
    activeTimersData = timers;
    const count = Object.keys(timers).length;
    
    document.getElementById('active-count').textContent = count;
    
    // Load all card data
    for (const cardId of Object.keys(timers)) {
        if (!cardsCache[cardId]) {
            const cardRef = ref(database, `cards/${cardId}`);
            const cardSnap = await get(cardRef);
            cardsCache[cardId] = cardSnap.val() || { name: cardId };
        }
    }
    
    updateTimerDisplay();
});

// Update timer displays every 100ms for smooth updates
setInterval(() => {
    updateTimerDisplay();
}, 100);

function updateTimerDisplay() {
    const container = document.getElementById('active-timers');
    const count = Object.keys(activeTimersData).length;
    
    if (count === 0) {
        container.innerHTML = '<div class="empty-state-small">No active racers</div>';
        return;
    }

    let html = '';
    for (const [cardId, timer] of Object.entries(activeTimersData)) {
        const cardData = cardsCache[cardId] || { name: cardId };
        const elapsed = (Date.now() - timer.startTime) / 1000;
        
        html += `
            <div class="timer-card-small">
                <div class="timer-name">${cardData.name || cardId}</div>
                <div class="timer-time live-timer">${formatTime(elapsed)}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = (seconds % 60).toFixed(2);
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

