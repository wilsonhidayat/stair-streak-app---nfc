# NFC Timer & Leaderboard

A web-based NFC timer application with real-time leaderboard. Works with keyboard emulator NFC readers.

## 🚀 Quick Start

### Deploy to Netlify (2 minutes)

1. Go to https://app.netlify.com/drop
2. Drag the `web-app` folder into your browser
3. Done! Your site is live! 🎉

### Test Locally

Open `web-app/index.html` in your browser or:

```bash
cd web-app
python3 -m http.server 8000
# Open http://localhost:8000
```

## 📁 Project Structure

```
web-app/               ← Deploy this folder to Netlify!
├── index.html         - Home page
├── leaderboard.html   - Real-time leaderboard
├── start.html         - Start station
├── stop.html          - Stop station
├── style.css          - All styling
└── README.md          - Complete documentation

firebase-credentials.json  - Firebase service account (private)
.gitignore                 - Git ignore rules
```

## ✨ Features

- ✅ Works with keyboard emulator NFC readers
- ✅ Real-time Firebase synchronization
- ✅ Live timer updates (10x per second)
- ✅ Session statistics per card
- ✅ Personal best tracking
- ✅ Multi-device support
- ✅ Beautiful responsive UI

## 📱 How to Use

1. **Deploy** the `web-app` folder to Netlify
2. **Open pages** on different devices:
   - TV/Monitor → Leaderboard
   - Tablet 1 → Start Station (with NFC reader)
   - Tablet 2 → Stop Station (with NFC reader)
3. **Tap card at START** → Timer begins
4. **Complete activity**
5. **Tap same card at STOP** → Time recorded to leaderboard

## 🔥 Firebase Configuration

Firebase is already configured and ready to use. All data is stored in the cloud and syncs in real-time.

## 📖 Documentation

See `web-app/README.md` for complete documentation including:
- Detailed setup instructions
- Customization guide
- Troubleshooting
- Deployment options

## 🎯 Your NFC Reader

This app works with **keyboard emulator** NFC readers - the ones that type the card ID like a keyboard. No special drivers or software needed!

## 🌐 Deploy to Netlify

```bash
# Open Netlify Drop page
open https://app.netlify.com/drop

# Open web-app folder in Finder
open web-app

# Drag the folder to the browser - done!
```

---

**Need help?** Check the complete guide in `web-app/README.md`

