const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

// Set path ke FFmpeg
process.env.FFMPEG_PATH = ffmpeg.path;

const createDistube = (client) => {
  return new DisTube(client, {
    plugins: [new YtDlpPlugin()],
  });
};

module.exports = createDistube;
