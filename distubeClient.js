const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

process.env.FFMPEG_PATH = ffmpeg.path; 

const createDistube = (client) => {
  return new DisTube(client, {
    plugins: [new YtDlpPlugin()],
    ffmpeg: ffmpeg.path, // Optional, just to be extra safe
  });
};

module.exports = createDistube;
