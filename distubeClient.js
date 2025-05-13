// distubeClient.js
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ffmpegPath = require('ffmpeg-static');

// Set path ffmpeg untuk DisTube dan yt-dlp
process.env.FFMPEG_PATH = ffmpegPath;

const createDistube = (client) => {
  return new DisTube(client, {
    plugins: [new YtDlpPlugin({
      update: false,
      ffmpeg: ffmpegPath,
    })],
    ffmpeg: ffmpegPath,
  });
};

module.exports = createDistube;
