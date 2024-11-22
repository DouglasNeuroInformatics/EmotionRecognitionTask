import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import videoButtonResponse from "@jspsych/plugin-video-button-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import audioButtonResponse from "@jspsych/plugin-audio-button-response";
import audioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import VideoKeyboardResponsePlugin from "@jspsych/plugin-video-keyboard-response";
import { JsPsych } from "/runtime/v1/jspsych@8.x";
import test from "node:test";

var jsPsych = initJsPsych();

/* create timeline */

export default function emotionRecognitionTask() {


  const clickHandler = () => { document.addEventListener(
    "click",
    () => simulateKeyPress(jsPsych, "a"),
    { once: true },
  )};


  let timeline = [];

  const preload = {
    type: PreloadPlugin,
    auto_preload: true,
    show_progress_bar: true,
    message: `<p>loading media</p>`,
  };

  const instructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>Hello this is a test. The audio will play twice. please select the most accurate emotion displayed after</p>`,
  };

  const audioCheck = {
    type: audioKeyboardResponse,
    on_start: function () {
      document.addEventListener(
        "click",
        () => simulateKeyPress(jsPsych, "a"),
        { once: true },
      );
    },
    stimulus: "../audio/hello-there.mp3",
    prompt: "<p>Press any key to continue after video is completed</p>",
    response_ends_trial: true,
  };

  const audioEmotionChoice = {
    type: audioButtonResponse,
    stimulus: "../audio/hello-there.mp3",
    choices: ["Joy", "Anger", "Relief"],
    prompt: "<p>Select the most accurate emotion </p>",
  };

  const videoInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>Now onto video tasks, the video will be played twice for the subject to determine the emotion displayed.  Press any key to continue to the videos</p>`,
  };

  const videoCover = {
    on_start: clickHandler,
    type: HtmlKeyboardResponsePlugin,
    stimulus: "",
    prompt: `<div style="background-color:black; width:854px; height:364px">
      <p></p>
    </div>`
  }

  const testTrial = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div>
        <p>Press any key to continue.</p>
      </div>
    `,
    choices: "ALL",
    prompt: "Hi",
    on_load: () => {
      // Add an event listener for key presses
      document.addEventListener("keydown", () => {
        document.body.style.backgroundColor = "lightblue"; // Change background color
      });
    },
  };

  const videoCheck = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function() {
      
      let html = `
       <style>
    /* Style for the video container */
    .video-container {
      position: relative;
      width: 640px;
      height: 360px;
      overflow: hidden;
    }

    /* The black overlay */
    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 2;
    }

    /* The video element */
    video {
      width: 100%;
      height: 100%;
      display: block;
    }
  </style>
      

    <div class="video-container">
        <div class="video-overlay" id="overlay">
           <p>Click to play</p>
        </div>
        <video height="auto" id="video" preload="none" src="../video/Hello-There.mp4">
        </video>
        
    </div>
    `;
      return html
    },
    prompt: "<p>Press any key to continue after video has completed</p>",
    response_ends_trial: true,
    response_allowed_while_playing: false,
    on_load: () => {
      // Add an event listener for key presses
      
       // Get references to the video and overlay elements
      const video = document.getElementById("video");
      const overlay = document.getElementById("overlay");

     // Add a click event listener to the overlay
     if(overlay){
      overlay.addEventListener("click", function() {
        // Hide the overlay
        overlay.style.display = "none";
  
        // Play the video
        if(video){
          console.log('here')
          video.play().catch((err) => {
            console.error("Error playing video:", err);
          });
        }
      });

     }
     
    },

  };

  const videoEmotionChoice = {
    type: videoButtonResponse,
    stimulus: ["../video/Hello-There.mp4"],
    choices: ["Joy", "Anger", "Relief"],
    prompt: "<p> Select the most accurate emotion </p>",
    response_allowed_while_playing: false,
  };

  timeline.push(preload);
  timeline.push(instructions);
  timeline.push(audioCheck);
  timeline.push(audioEmotionChoice);
  timeline.push(videoInstructions);
  timeline.push(videoCover);
  timeline.push(videoCheck);
  timeline.push(videoEmotionChoice);

  jsPsych.run(timeline);

  function simulateKeyPress(jsPsych: JsPsych, key: string) {
    jsPsych.pluginAPI.keyDown(key);
    jsPsych.pluginAPI.keyUp(key);
  }
}
