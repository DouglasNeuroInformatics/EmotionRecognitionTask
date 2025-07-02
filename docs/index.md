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
        ↳ AudioVideo  
    

