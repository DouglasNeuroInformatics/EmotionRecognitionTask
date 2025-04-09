
# Emotion Recognition Task


This repository contains the code for the Emotion Recognition Task, created with Vite and jsPsych tools, requested by Maxime Montembeault. The task can be run locally as well as with an OpenDataCapture instance.

## Setting Up FileServerConfig file

The application takes to filepath given by the FileServerConfig.json file in order to display the media content within the tasks. 
This file must be created in order to the application to run properly. The steps in order to set up the file are as so:

1. Create file FileServerConfig.json
2. Copy the contents of FileServerConfigExample.json
3. Replace the string "pathToMediaContent" with your path of media files

Note: the file directory structure of the content should follow these rules.   
      
    Stimuli  
            - Video-seulement  
            - Audio-seulement  
            - AudioVideo  
    





