# Emotion Recognition Task

This repository contains the code for the Emotion Recognition Task, created with Vite and jsPsych tools, requested by Maxime Montembeault. The task can be run locally as well as with an OpenDataCapture instance.

## Running Task Locally

### Dependencies

In order to run the task locally one must have a version of Node installed. We recommend using NVM as a way to install and manage node versions. The link more info and how to install can be seen [here](https://github.com/nvm-sh/nvm).

Once nvm is installed run the follow command to install the latest Node version

```sh
nvm install --lts
```

Furthermore, the application uses pnpm as its package manager, thus after installing the Node version one must activate pnpm with this command.

```sh
corepack enable
```

### Installing Packages and Running the Task

Once pnpm is enabled, run the following command in the projects directory

```sh
pnpm install
```

Finally run the `dev` command to start up the local instance

```sh
pnpm dev
```

This will start up the task on http://localhost:5173/

## Setting Up FileServerConfig file

The application takes to filepath given by the FileServerConfig.json file in order to display the media content within the tasks. This file must be created in order to the application to run properly. The steps in order to set up the file are as so:

1. Create file FileServerConfig.json
2. Copy the contents of FileServerConfigExample.json
3. Replace the string "pathToMediaContent" with your path of media files

Note: the file directory structure of the content should follow these rules.

    Stimuli
        ↳ Video-seulement
        ↳ Audio-seulement
        ↳ Audio-video
        ↳ Calibration
            ↳ CERAM_verification_son_fr-CA.mp3

## Sound Check (Volume Calibration)

Before the general instructions, participants see a sound check screen. They are asked to put on headphones if available, play a short reference voice recording, and adjust their device volume until the voice is clear and comfortable.

- The recording can be replayed as many times as needed.
- "Sounds good, continue" is enabled once the recording has started playing at least once, and proceeds to the task.
- "I can't hear anything" shows troubleshooting steps, and "Try again" returns to the sound check.
- The screen cannot be skipped (keyboard input is disabled).
- The screen is not recorded in the exported data; the data format is unchanged.

The reference recording (`Stimuli/Calibration/CERAM_verification_son_fr-CA.mp3`) is level-matched to the quietest stimulus (-31.8 LUFS integrated loudness) so that a participant who can hear it comfortably will hear every stimulus. The stimuli themselves are not normalised: loudness differences between them are part of the emotional signal.

To level-match a new reference recording, measure it and apply plain gain (no compression or limiting) with ffmpeg:

```sh
# measure integrated loudness (I) of the recording
ffmpeg -nostats -i input.mp3 -af ebur128 -f null - 2>&1 | grep "I:"
# apply the difference to -31.8 LUFS as gain, e.g. -2.8 dB, then re-measure
ffmpeg -i input.mp3 -af volume=-2.8dB -c:a libmp3lame -b:a 96k output.mp3
```

Only a French recording exists for now, so English sessions use the same clip. To use an English recording, upload it to `Stimuli/Calibration/` and set `soundCheck_en` in `src/ODCMediaContent.ts`.
