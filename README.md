![Chart showing Twitter bots with the most followers](https://cdn.glitch.com/eafa115d-c307-4f55-8c74-1140bb1d0ef7%2Fchart-900px.png)

# Twitter bots with most followers

Created by [@fourtonfish](https://twitter.com/fourtonfish) using [Chart.js](https://www.chartjs.org/) and [Glitch](https://glitch.com/about/).

Visit the [Botwiki blog](https://botwiki.org/blog/most-popular-twitter-bots-most-followers/) for more details.


## Technical notes

See `data/bots.json` for list of bots. Bots starting with `?` will be ignored during data sync.

You can force data reload by setting up the `SYNC_INTERVAL_PASSWORD` inside your `.env` file and then visiting `https://twitterbots.glitch.me/sync?password=PasswordStoredInEnvFile`.

See also `misc/README.md`.