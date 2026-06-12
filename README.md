# 🎵 SpotifyStats — Your Music DNA

<p align="center">
  <strong>Visualize your Spotify listening habits with beautiful charts and stats</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spotify-API-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify API">
  <img src="https://img.shields.io/badge/Chart.js-4.4-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js">
  <img src="https://img.shields.io/badge/No_Backend-Pure_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Pure JS">
</p>

---

## ✨ Features

- 🎤 **Top Artists** — Your most listened artists with popularity scores
- 🔥 **Top Tracks** — Your favorite tracks with audio preview player
- 🎸 **Genre Breakdown** — Beautiful donut chart of your music genres
- 📈 **Popularity Chart** — How mainstream is your taste?
- 🕐 **Recently Played** — Your listening timeline
- 🎯 **Music DNA** — Fun stats: taste label, hidden gems, unique artist count
- ⏱️ **Time Ranges** — Compare Last 4 Weeks vs 6 Months vs All Time
- 🎧 **Track Preview** — Listen to 30-second previews right in the dashboard

## 🚀 Live Demo

1. Clone this repo
2. Add your Spotify Client ID
3. Open with Live Server
4. Connect your Spotify account

## ⚙️ Setup

### 1. Create a Spotify App

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create App"**
3. Fill in:
   - Name: `SpotifyStats`
   - Redirect URI: `http://localhost:5500/` (or your Live Server URL)
   - Check **Web API**
4. Save and copy your **Client ID**

### 2. Add Your Client ID

Open `js/auth.js` and replace the placeholder:

```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE'; // ← paste your Client ID here
```

### 3. Run It

Option A — **VS Code Live Server** (recommended):
- Install the "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"

Option B — **Python HTTP Server**:
```bash
cd SpotifyStats
python3 -m http.server 5500
# Open http://localhost:5500
```

Option C — **Any HTTP Server**:
```bash
npx serve .
```

> ⚠️ You MUST use a local server (not `file://`). OAuth won't work with `file://` protocol.

## 🗂️ Project Structure

```
SpotifyStats/
├── index.html         # Main page
├── css/
│   └── style.css      # Dark glassmorphism styling
├── js/
│   ├── auth.js        # Spotify OAuth PKCE flow
│   ├── api.js         # Spotify API wrapper
│   ├── charts.js      # Chart.js visualizations
│   └── app.js         # Main app logic
└── README.md
```

## 🛠️ Tech Stack

- **Spotify Web API** — OAuth 2.0 PKCE (no backend needed)
- **Chart.js** — Beautiful, responsive charts
- **Vanilla JavaScript** — No frameworks
- **CSS3** — Glassmorphism, animations, responsive grid

## 📱 Responsive

Works on desktop, tablet, and mobile!

## 📄 License

MIT License — feel free to use and modify.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Alwaysgaurav1">Gaurav Kumar Pandey</a>
</p>
