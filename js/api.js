/* ==========================================================
   SpotifyStats — Spotify API Wrapper
   ========================================================== */

const SpotifyAPI = (function () {
  const BASE = 'https://api.spotify.com/v1';

  async function fetchAPI(endpoint) {
    const token = SpotifyAuth.getToken();
    if (!token) throw new Error('No token');

    const res = await fetch(BASE + endpoint, {
      headers: { Authorization: 'Bearer ' + token },
    });

    if (res.status === 401) {
      SpotifyAuth.logout();
      window.location.reload();
      return;
    }

    if (!res.ok) throw new Error('API error: ' + res.status);
    return res.json();
  }

  async function getProfile() {
    return fetchAPI('/me');
  }

  async function getTopArtists(timeRange = 'medium_term', limit = 20) {
    return fetchAPI('/me/top/artists?time_range=' + timeRange + '&limit=' + limit);
  }

  async function getTopTracks(timeRange = 'medium_term', limit = 20) {
    return fetchAPI('/me/top/tracks?time_range=' + timeRange + '&limit=' + limit);
  }

  async function getRecentlyPlayed(limit = 20) {
    return fetchAPI('/me/player/recently-played?limit=' + limit);
  }

  // Extract genres from top artists
  function extractGenres(artists) {
    const genreCount = {};
    artists.forEach((artist) => {
      artist.genres.forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    // Sort by count, take top 10
    return Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }

  // Calculate fun stats
  function calculateFunStats(artists, tracks) {
    const avgPopularity = Math.round(
      artists.reduce((sum, a) => sum + a.popularity, 0) / artists.length
    );

    const mostPopularTrack = tracks.reduce((max, t) =>
      t.popularity > max.popularity ? t : max
    );

    const mostObscureTrack = tracks.reduce((min, t) =>
      t.popularity < min.popularity ? t : min
    );

    const avgTrackPop = Math.round(
      tracks.reduce((sum, t) => sum + t.popularity, 0) / tracks.length
    );

    let tasteLabel = 'Mainstream Lover 🎧';
    if (avgTrackPop < 30) tasteLabel = 'Underground Explorer 🕳️';
    else if (avgTrackPop < 50) tasteLabel = 'Indie Enthusiast 🎸';
    else if (avgTrackPop < 70) tasteLabel = 'Balanced Listener 🎵';
    else tasteLabel = 'Chart Chaser 📈';

    const uniqueArtistsInTracks = new Set(
      tracks.flatMap((t) => t.artists.map((a) => a.id))
    ).size;

    return {
      avgPopularity,
      tasteLabel,
      topArtist: artists[0],
      mostPopularTrack,
      mostObscureTrack,
      uniqueArtists: uniqueArtistsInTracks,
    };
  }

  return {
    getProfile,
    getTopArtists,
    getTopTracks,
    getRecentlyPlayed,
    extractGenres,
    calculateFunStats,
  };
})();
