/* ==========================================================
   SpotifyStats — Spotify OAuth PKCE Flow (No server needed)
   ========================================================== */

const SpotifyAuth = (function () {
  // ⚠️ REPLACE THIS with your Client ID from developer.spotify.com/dashboard
  const CLIENT_ID = 'e981d0041957482f82ab11f46b68f051';
  const REDIRECT_URI = 'http://127.0.0.1:8000';
  const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
  ].join(' ');

  const TOKEN_KEY = 'spotify_access_token';
  const VERIFIER_KEY = 'spotify_code_verifier';
  const EXPIRY_KEY = 'spotify_token_expiry';

  // Generate random string for PKCE
  function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values, (v) => possible[v % possible.length]).join('');
  }

  // SHA-256 hash
  async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
  }

  // Base64 URL encode
  function base64UrlEncode(buffer) {
    const bytes = new Uint8Array(buffer);
    let str = '';
    bytes.forEach((b) => (str += String.fromCharCode(b)));
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Redirect to Spotify login
  async function login() {
    const verifier = generateRandomString(128);
    const challenge = base64UrlEncode(await sha256(verifier));

    localStorage.setItem(VERIFIER_KEY, verifier);

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });

    window.location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
  }

  // Exchange code for token
  async function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) return false;

    const verifier = localStorage.getItem(VERIFIER_KEY);

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(EXPIRY_KEY, Date.now() + data.expires_in * 1000);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }

    return false;
  }

  // Get stored token
  function getToken() {
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry)) {
      logout();
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  // Logout
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(VERIFIER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  }

  return { login, handleCallback, getToken, logout };
})();
