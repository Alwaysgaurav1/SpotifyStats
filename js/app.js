/* ==========================================================
   SpotifyStats — Main App Logic
   ========================================================== */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  let currentRange = 'medium_term';

  // ---- Show/Hide Screens ----
  function showScreen(id) {
    ['loginScreen', 'loadingScreen', 'dashboard'].forEach((s) => {
      const el = $('#' + s);
      if (el) el.classList.toggle('hidden', s !== id);
    });
  }

  // ---- Render Profile ----
  function renderProfile(profile) {
    const img = $('#profileImg');
    if (profile.images && profile.images.length > 0) {
      img.src = profile.images[0].url;
      $('#userAvatar').style.backgroundImage = 'url(' + profile.images[0].url + ')';
    } else {
      img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%231DB954" width="80" height="80" rx="40"/><text x="40" y="52" text-anchor="middle" fill="white" font-size="36">🎵</text></svg>';
    }
    $('#profileName').textContent = profile.display_name || 'Spotify User';
    $('#profileMeta').textContent = profile.email || '';
    $('#profileFollowers').textContent = (profile.followers?.total || 0).toLocaleString();
    $('#profilePlan').textContent = profile.product === 'premium' ? '⭐ Premium' : 'Free';
    $('#profileCountry').textContent = profile.country || '—';
  }

  // ---- Render Top Artists ----
  function renderArtists(artists) {
    const container = $('#topArtists');
    container.innerHTML = '';

    artists.slice(0, 10).forEach((artist, i) => {
      const img = artist.images[0]?.url || '';
      const el = document.createElement('div');
      el.className = 'artist-card';
      el.style.animationDelay = (i * 0.08) + 's';
      el.innerHTML =
        '<div class="artist-rank">#' + (i + 1) + '</div>' +
        '<div class="artist-img-wrap">' +
          '<img class="artist-img" src="' + img + '" alt="' + artist.name + '" loading="lazy">' +
        '</div>' +
        '<h4 class="artist-name">' + artist.name + '</h4>' +
        '<div class="artist-pop">' +
          '<div class="pop-bar"><div class="pop-fill" style="width:' + artist.popularity + '%"></div></div>' +
          '<span class="pop-label">' + artist.popularity + '%</span>' +
        '</div>';
      container.appendChild(el);
    });
  }

  // ---- Render Top Tracks ----
  function renderTracks(tracks, containerId) {
    const container = $(containerId);
    container.innerHTML = '';

    const items = containerId === '#recentTracks'
      ? tracks.map((t) => t.track)
      : tracks;

    items.slice(0, 15).forEach((track, i) => {
      const img = track.album?.images?.[track.album.images.length > 1 ? 1 : 0]?.url || '';
      const artists = track.artists.map((a) => a.name).join(', ');
      const duration = formatDuration(track.duration_ms);

      const el = document.createElement('div');
      el.className = 'track-item';
      el.style.animationDelay = (i * 0.05) + 's';

      let previewBtn = '';
      if (track.preview_url) {
        previewBtn = '<button class="preview-btn" data-url="' + track.preview_url + '" title="Preview">▶</button>';
      }

      el.innerHTML =
        '<div class="track-rank">' + (i + 1) + '</div>' +
        '<img class="track-img" src="' + img + '" alt="" loading="lazy">' +
        '<div class="track-info">' +
          '<div class="track-name">' + track.name + '</div>' +
          '<div class="track-artist">' + artists + '</div>' +
        '</div>' +
        '<div class="track-duration">' + duration + '</div>' +
        '<div class="track-pop-badge" title="Popularity">' + track.popularity + '</div>' +
        previewBtn;

      container.appendChild(el);
    });

    // Preview buttons
    container.querySelectorAll('.preview-btn').forEach((btn) => {
      btn.addEventListener('click', () => togglePreview(btn));
    });
  }

  // ---- Audio Preview ----
  let currentAudio = null;
  let currentBtn = null;

  function togglePreview(btn) {
    const url = btn.dataset.url;

    if (currentAudio && currentBtn === btn) {
      currentAudio.pause();
      currentAudio = null;
      btn.textContent = '▶';
      btn.classList.remove('playing');
      currentBtn = null;
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
      if (currentBtn) {
        currentBtn.textContent = '▶';
        currentBtn.classList.remove('playing');
      }
    }

    currentAudio = new Audio(url);
    currentAudio.volume = 0.5;
    currentAudio.play();
    btn.textContent = '⏸';
    btn.classList.add('playing');
    currentBtn = btn;

    currentAudio.addEventListener('ended', () => {
      btn.textContent = '▶';
      btn.classList.remove('playing');
      currentAudio = null;
      currentBtn = null;
    });
  }

  // ---- Render Fun Stats ----
  function renderFunStats(stats) {
    const container = $('#funStats');
    container.innerHTML = '';

    const items = [
      { icon: '🎭', label: 'Your Taste', value: stats.tasteLabel },
      { icon: '🌟', label: 'Avg Popularity', value: stats.avgPopularity + '/100' },
      { icon: '👑', label: '#1 Artist', value: stats.topArtist?.name || '—' },
      { icon: '🎵', label: 'Unique Artists', value: stats.uniqueArtists },
      { icon: '🔥', label: 'Most Popular', value: stats.mostPopularTrack?.name || '—' },
      { icon: '💎', label: 'Hidden Gem', value: stats.mostObscureTrack?.name || '—' },
    ];

    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'fun-stat';
      el.style.animationDelay = (i * 0.1) + 's';
      el.innerHTML =
        '<span class="fun-stat-icon">' + item.icon + '</span>' +
        '<span class="fun-stat-value">' + item.value + '</span>' +
        '<span class="fun-stat-label">' + item.label + '</span>';
      container.appendChild(el);
    });
  }

  // ---- Helpers ----
  function formatDuration(ms) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return min + ':' + (sec < 10 ? '0' : '') + sec;
  }

  // ---- Load Dashboard Data ----
  async function loadDashboard(timeRange) {
    try {
      const [profile, artistsRes, tracksRes, recentRes] = await Promise.all([
        SpotifyAPI.getProfile(),
        SpotifyAPI.getTopArtists(timeRange, 20),
        SpotifyAPI.getTopTracks(timeRange, 20),
        SpotifyAPI.getRecentlyPlayed(20),
      ]);

      const artists = artistsRes.items || [];
      const tracks = tracksRes.items || [];
      const recent = recentRes.items || [];

      renderProfile(profile);
      renderArtists(artists);
      renderTracks(tracks, '#topTracks');
      renderTracks(recent, '#recentTracks');

      const genres = SpotifyAPI.extractGenres(artists);
      SpotifyCharts.renderGenreChart(genres);
      SpotifyCharts.renderPopularityChart(artists);

      const funStats = SpotifyAPI.calculateFunStats(artists, tracks);
      renderFunStats(funStats);

      showScreen('dashboard');
    } catch (err) {
      console.error('Error loading dashboard:', err);
      SpotifyAuth.logout();
      showScreen('loginScreen');
    }
  }

  // ---- Time Range Picker ----
  function setupRangePicker() {
    $$('.range-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        $$('.range-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentRange = btn.dataset.range;
        showScreen('loadingScreen');
        await loadDashboard(currentRange);
      });
    });
  }

  // ---- Init ----
  async function init() {
    // Check for OAuth callback
    const hasCode = window.location.search.includes('code=');
    if (hasCode) {
      showScreen('loadingScreen');
      const success = await SpotifyAuth.handleCallback();
      if (success) {
        await loadDashboard(currentRange);
        return;
      }
    }

    // Check for existing token
    const token = SpotifyAuth.getToken();
    if (token) {
      showScreen('loadingScreen');
      await loadDashboard(currentRange);
      return;
    }

    // Show login
    showScreen('loginScreen');

    // Login button
    const loginBtn = $('#loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => SpotifyAuth.login());
    }

    setupRangePicker();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
