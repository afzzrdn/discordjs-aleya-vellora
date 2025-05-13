import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export async function joinAndPlay(voiceChannel, query, interaction) {
  try {
    const stream = ytdl(query, {
      filter: 'audioonly',
      highWaterMark: 1 << 25
    });

    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    await interaction.editReply(`🎵 Memutar: **${query}**`);
  } catch (error) {
    console.error(error);
    await interaction.editReply('❌ Gagal memutar lagu.');
  }
}
