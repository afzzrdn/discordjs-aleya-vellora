const ytSearch = require('yt-search');

async function getSuggestions(query) {
  if (!query || query.length < 2) return [];

  try {
    const result = await ytSearch(query);
    return result.videos.slice(0, 5); // max 5 rekomendasi
  } catch (error) {
    console.error('Gagal mendapatkan saran judul:', error);
    return [];
  }
}

module.exports = { getSuggestions };
