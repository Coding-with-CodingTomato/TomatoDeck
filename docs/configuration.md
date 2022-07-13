# Configure TomatoDeck
Download the setup file from the releases section in GitHub and install it. After the application had loaded you can set a new password with a click on the bottom right lock symbole. Now you can set add a new button by clicking on the floating action button on the bottom right.

![Available Element Types](images/element_types.jpg)

You can choose between:
- **Button**: triggers an action when clicked
- **Twitch Chat**: shows one twitch chat
- **Text**: looks like a button but triggers no action

## Add a button
If you choose to configure a button you will get presented with the following dialog:

![Button Configuration](images/button_configuration.jpg)

Available settings:
- **Text/Emoji**: Set a text or emoji which will be displayed in the button (Windows: `Windows + .` macOS: `Control + Command + Space`)
- **Image/Animation**: You can choose an image or GIF which will get displayed inside the button. (The text wont be visible if you choose to set an image)
- **Color**: The background color of the button
- **Action**: This is the type of action which will get executed when the button is clicked
  - **keys**: Types the keys specified in the *Data* setting ([All available keys](https://nut-tree.github.io/apidoc/enums/key_enum.Key.html))
  - **hotkey**: Holds the all keys but the last one and clicks the last one to execute a hotkey ([All available keys](https://nut-tree.github.io/apidoc/enums/key_enum.Key.html))
  - **open_website**: Opens url specified in the *Data* setting in your default browser
  - **run_exe**: Runs the EXE file specified in the *Data* setting (Format: Path)
  - **open_folder**: Opens a folder specified in the *Data* setting (Format: Path)
  - **click_mouse**: Clicks the mouse on a specific point on your screen (Format for *Data* setting: `x,y`)
  - **play_sound**: Plays an audio file specified in the *Data* setting (Format: Path)
  - **counter**: Converts your button into a counter (Format: Number you want the counter to start with)
  - **switch_layout**: Lets you switch between all your layouts (Format: next, last, layout name)
## Add twitch chat
If you choose to configure Twitch Chat you will get presented with the following dialog where you have to specify a channelname from Twitch:

![Twitch Chat Configuration](images/twitch_chat_configuration.jpg)

## Add text
If you choose to configure Text you will get presented with the following dialog where you have to specify the text and color of the button:

![Text Configuration](images/twitch_chat_configuration.jpg)