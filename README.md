![GitHub Downloads (Total)](https://img.shields.io/github/downloads/bitfocus/companion-module-zowietek-api/total)
![GitHub Downloads (Latest Release)](https://img.shields.io/github/downloads/bitfocus/companion-module-zowietek-api/latest/total)


## Zowietek API Companion Plugin
This module can be used to communicate with Zowietek devices.
  
<br/>

## Developer Notes
I initially created this project in response to the many community requests. Moving forward, I’d appreciate the community collaborating by testing, debugging, and contributing new features and/or bug fixes. If you find issues or have ideas, please submit a pull request or open an issue. My availability may be limited in the future, so any contributions are greatly appreciated!
  
<br/>

## Installing from pkg file manually

### Installing
1. Create a new directory on your PC/Mac called `companion-plugins`.
2. Download the latest release zip from [Releases](https://github.com/bitfocus/companion-module-zowietek-api/releases).
3. Place the zip inside the companion-plugins directory and extract. It should create a new directory called `companion-module-zowietek-api`.
4. Launch Companion, on the launch window, click the settings cog in the top-right to reveal `Developer modules path`.
5. Point this path to the `companion-plugins` directory. This will cause Companion to reload.
6. The module should now be loaded into Companion.

[![image](https://github.com/user-attachments/assets/43b6a1a8-ebde-4d27-b9ec-2dff43a74b21)](https://github.com/bitfocus/companion/wiki/How-to-use-a-module-that-is-not-included-in-Companion-build#windows--macos--linux-gui)

For more information, please refer to the [Companion documentation](https://github.com/bitfocus/companion/wiki/How-to-use-a-module-that-is-not-included-in-Companion-build#windows--macos--linux-gui).

<br/>
  
<br/>

## Available Functions

### Actions

##### **Set Output Info**
- **Description:** Changes the video output settings such as resolution, audio state, and loop out.
- **Options:**  
  - **format:** Output resolution from a list of choices  
  - **audio_switch:** Mute/unmute audio  
  - **loop_out_switch:** Toggle loop out vs normal output  
- **Learn:** Fetches and pre-fills current output info  
- **Callback:** Sends updated settings to the device

##### **Set PTZ Config**
- **Description:** Configures PTZ parameters (protocol, IP/port, baud rate, etc.).
- **Options:**  
  - **protocol:** The PTZ protocol  
  - **ip, port, type:** Connection info  
  - **addr, addr_fix, baudrate_id:** Additional PTZ line settings  
- **Learn:** Fetches current PTZ configuration  
- **Callback:** Sends PTZ settings to the device

##### **Control PTZ**
- **Description:** Sends a PTZ command (e.g., pan, tilt).
- **Options:**  
  - **command:** Pan left/right, tilt up/down, etc.  
- **Callback:** Invokes the chosen PTZ command once

##### **Add Decoding URL**
- **Description:** Adds a new decoding URL (RTSP, etc.).
- **Options:**  
  - **name:** Friendly name for the stream  
  - **url:** Stream URL  
  - **streamtype:** Local vs Live  
  - **switch:** On/off  
- **Callback:** Sends to the device to begin decoding

##### **Toggle Stream**
- **Description:** Starts or stops a streaming index.
- **Options:**  
  - **index:** The stream index  
  - **switch:** On/off  
- **Callback:** Toggles the selected stream

##### **Set Device Time**
- **Description:** Updates the ZowieBox device clock and time-related settings (manual or NTP).
- **Options:**  
  - **device_time:** New time (ISO format)  
  - **setting_mode_id:** Manual, PC sync, or NTP  
  - **time_zone_id:** Time zone label  
  - **ntp_enable, ntp_server, ntp_port:** NTP configuration  
- **Learn:** Retrieves the current device time  
- **Callback:** Updates the device time

##### **Recording Control**
- **Description:** Starts, stops, or pauses a recording task.
- **Options:**  
  - **index:** The recording storage device (USB, SD, NAS)  
  - **command:** Start/stop/pause/resume  
- **Callback:** Sends the command to control recording

##### **Set Tally**
- **Description:** Configures tally color and mode.
- **Options:**  
  - **color_id:** Off, Red, Green, Blue  
  - **mode_id:** Auto or Manual  
- **Learn:** Fetches the current tally configuration  
- **Callback:** Applies the new tally settings

##### **Toggle Tally**
- **Description:** Toggles tally on/off, or uses device state to invert.
- **Options:**  
  - **switch:** Off, On, or Toggle  
- **Callback:** Updates the tally state accordingly

##### **Enable/Disable NDI Decoding**
- **Description:** Enables or disables NDI decoding for a given NDI source.
- **Options:**  
  - **ndi_name** (for enable only): The NDI source name  
- **Callback:** Updates NDI decoding state

##### **Set NDI Group**
- **Description:** Sets the NDI group used in decoder mode.
- **Options:**  
  - **groups:** Name of the NDI group  
- **Callback:** Applies the group setting

##### **NDI Switch**
- **Description:** Toggles the NDI encoding function on/off.
- **Options:**  
  - **switch_value:** 0 = Off, 1 = On  

##### **Set Audio Config**
- **Description:** Sets all audio parameters (input type, codec, bitrate, sample rate, channel, volume).
- **Options:**  
  - **ai_type, codec, bitrate, sample_rate, channel, volume, etc.**  
- **Learn:** Retrieves current audio config  
- **Callback:** Applies new audio settings

##### **Set Audio Switch**
- **Description:** Turns audio on or off.
- **Options:**  
  - **switch:** 0 = Off, 1 = On  

##### **Modify Encoding Parameters**
- **Description:** Sets encoding parameters for one channel (codec, resolution, etc.).
- **Options:**  
  - **venc_chnid:** Channel index  
  - **codec, profile, ratecontrol, bitrate, rotate, etc.**  
- **Learn:** Reads the current encoding config from the device  
- **Callback:** Updates the selected channel with new parameters

##### **Reboot Device**
- **Description:** Sends a reboot command to the device.
- **Callback:** Reboots if supported

---

### Feedbacks

##### **Output Info**
- **Description:** Indicates whether the device’s current output resolution, audio state, and loop-out setting match the user’s chosen values.
- **Learn:** Fetches current output info  
- **Callback:** Compares stored settings with the user’s selections

##### **Audio Config**
- **Description:** Shows whether the device’s audio configuration matches the user’s chosen input type, codec, bitrate, etc.
- **Learn:** Reads current audio config  
- **Callback:** Compares all relevant fields

##### **Device Time**
- **Description:** Checks if the device’s internal clock matches a user-specified time.
- **Learn:** Reads the current device time  
- **Callback:** Compares the user’s desired time to the stored device time

##### **Tally**
- **Description:** Checks if the current tally color/mode matches user-chosen values.
- **Learn:** Fetches current tally parameters  
- **Callback:** Compares color and mode to the stored state
