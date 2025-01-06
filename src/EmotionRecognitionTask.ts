import { initJsPsych, JsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import HtmlButtonResponse from "@jspsych/plugin-html-button-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import {
  addBootstrapScripts,
  addContinueButton,
  audioHtmlGenerator,
  createContinueButtonDiv,
  revealEmotionButtons,
  videoCoverHtmlGenerator
} from "./helperFunctions";
import * as mediaData from "./mediaContentData.json";

import type { Language } from "@opendatacapture/runtime-v1/@opendatacapture/runtime-core/index.js";
import i18n from "./i18n.ts";
import { experimentSettingsJson } from "./experimentSettings.ts";
import { $Settings } from "./schemas.ts";


export default async function emotionRecognitionTask() {
 

  // parse settings
  const settingsParseResult = $Settings.safeParse(experimentSettingsJson);

  if (!settingsParseResult.success) {
    throw new Error(
      `validation error, check experiment settings \n error can be seen below: \n ${settingsParseResult.error}`
    );
  }

  const language = experimentSettingsJson.language as Language;

  // small hack to get around i18n issues with wait for changeLanguage
  i18n.changeLanguage(language as Language);
  await new Promise(function (resolve) {
    i18n.onLanguageChange = resolve;
  });

  const clickHandler = () => {
    document.addEventListener("click", () => simulateKeyPress(jsPsych, "a"), {
      once: true,
    });
  };

  const timeline = [];

  const preload = {
    type: PreloadPlugin,
    auto_preload: true,
    show_progress_bar: true,
    message: `<p> ${i18n.t("loadingStimulus")}</p>`,
  };

  const taskInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>${i18n.t("initialInstructions")}</p>`,
    on_load: function () {
      document.addEventListener("click", clickHandler);
    },
    on_finish: function () {
      document.removeEventListener("click", clickHandler);
    },
  };

  const audioInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>${i18n.t("audioInstructions")}</p>`,
    on_load: function () {
      document.addEventListener("click", clickHandler);
    },
    on_finish: function () {
      document.removeEventListener("click", clickHandler);
    },
  };

  const audioHtmlTask = (filepath: string) => {
    return {
      type: HtmlKeyboardResponsePlugin,
      stimulus: function () {
        return audioHtmlGenerator(filepath);
      },
      prompt: `<p> ${i18n.t("initialAudioTask")} <br/> </p>`,

      response_allowed_while_playing: false,
      response_ends_trial: false,

      on_load: () => {
        addBootstrapScripts();

        let playOnce = false;
        const audioIcon = document.getElementById("audioIcon");
        const audioContent = document.getElementById("audioContent");

        const continueButton = addContinueButton();
        const continueButtonDiv = createContinueButtonDiv(continueButton);
        const jsPsychContent = document.getElementById("jspsych-content");

        if (jsPsychContent) {
          jsPsychContent.appendChild(continueButtonDiv);
        } else {
          document.body.appendChild(continueButtonDiv);
        }

        if (audioIcon) {
          audioIcon.addEventListener("click", () => {
            if (
              audioContent &&
              audioContent instanceof HTMLAudioElement &&
              !playOnce
            ) {
              audioContent.play();
              playOnce = true;
            }
          });
        }

        if (audioContent && audioContent instanceof HTMLAudioElement) {
          audioContent.addEventListener("ended", () => {
            continueButton.style.display = "flex";
          });
        }

        continueButton.addEventListener("click", () => {
          jsPsych.finishTrial();
          continueButton.remove();
        });
      },
    };
  };

  const audioHtmlEmotionChoice = (
    filepath: string,
    mediaCode: string,
    mediaType: string,
    emotionChoices: string[],
    correctAnswer: string
  ) => {
    let finalResponse: string = "";
    return {
      type: HtmlButtonResponse,
      stimulus: function () {
        return audioHtmlGenerator(filepath);
      },
      choices: emotionChoices,
      button_html: (choice: string) => {
        return `<div name='custom-button-div' data-toggle="buttons" style="padding:10px;  display:none; justify-content: center; align-items: center;  width: 100%"><button name="custom-button" type="button" class="btn btn-primary" style="width:100%">${choice}</button></div>`;
      },
      prompt: `<p>${i18n.t("audioEmotionSelection")}</p>`,

      response_allowed_while_playing: false,
      correct_answer: correctAnswer,
      response_ends_trial: false,

      on_load: () => {
        addBootstrapScripts();

        let playOnce = false;
        const audioIcon = document.getElementById("audioIcon");
        const audioContent = document.getElementById("audioContent");

        let start_time = 0;

        const continueButton = addContinueButton();
        const continueButtonDiv = createContinueButtonDiv(continueButton);
        const jsPsychContent = document.getElementById("jspsych-content");

        if (jsPsychContent) {
          jsPsychContent.appendChild(continueButtonDiv);
        } else {
          document.body.appendChild(continueButtonDiv);
        }

        if (audioIcon) {
          audioIcon.addEventListener("click", () => {
            if (
              audioContent &&
              audioContent instanceof HTMLAudioElement &&
              !playOnce
            ) {
              audioContent.play();
              playOnce = true;
            }
          });
        }

        if (audioContent && audioContent instanceof HTMLAudioElement) {
          audioContent.addEventListener("ended", () => {
            revealEmotionButtons();
            continueButton.style.display = "flex";

            //set start time
            start_time = performance.now();
          });
        }

        const buttonSelections = document.querySelectorAll(
          'button[name="custom-button"]'
        );

        buttonSelections.forEach((button) => {
          button.addEventListener("click", (e) => {
            if (e.target instanceof HTMLButtonElement && e.target === button) {
              const val = button.innerHTML;
              finalResponse = val;
            }
          });
        });
        continueButton.addEventListener("click", () => {
          if (!finalResponse) {
            alert(i18n.t("buttonSelectionWarning"));
            return;
          }
          jsPsych.finishTrial({
            rt: performance.now() - start_time,
            response: finalResponse,
          });
          continueButton.remove();
        });
      },
      on_finish: function(data: any) {
        if(finalResponse){
          data.correctResponse = (finalResponse === correctAnswer)
          data.selectedResponse = finalResponse
          data.mediaFileType =  mediaType
          data.itemCode = mediaCode 
          data.trial_type = "emotionChoice"
        }
      }
    };
  };

  const videoInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>${i18n.t("videoTaskInstructions")}</p>`,
    on_load: function () {
      document.addEventListener("click", clickHandler);
    },
    on_finish: function () {
      document.removeEventListener("click", clickHandler);
    },
  };

  const videoCheck = (filepath: string) => {
    return {
      type: HtmlKeyboardResponsePlugin,
      stimulus: function () {
        return videoCoverHtmlGenerator(filepath);
      },
      prompt: `<p>${i18n.t("initialVideoTask")}</p>`,
      response_ends_trial: false,
      response_allowed_while_playing: false,
      on_load: () => {
        addBootstrapScripts();

        // Get references to the video and overlay elements
        const video = document.getElementById("video");
        const overlay = document.getElementById("overlay");
        const cross = document.getElementById("overlay-cross");

        const continueButton = addContinueButton();
        const continueButtonDiv = createContinueButtonDiv(continueButton);
        const jsPsychContent = document.getElementById("jspsych-content");

        if (jsPsychContent) {
          jsPsychContent.appendChild(continueButtonDiv);
        } else {
          document.body.appendChild(continueButtonDiv);
        }

        let videoCount = 0;

        // Add a click event listener to the overlay
        if (overlay && cross) {
          overlay.addEventListener("click", function () {
            if (videoCount > 0) {
              return;
            }

            // Hide the overlay
            setTimeout(() => {
              overlay.style.opacity = "0";
              setTimeout(() => {
                if (video && video instanceof HTMLVideoElement) {
                  video.play().catch((err) => {
                    console.error("Error playing video:", err);
                  });
                }
              }, 550);
            }, 1400);

            videoCount++;
          });

          // Add an event listener to show the overlay when the video ends
          if (video && video instanceof HTMLVideoElement) {
            video.addEventListener("ended", () => {
              // Show the overlay again
              overlay.style.display = "flex"; // Set it back to flex to maintain centering
              overlay.style.opacity = "1";
              cross.style.display = "none";
              video.style.display = "none";
              continueButton.style.display = "flex";
            });
          }
        }

        continueButton.addEventListener("click", () => {
          jsPsych.finishTrial();
          continueButton.remove();
        });
      },
    };
  };

  const videoCheckWithButtons = (
    filepath: string,
    mediaCode: string,
    mediaType: string,
    emotionChoices: string[],
    correctAnswer: string
  ) => {
    let finalResponse:string = ""
    return {
      type: HtmlButtonResponse,
      stimulus: function () {
        return videoCoverHtmlGenerator(filepath);
      },
      choices: emotionChoices,
      button_html: (choice: string) => {
        return `<div name='custom-button-div' data-toggle="buttons" style="padding:10px; display:none; justify-content: center; align-items: center;  width: 100%"><button name="custom-button" type="button" class="btn btn-primary" style="width:100%">${choice}</button></div>`;
      },
      correct_answer: correctAnswer,

      prompt: `<p>${i18n.t("videoEmotionSelection")}</p>`,
      response_ends_trial: false,
      response_allowed_while_playing: true,

      on_load: () => {
        addBootstrapScripts();

        const video = document.getElementById("video");
        const overlay = document.getElementById("overlay");
        const cross = document.getElementById("overlay-cross");
        

        const continueButton = addContinueButton();
        const continueButtonDiv = createContinueButtonDiv(continueButton);
        const jsPsychContent = document.getElementById("jspsych-content");

        const buttonResponseContainer = document.getElementById("jspsych-html-button-response-stimulus")

        if (jsPsychContent) {
          jsPsychContent.appendChild(continueButtonDiv);
        } else {
          document.body.appendChild(continueButtonDiv);
        }

        if(buttonResponseContainer && buttonResponseContainer instanceof HTMLElement) {
          buttonResponseContainer.style.display = "flex"
          buttonResponseContainer.style.justifyContent = "center"
          buttonResponseContainer.style.alignItems = "center"
        }

        let videoCount = false;
        let start_time = 0;

        // Add a click event listener to the overlay
        if (overlay && cross) {
          overlay.addEventListener("click", function () {
            if (videoCount) {
              return;
            }
            // Hide the overlay
            setTimeout(() => {
              overlay.style.opacity = "0";
              setTimeout(() => {
                if (video && video instanceof HTMLVideoElement) {
                  video.play().catch((err) => {
                    console.error("Error playing video:", err);
                  });
                }
              }, 550);
            }, 1400);

            videoCount = true;
          });

          // Add an event listener to show the overlay when the video ends
          if (video && video instanceof HTMLVideoElement) {
            video.addEventListener("ended", () => {
              // Show the overlay again
              overlay.style.opacity = "1";
              cross.style.display = "none";
              video.style.display = "none";

              revealEmotionButtons();

              //reveal continue button
              continueButton.style.display = "block";

              //set start time
              start_time = performance.now();
            });
          }
        }

        const buttonSelections = document.querySelectorAll(
          'button[name="custom-button"]'
        );

        buttonSelections.forEach((button) => {
          button.addEventListener("click", (e) => {
            if (e.target instanceof HTMLButtonElement && e.target === button) {
              const val = button.innerHTML;
              finalResponse = val;
            }
          });
        });

        continueButton.addEventListener("click", () => {
          if (!finalResponse) {
            alert(i18n.t("buttonSelectionWarning"));
            return;
          }
          jsPsych.finishTrial({
            rt: performance.now() - start_time,
            response: finalResponse,
          });
          continueButton.remove();
          buttonSelections.forEach((button) => {
            button.removeEventListener("click", (e) => {
              if (e.target instanceof HTMLButtonElement && e.target === button) {
                const val = button.innerHTML;
                finalResponse = val;
              }});
            });
        });
      },
      on_finish: function(data: any) {
        if(finalResponse){
          data.correctResponse = (finalResponse === correctAnswer)
          data.selectedResponse = finalResponse
          data.mediaFileType =  mediaType
          data.itemCode = mediaCode 
          data.trial_type = "emotionChoice"
        }
      
      }
    };
  };

  timeline.push(preload);
  timeline.push(taskInstructions);
  timeline.push(videoInstructions);
  for (const [key, videoInfo] of Object.entries(mediaData.Content.VideoAndAudio)) {
    timeline.push(videoCheck(videoInfo.Filepath));
    const { emotions: translatedEmotions, correctAnswer } = getTranslatedEmotions(videoInfo);
    timeline.push(
      videoCheckWithButtons(
        videoInfo.Filepath,
        key,
        "VideoAndAudio",
        translatedEmotions,
        correctAnswer
      )
    );
  }
  timeline.push(videoInstructions);
  for (const [key, videoInfo] of Object.entries(mediaData.Content.Video)) {
    timeline.push(videoCheck(videoInfo.Filepath));
    const { emotions: translatedEmotions, correctAnswer } = getTranslatedEmotions(videoInfo);
    timeline.push(
      videoCheckWithButtons(
        videoInfo.Filepath,
        key,
        "Video",
        translatedEmotions,
        correctAnswer
      )
    );
  }
  timeline.push(audioInstructions);
  for (const [key, audioInfo] of Object.entries(mediaData.Content.Audio)) {
    timeline.push(audioHtmlTask(audioInfo.Filepath));
    const { emotions: translatedEmotions, correctAnswer } = getTranslatedEmotions(audioInfo);
    timeline.push(
      audioHtmlEmotionChoice(
        audioInfo.Filepath,
        key,
        "Audio",
        translatedEmotions,
        correctAnswer
      )
    );
  }
  const jsPsych = initJsPsych({
    timeline: timeline, 
    on_finish: function(){
      const filteredData = jsPsych.data.get().filter({trial_type:'emotionChoice'})
      console.log(filteredData)
    }
  });


  
  
  jsPsych.run(timeline);


  function simulateKeyPress(jsPsych: JsPsych, key: string) {
    jsPsych.pluginAPI.keyDown(key);
    jsPsych.pluginAPI.keyUp(key);
  }
  function translate(emotion: string){
    try{
      const translation = i18n.t(`emotions.${emotion}`)
      return translation
    }catch (error) {
      console.error(`Translation error for emotion "${emotion}":`, error)
      return emotion;
    }
  }

  function getTranslatedEmotions(mediaInfo: { Emotions: string[], CorrectAnswer: string }) {
    return {
      emotions: mediaInfo.Emotions.map(translate),
      correctAnswer: translate(mediaInfo.CorrectAnswer)
    };
  }
}
