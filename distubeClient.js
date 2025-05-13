// distubeClient.js
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ffmpegPath = require('ffmpeg-static');

// ⛑️ Set path ffmpeg secara global (wajib untuk Railway dan host tanpa ffmpeg)
process.env.FFMPEG_PATH = ffmpegPath;

const createDistube = (client) => {
  return new DisTube(client, {
    plugins: [new YtDlpPlugin()],
  });
};

module.exports = createDistube;
