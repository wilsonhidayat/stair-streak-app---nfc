import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
try {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    document.getElementById('firebase-status').innerHTML = '✅ Connected to Firebase';
    document.getElementById('firebase-status').style.color = '#10b981';
} catch (error) {
    document.getElementById('firebase-status').innerHTML = '❌ Firebase Connection Failed';
    document.getElementById('firebase-status').style.color = '#ef4444';
    console.error('Firebase error:', error);
}

