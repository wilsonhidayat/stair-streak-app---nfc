import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, get, remove, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let leaderboardEntries = [];
let activeTimersData = {};
let cardsCache = {};

// Listen for leaderboard updates
const leaderboardRef = ref(database, 'leaderboard');
onValue(leaderboardRef, (snapshot) => {
    const data = snapshot.val();
    const entries = data ? Object.entries(data).map(([key, value]) => ({...value, key})) : [];
    
    // Sort by time (ascending - fastest first)
    entries.sort((a, b) => a.time - b.time);
    
    leaderboardEntries = entries;
    
    // Count unique racers
    const uniqueRacers = new Set(entries.map(e => e.cardId)).size;
    
    document.getElementById('total-entries').textContent = entries.length;
    document.getElementById('unique-racers').textContent = uniqueRacers;
    
    displayLeaderboard(entries);
});

// Listen for active timers
const activeTimersRef = ref(database, 'activeTimers');
onValue(activeTimersRef, async (snapshot) => {
    const timers = snapshot.val() || {};
    activeTimersData = timers;
    const count = Object.keys(timers).length;
    
    document.getElementById('active-racers').textContent = count;
    
    // Load card data for active timers
    for (const cardId of Object.keys(timers)) {
        if (!cardsCache[cardId]) {
            const cardRef = ref(database, `cards/${cardId}`);
            const cardSnap = await get(cardRef);
            cardsCache[cardId] = cardSnap.val() || { name: cardId };
        }
    }
    
    // Show/hide active racers section
    const section = document.getElementById('active-racers-section');
    if (count > 0) {
        section.style.display = 'block';
        updateActiveTimersDisplay();
    } else {
        section.style.display = 'none';
    }
});

// Update active timers every 100ms
setInterval(() => {
    if (Object.keys(activeTimersData).length > 0) {
        updateActiveTimersDisplay();
    }
}, 100);

function updateActiveTimersDisplay() {
    const container = document.getElementById('active-timers-live');
    
    let html = '';
    for (const [cardId, timer] of Object.entries(activeTimersData)) {
        const cardData = cardsCache[cardId] || { name: cardId };
        const elapsed = (Date.now() - timer.startTime) / 1000;
        
        html += `
            <div class="timer-card-live">
                <div class="timer-name">${cardData.name || cardId}</div>
                <div class="timer-time live-timer">${formatTime(elapsed)}</div>
                <div class="timer-label">Currently Racing</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function displayLeaderboard(entries) {
    const container = document.getElementById('leaderboard-container');
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏁</div>
                <h2>No Times Yet</h2>
                <p>Tap a card at the START station to begin!</p>
            </div>
        `;
        return;
    }
    
    // Calculate session counts per card
    const sessionCounts = {};
    entries.forEach(entry => {
        sessionCounts[entry.cardId] = (sessionCounts[entry.cardId] || 0) + 1;
    });
    
    // Find best time per card
    const bestTimes = {};
    entries.forEach(entry => {
        if (!bestTimes[entry.cardId] || entry.time < bestTimes[entry.cardId]) {
            bestTimes[entry.cardId] = entry.time;
        }
    });
    
    let html = '<div class="leaderboard-list">';
    
    entries.forEach((entry, index) => {
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const sessions = sessionCounts[entry.cardId];
        const isBestTime = entry.time === bestTimes[entry.cardId];
        
        html += `
            <div class="leaderboard-entry ${rankClass}">
                <div class="rank-badge">
                    <span class="rank-number">${index + 1}</span>
                    ${medal ? `<span class="medal">${medal}</span>` : ''}
                </div>
                <div class="entry-info">
                    <div class="entry-name">
                        ${escapeHtml(entry.name)}
                        ${isBestTime ? '<span class="best-badge">🌟 Best</span>' : ''}
                    </div>
                    <div class="entry-time">${entry.formattedTime}</div>
                    <div class="entry-sessions">
                        📊 ${sessions} session${sessions > 1 ? 's' : ''} completed
                    </div>
                </div>
                <div class="entry-timestamp">${formatTimestamp(entry.timestamp)}</div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Clear leaderboard
document.getElementById('clear-leaderboard').addEventListener('click', async () => {
    if (confirm('Clear all leaderboard data? This cannot be undone!')) {
        await remove(leaderboardRef);
    }
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = (seconds % 60).toFixed(2);
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function formatTimestamp(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

