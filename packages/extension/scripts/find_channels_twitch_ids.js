#!/usr/bin/env babel-node

import axios from 'axios';
import channels from './../src/store/channels';
import clientIds from './../src/store/clientIds';

const headers = {
  Accept: 'application/vnd.twitchtv.v5+json',
  'Client-ID': clientIds[0],
};

axios.get(`https://api.twitch.tv/kraken/users/?login=${channels.map(c => c.username).join(',')}`, { headers })
  .then(response => response.data)
  .then((data) => {
    data.users.forEach((user) => {
      console.log(user._id, user.name);
    });
  })
  .catch(console.error);
