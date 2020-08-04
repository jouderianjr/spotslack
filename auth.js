const {BrowserWindow} = require('electron');
const axios = require('axios');

const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const startAuthFlow = async onAuthenticationSucceed => {
  var authWindow = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    'node-integration': false,
  });

  const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&user_scope=users.profile:write`;

  authWindow.loadURL(authUrl);
  authWindow.show();

  authWindow.webContents.on('will-redirect', async (event, url) => {
    const code = getCode(url);

    if (code) {
      event.preventDefault();
      
      const creds = await fetchAccessToken(code);

      if (creds !== null) {
        onAuthenticationSucceed(creds);
        authWindow.close();
      }
    }
  });
};

const getCode = url => {
  const params = url.split('?')[1];
  const urlParams = new URLSearchParams(params);
  const code = urlParams.get('code');

  return code;
};

const fetchAccessToken = async code => {
  const url = `https://slack.com/api/oauth.v2.access?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

  const {data} = await axios.get(url);
  console.log(data);

  creds = {
    id: data.authed_user.id,
    accessToken: data.authed_user.access_token,
  };

  return creds;
};

module.exports = {startAuthFlow};
