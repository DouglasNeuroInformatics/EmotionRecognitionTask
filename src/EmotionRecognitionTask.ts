import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import SurveyHtmlFormPlugin from "@jspsych/plugin-survey-html-form";
import videoButtonResponse from '@jspsych/plugin-video-button-response';
import PreloadPlugin from "@jspsych/plugin-preload";
import audioButtonResponse from '@jspsych/plugin-audio-button-response';
import audioKeyboardResponse from '@jspsych/plugin-audio-button-response';
import VideoKeyboardResponsePlugin from "@jspsych/plugin-video-keyboard-response";

var jsPsych = initJsPsych();

/* create timeline */
var timeline = [];

const preload = {
    type: PreloadPlugin,
    auto_preload: true,
    show_progress_bar: true,
    message: `<p>loading media</p>`,
};


const audioCheck = {
    type: audioKeyboardResponse,
    stimulus: 'sound/tone.mp3',
    prompt: "<p>Press any key to continue</p>",
    response_ends_trial: true
};

const audioEmotionChoice = {
    type: audioButtonResponse,
    stimulus: 'sound/tone.mp3',
    choices: ['Joy', 'Anger', 'Relief'],
    prompt: "<p>Select the most accurate emotion </p>"
}

const videoCheck = {
    type: VideoKeyboardResponsePlugin,
    stimulus: 'video/video.mp4',
    prompt: "<p>Press any key to continue</p>",
    response_ends_trial: true
}

const videoEmotionChoice = {
    type: videoButtonResponse,
    stimulus: 'video/video.mp4',
    choices: ['Joy', 'Anger', 'Relief'],
    prompt: "<p> Select the most accurate emotion </p>"
}
