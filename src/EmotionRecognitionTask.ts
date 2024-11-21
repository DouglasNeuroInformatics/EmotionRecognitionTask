import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import videoButtonResponse from "@jspsych/plugin-video-button-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import audioButtonResponse from "@jspsych/plugin-audio-button-response";
import audioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import VideoKeyboardResponsePlugin from "@jspsych/plugin-video-keyboard-response";
import { JsPsych } from "/runtime/v1/jspsych@8.x";

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



  const videoCheck = {
    type: VideoKeyboardResponsePlugin,
    stimulus: ["../video/Hello-There.mp4"],
    prompt: "<p>Press any key to continue after video has completed</p>",
    response_ends_trial: true,
    autoplay: true,
    response_allowed_while_playing: false,
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
  timeline.push(videoCover)
  timeline.push(videoCheck);
  timeline.push(videoEmotionChoice);

  jsPsych.run(timeline);

  function simulateKeyPress(jsPsych: JsPsych, key: string) {
    jsPsych.pluginAPI.keyDown(key);
    jsPsych.pluginAPI.keyUp(key);
  }
}
