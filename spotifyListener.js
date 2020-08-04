const spotify = require('spotify-node-applescript-promise');
const slack = require('./slack');

const startListeningSpotify = store => {
  const credentials = store.get('credentials');

  let spotifyData = {
    track: '',
    state: 'playing',
  };

  setInterval(async () => {
    const isRunning = await spotify.isRunning();

    if (isRunning) {
      const {state} = await spotify.getState();

      console.log(state);

      const trackData = await spotify.getTrack();

      const newTrack = `${trackData.name} - ${trackData.artist}`;

      if (newTrack !== spotifyData.track || state !== spotifyData.state) {
        spotifyData = {...spotifyData, track: newTrack, state: state};

        store.set('spotifyData', spotifyData);

        const emoji =
          state === 'playing' ? ':musical_note:' : ':double_vertical_bar:';

        const response = await slack.setStatus(
          credentials.accessToken,
          newTrack,
          emoji,
        );

        console.log(response.data);
      }
    }
  }, 2000);
};

module.exports = {startListeningSpotify};
