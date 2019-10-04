# get-twitter-list-members.js

This is the script used to collect data from the ["omnibots" Twitter list](twitter.com/botALLY/lists/omnibots).

The script uses a `config.js` file that has the follownig structure:

```
var config = {};

config.twitter = {
  consumer_key: 'CONSUMERKEY',
  consumer_secret: 'CONSUMERSECRET',
  access_token: 'ACCESSTOKEN',
  access_token_secret: 'ACCESSTOKENSECRET'
}

module.exports = config;
```