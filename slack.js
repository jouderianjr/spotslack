const axios = require('axios');

const setStatus = async (accessToken, text, emoji) => {
  const url = 'https://slack.com/api/users.profile.set';

  const data = {
    profile: {
      status_emoji: emoji,
      status_text: text,
    },
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
    data,
    url,
  };

  return axios(options);
};

module.exports = {setStatus};
