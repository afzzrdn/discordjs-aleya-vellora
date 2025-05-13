// distubeClient.js
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const createDistube = (client) => {
  return new DisTube(client, {
    plugins: [new YtDlpPlugin()],
  });
};

module.exports = createDistube;
