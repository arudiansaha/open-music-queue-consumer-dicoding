class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      const playlist = await this._playlistService.getPlaylist(playlistId);
      const songs = await this._playlistService.getSongByPlaylistId(playlistId);

      const playlistWithSongs = {
        playlist: {
          ...playlist,
          songs: [...songs],
        },
      };

      const result = await this._mailSender
        .sendEmail(targetEmail, JSON.stringify(playlistWithSongs));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
