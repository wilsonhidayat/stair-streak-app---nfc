# NFC Timer - Pure Web App (Keyboard NFC Reader)

This version works with **keyboard emulator NFC readers** - the ones that type the card ID like a keyboard!

## 🎉 What Makes This Better

- ✅ **No Python backend needed for NFC**
- ✅ **Works 100% in the browser**
- ✅ **Direct Firebase integration**
- ✅ **Deploy anywhere** (Netlify, Vercel, GitHub Pages)
- ✅ **Works on any computer** with the NFC reader plugged in
- ✅ **Real-time updates** across all devices

## 🚀 Quick Start

### 1. Test Locally

Just open `index.html` in your browser:

```bash
cd web-app
open index.html
```

Or use a simple server:
```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

### 2. Deploy to Netlify

**Option A: Drag & Drop**
1. Go to https://app.netlify.com/drop
2. Drag the `web-app` folder into the browser
3. Done! Your site is live! 🎉

**Option B: GitHub**
1. Push the `web-app` folder to GitHub
2. Connect to Netlify
3. Deploy!

## 📱 How to Use

1. **Open any page** (start, stop, or leaderboard)
2. **Tap your NFC card** on the reader
3. The reader types the card ID automatically
4. JavaScript captures it and processes it
5. Data saves to Firebase instantly

### Start Station (`start.html`)
- Opens a hidden text input
- NFC reader types card ID into it
- Starts timer in Firebase
- Shows "Timer Started!" message

### Stop Station (`stop.html`)
- NFC reader types card ID
- Stops timer and calculates time
- Saves to leaderboard
- Shows final time

### Leaderboard (`leaderboard.html`)
- Real-time updates from Firebase
- Sorted fastest to slowest
- Shows active racers count

## 🔥 Firebase Setup

Your Firebase is already configured! The app connects to:
- **Database**: `https://nfc-e2bca-default-rtdb.europe-west1.firebasedatabase.app`
- **Project**: `nfc-e2bca`

### Database Structure

```
/activeTimers
  /{cardId}
    startTime: timestamp
    station: "start"

/cards
  /{cardId}
    uid: "card123"
    name: "Card_card123"
    registered: "2025-01-01T00:00:00.000Z"

/leaderboard
  /{entryId}
    cardId: "card123"
    name: "Card_card123"
    time: 45.67
    formattedTime: "45.67s"
    timestamp: "2025-01-01T00:00:00.000Z"
```

## 🎯 Your NFC Reader

Your reader is a **keyboard emulator** type. When you tap a card:
1. The reader types the card ID (like `1242054660`)
2. JavaScript captures each keystroke
3. After 100ms of no input, it processes the complete ID
4. No drivers or special software needed!

## 💡 Tips

### For Multiple Displays

1. Deploy to Netlify once
2. Open the same URL on multiple devices:
   - **TV/Monitor**: Leaderboard page (auto-updates)
   - **Tablet 1**: Start station
   - **Tablet 2**: Stop station
3. All devices sync through Firebase in real-time!

### Testing Without NFC Reader

You can manually type card IDs:
1. Open start.html
2. Click anywhere on the page
3. Type a card ID (e.g., `1242054660`)
4. Press Enter or wait 100ms
5. Timer starts!

## 🛠 Customization

### Change Card Name Format

Edit the Firebase code in `start.html` or `stop.html`:

```javascript
// Current
name: `Card_${cardId.substring(0, 8)}`

// Change to:
name: `Racer_${cardId}`
```

### Adjust Input Timeout

In `start.html` and `stop.html`, find:

```javascript
// Wait 100ms for complete card ID
inputTimeout = setTimeout(() => {
    processCardId(inputBuffer.trim());
    inputBuffer = '';
}, 100);  // Change this value
```

Increase if your reader is slow, decrease if it's fast.

### Custom Styling

Edit `style.css` to change colors, fonts, animations, etc.

## 🔧 Troubleshooting

### Card ID Not Detected

**Problem**: Nothing happens when tapping card.

**Solutions**:
- Click on the page first to ensure focus
- Check browser console (F12) for errors
- Make sure the page has loaded completely
- Try manually typing a number to test

### Firebase Not Connecting

**Problem**: "Firebase Connection Failed" message.

**Solutions**:
- Check internet connection
- Verify Firebase project is active
- Check browser console for specific errors
- Make sure Firebase config is correct

### Duplicate Card IDs

**Problem**: Same card registers multiple times.

**Cause**: Reader sends the ID twice quickly.

**Solution**: The 100ms timeout handles this, but you can increase it if needed.

### Timer Shows "No Active Timer"

**Problem**: Tapping at STOP says no timer found.

**Cause**: Card wasn't tapped at START first.

**Solution**: Always tap at START before STOP.

## 📊 Firebase Rules (Optional)

To secure your database, go to Firebase Console → Database → Rules:

```json
{
  "rules": {
    "activeTimers": {
      ".read": true,
      ".write": true
    },
    "cards": {
      ".read": true,
      ".write": true
    },
    "leaderboard": {
      ".read": true,
      ".write": true,
      ".indexOn": ["time"]
    }
  }
}
```

## 🌐 Deployment Options

- **Netlify**: Best for quick deployment
- **Vercel**: Great alternative
- **GitHub Pages**: Free and simple
- **Firebase Hosting**: Integrates perfectly with Firebase DB
- **Any static host**: Works anywhere!

## 📈 Next Steps

1. ✅ Test locally - Open `index.html`
2. ✅ Verify NFC reader works - Tap a card
3. ✅ Check Firebase connection - See "Connected" message
4. ✅ Test full flow - START → Activity → STOP
5. 🚀 Deploy to Netlify
6. 🎉 Share URL with everyone!

---

**No backend needed!** Everything runs in the browser with Firebase. Perfect for events, races, competitions, and more! 🏁

