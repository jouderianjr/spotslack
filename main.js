require('dotenv').config();

const {app, Tray, Menu} = require('electron');
const Store = require('electron-store');
const {startAuthFlow} = require('./auth');
const {startListeningSpotify} = require('./spotifyListener');


const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const store = new Store();

let credentials = store.get('credentials');
let tray = null;

if (process.platform == 'darwin') {
  app.dock.hide();
}

app.whenReady().then(() => {
  setupTray();

  if (credentials !== {}) {
    startAuthFlow((creds) => {
      credentials = creds;

      store.set('credentials', credentials);

      startListeningSpotify(store);
    });
  } else {
    startListeningSpotify(store);
  }

});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

const setupTray = () =>  {
  tray = new Tray(`${__dirname}/assets/tray.png`);
    
  tray.on('click', () => {
    const contextMenu = Menu.buildFromTemplate([
      {label: getStatusFromStore(), enabled: false},
      {label: 'Quit', click: () => app.quit()},
    ]);

    tray.popUpContextMenu(contextMenu);
  });
}

const getStatusFromStore = () => {
  const spotifyData = store.get('spotifyData');

  console.log(spotifyData);

  if(spotifyData === {}) {
    return 'Disabled';
  } else {
    return `${spotifyData.state} - ${spotifyData.track}`;
  }
}
