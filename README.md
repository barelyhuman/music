# music

A Minimalist's Music Player ♪

This player was built for me to use with steam when I'm gaming and is thus very minimal since I didn't want the steam browser to go crazy. It is very minimal and uses [music-server](https://github.com/barelyhuman/music-server) as it's backend to search through youtube and also to import the spotify playlist tracks.

## Demo

![](/public/music-preview.gif)

## Support

<a href="https://www.buymeacoffee.com/barelyhuman"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=barelyhuman&button_colour=000000&font_colour=ffffff&font_family=Inter&outline_colour=ffffff&coffee_colour=FFDD00"></a>

## Features

- Single Infinite looped Queue (non stop music for those warm up gaming session)
- Import tracks from Spotify Playlists (cause you might not be a fan of searching for tracks again and again)
- Browser specific storage (the reason why it's free to use)
- Minimal (like everything else you'll find on [barelyhuman](https://github.com/barelyhuman))
- Dark Mode (apparently this a feature now)

## Stack

The app is built with just next.js and few custom hooks and contexts that you can find in the code , the backend source can be found on [music-server](https://github.com/barelyhuman/music-server)

### Dev

```sh
> yarn install # make sure you install all packages first
> yarn dev
```

### Build

```sh
> yarn build
```

## Contribute

- You are free to pick any issues after you make a comment that you'd like to pick it up.
- Raise a PR after you're done with the needed issue, make sure the PR and issue is linked , inform if needed.
- Add any tests if needed
- Keep a friendly environment
