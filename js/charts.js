/* ==========================================================
   SpotifyStats — Chart.js Visualizations
   ========================================================== */

const SpotifyCharts = (function () {
  let genreChartInstance = null;
  let popularityChartInstance = null;

  const COLORS = [
    '#1DB954', '#1ed760', '#17a44b', '#14833d',
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#fa709a',
    '#feb47b', '#ff7eb3', '#7f5af0', '#2cb67d',
  ];

  function renderGenreChart(genres) {
    const ctx = document.getElementById('genreChart');
    if (!ctx) return;

    if (genreChartInstance) genreChartInstance.destroy();

    genreChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: genres.map((g) => g.name),
        datasets: [{
          data: genres.map((g) => g.count),
          backgroundColor: COLORS.slice(0, genres.length),
          borderColor: 'rgba(10, 10, 26, 0.8)',
          borderWidth: 3,
          hoverBorderWidth: 0,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: { family: 'Inter', size: 12 },
              padding: 12,
              usePointStyle: true,
              pointStyleWidth: 12,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(10, 10, 26, 0.95)',
            titleColor: '#1DB954',
            bodyColor: '#fff',
            borderColor: 'rgba(29, 185, 84, 0.3)',
            borderWidth: 1,
            padding: 12,
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'Inter' },
            cornerRadius: 8,
          },
        },
        animation: {
          animateRotate: true,
          duration: 1500,
        },
      },
    });
  }

  function renderPopularityChart(artists) {
    const ctx = document.getElementById('popularityChart');
    if (!ctx) return;

    if (popularityChartInstance) popularityChartInstance.destroy();

    const top8 = artists.slice(0, 8);

    popularityChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: top8.map((a) => a.name.length > 12 ? a.name.slice(0, 12) + '…' : a.name),
        datasets: [{
          label: 'Popularity',
          data: top8.map((a) => a.popularity),
          backgroundColor: top8.map((_, i) => COLORS[i % COLORS.length] + 'CC'),
          borderColor: top8.map((_, i) => COLORS[i % COLORS.length]),
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: 'rgba(255, 255, 255, 0.5)',
              font: { family: 'Inter', size: 11 },
            },
          },
          y: {
            grid: { display: false },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: { family: 'Inter', size: 12 },
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 10, 26, 0.95)',
            titleColor: '#1DB954',
            bodyColor: '#fff',
            borderColor: 'rgba(29, 185, 84, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'Inter' },
          },
        },
        animation: {
          duration: 1200,
          easing: 'easeOutQuart',
        },
      },
    });
  }

  return { renderGenreChart, renderPopularityChart };
})();
