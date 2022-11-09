const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists RIGHT JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(({ id, name }) => ({ id, name }))[0];
  }

  async getSongByPlaylistId(playlistId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id IN (SELECT song_id FROM playlist_songs WHERE playlist_id = $1)',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(({ id, title, performer }) => ({ id, title, performer }));
  }
}

module.exports = PlaylistService;
