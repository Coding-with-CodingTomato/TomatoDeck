# 🍅 TomatoDeck

A free software version of the well known Elgato Streamdeck.

_Name provided by CodingRuo💙_

## 🥝 Navigation

1. [Configuration](docs/configuration.md)
2. [Finished todos](docs/finished_todos.md)

## 🥥 Getting mobile app access

Due to the mobile app being a closed beta please contact me via email [me@codingtomato.de](mailto:me@codingtomato.de)

## 🐞 Known Bugs

- [x] DESKTOP: IP and PORT not showing on some devices
- [x] DESKTOP: config.json doesn't get created if it doesn't exist (PORT)
- [x] DESKTOP: A password has to be specified
- [x] DESKTOP: Pictures dont get loaded on mac (sometimes windows too)
- [x] MOBILE: Twitch Chat has no overflow scroll
- [ ] DESKTOP: correct IP is not always shown
- [ ] DESKTOP: OBS not connecting properly
  - > WebSocket client `[::ffff:127.0.0.1]:52873` has disconnected with code `4009` and reason: Authentication failed.
- [ ] DESKTOP: TWITCH Data not being set
- [ ] DESKTOP: WLED Aktion Toggle not working
- [ ] DESKTOP: WLED Aktion Texte fehlen
- [ ] MOBILE: Vibration doesnt trigger on button press

## 💪 Todos

([Here you can find a list of all finished todos](docs/finished_todos.md))

### 📄 General

- [x] Execute HTTP-Requests
  - [x] GET
  - [ ] Other Requests with options
- [ ] Discord integration
  - [x] Mute, Unmute, Toggle microphone
  - [x] Deaf, Undeaf, Toggle headphones
  - [x] Set Rich presence activity
  - [x] Leave voice channel
  - [ ] Change input and output device
  - [ ] Set volume of input and output device -> Slider element
  - [ ] Switch voice channel
- [ ] Twitch
  - [x] Write in chat
  - [ ] Set chat settings (e.g. slow mode)
  - [ ] See viewer count
- [ ] Obs integration? (obs-websocket-js)
  - [x] Add OBS Websocket Connection
  - [x] Make OBS Commands available to Send
  - [ ] Make ui for commands
- [ ] Dice Buttons
- [ ] 8Ball Button
- [ ] Reintegrate Counter Button as different Element type
- [ ] Voice hotkey
- [ ] Info Cards
  - [ ] CPU
  - [ ] RAM
  - [ ] Drive space
  - [ ] Download/Upload
  - [ ] Stock / Crypto with chart
  - [ ] PiHole
- [ ] Route Soundboard through own microphone
- [ ] Send Tweet
- [ ] Homeassistant support?
- [ ] Zoom integration?
- [ ] Teams integration?
- [ ] Spotify integration?
- [ ] Custom Button size
- [ ] Custom Background

### 🖥️ Desktop specific

- [ ] Option to automaticly start on system startup
- [ ] Audiosettings
  - [ ] Switch Audio devices
- [ ] Backup / Restore Config.json
- [ ] Log into accounts like Twitch and Twitter
- [ ] Connect via QR-Code
- [x] Knowledgebase
  - [x] Available buttons that can be pressed
  - [x] Available windows / mac / linux hotkeys
  - [ ] Multiple languages
  - [ ] General How-Tos
- [ ] Auto Update
- [ ] Right click button -> Delete, Duplicate
- [ ] Mulitple button selection -> Delete, Duplicate

### 📱 Mobile specific

- [ ] Connect via QR-Code
- [ ] Redo Settings view

## 🏆 Credits

- Project name: CodingRuo
