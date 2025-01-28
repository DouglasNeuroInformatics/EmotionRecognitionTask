import { initJsPsych } from '/runtime/v1/jspsych@8.x';
type JsPsych = import('/runtime/v1/jspsych@8.x/index.js').JsPsych;
const { HtmlKeyboardResponsePlugin } = await import(
  '/runtime/v1/@jspsych/plugin-html-keyboard-response@2.x'
);
const { HtmlButtonResponsePlugin } = await import(
  '/runtime/v1/@jspsych/plugin-html-button-response@2.x'
);
const { PreloadPlugin } = await import(
  "/runtime/v1/@jspsych/plugin-preload@2.x"
);
import {
  addBootstrapScripts,
  addContinueButton,
  audioHtmlGenerator,
  createContinueButtonDiv,
  revealEmotionButtons,
  videoCoverHtmlGenerator
} from './helperFunctions.ts';
import { OdcMediaContent } from './ODCMediaContent.ts';

import type { Language } from '@opendatacapture/runtime-v1/@opendatacapture/runtime-core/index.js';
import i18nSetUp from "./i18n.ts";
import { experimentSettingsJson } from './experimentSettings.ts';
import { $Settings } from './schemas.ts';
import { transformAndExportJson, downloadJson, transformAndDownload } from './dataMunger.ts';

export default async function emotionRecognitionTask() {
  type EmotionalTrialData = {
    correctResponse: string;
    correctResponseSelected: 1 | 0;
    mediaFileType: string;
    itemCode: string;
    trialType: string;
    rt?: number;
    language: string;
  };

  // parse settings
  const settingsParseResult = $Settings.safeParse(experimentSettingsJson);

  if (!settingsParseResult.success) {
    throw new Error(
      `validation error, check experiment settings \n error can be seen below: \n ${settingsParseResult.error}`
    );
  }

  const language = experimentSettingsJson.language as Language;

  const i18n = i18nSetUp();
  // needed to set the language of the experiment later
  document.addEventListener("changeLanguage", function (event) {
    // @ts-expect-error the event does have a detail
    document.documentElement.setAttribute("lang", event.detail as string);
  });

  const clickHandler = () => {
    document.addEventListener('click', () => simulateKeyPress(jsPsych, 'a'), {
      once: true
    });
  };

  const timeline = [];

  const preload = {
    type: PreloadPlugin,
    auto_preload: true,
    show_progress_bar: true,
    message: `<p> ${i18n.t('loadingStimulus')}</p>`
  };

  const taskInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function () {
      return ` 
      <h3 classname="guidelines" style="color:red;"> ${i18n.t('guidelines')} </h3>
      <p style="text-align:center; justify-content:center; font-size: 20px">${i18n.t('initialInstructions')}</p>`;
    },
    on_load: function () {
      document.addEventListener('click', clickHandler);
    },
    on_finish: function () {
      document.removeEventListener('click', clickHandler);
    }
  };

  const audioInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p style="text-align:center; justify-content:center; font-size: 20px">${i18n.t('audioInstructions')}</p>`,
    on_load: function () {
      document.addEventListener('click', clickHandler);
    },
    on_finish: function () {
      document.removeEventListener('click', clickHandler);
    }
  };

  const audioHtmlTask = (filepath: string) => {
    return {
      type: HtmlKeyboardResponsePlugin,
      stimulus: function () {
        return audioHtmlGenerator(filepath);
      },

      response_allowed_while_playing: false,
      response_ends_trial: false,

      on_load: () => {
        addBootstrapScripts();

        let playOnce = false;
        const audioIcon = document.getElementById('audioIcon');
        const audioContent = document.getElementById('audioContent');

        const continueButton = addContinueButton();
        const continueButtonDiv = createContinueButtonDiv(continueButton);
        const jsPsychContent = document.getElementById('jspsych-content');

        if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
          jsPsychContent.appendChild(continueButtonDiv);
        } else {
          document.body.appendChild(continueButtonDiv);
        }

        const keyboardResponseContainer = document.getElementById("jspsych-html-keyboard-response-stimulus");

        if (keyboardResponseContainer && keyboardResponseContainer instanceof HTMLElement) {
          keyboardResponseContainer.style.display = 'flex';
          keyboardResponseContainer.style.justifyContent = 'center';
          keyboardResponseContainer.style.alignItems = 'center';
        }

        if (audioIcon) {
          audioIcon.addEventListener('click', () => {
            if (audioContent && audioContent instanceof HTMLAudioElement && !playOnce) {
              audioContent.play();
              playOnce = true;
            }
          });
        }

        if (audioContent && audioContent instanceof HTMLAudioElement) {
          audioContent.addEventListener('ended', () => {
            continueButton.style.display = 'flex';
          });
        }

        continueButton.addEventListener('click', () => {
          jsPsych.finishTrial();
          continueButton.remove();
        });
      }
    };
  };

  const audioHtmlEmotionChoice = (
    filepath: string,
    mediaCode: string,
    mediaType: string,
    emotionChoices: string[],
    correctAnswer: string
  ) => {
    let finalResponse: string = '';
    return {
      type: HtmlButtonResponsePlugin,
      stimulus: function () {
        return audioHtmlGenerator(filepath);
      },
      choices: emotionChoices,
      button_html: (choice: string) => {
        return `<div name='custom-button-div' data-toggle="buttons" style="padding:10px;  display:none; justify-content: center; align-items: center;  width: 100%"><button name="custom-button" type="button" class="btn btn-primary" aria-label="emotionButtons" style="width:100%">${choice}</button></div>`;
      },

      response_allowed_while_playing: false,
      correct_answer: correctAnswer,
      response_ends_trial: false,

      on_load: () => {
        addBootstrapScripts();

        let playOnce = false;
        const audioIcon = document.getElementById('audioIcon');
        const audioContent = document.getElementById('audioContent');

        let start_time = 0;

        const continueButton = addContinueButton();
        const continueButtonDiv = createContinueButtonDiv(continueButton);
        const jsPsychContent = document.getElementById('jspsych-content');

        if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
          jsPsychContent.appendChild(continueButtonDiv);
        } else {
          document.body.appendChild(continueButtonDiv);
        }

        const buttonResponseContainer = document.getElementById('jspsych-html-button-response-stimulus');

        if (buttonResponseContainer && buttonResponseContainer instanceof HTMLElement) {
          buttonResponseContainer.style.display = 'flex';
          buttonResponseContainer.style.justifyContent = 'center';
          buttonResponseContainer.style.alignItems = 'center';
        }


        if (audioIcon) {
          audioIcon.addEventListener('click', () => {
            if (audioContent && audioContent instanceof HTMLAudioElement && !playOnce) {
              audioContent.play();
              playOnce = true;
            }
          });
        }

        if (audioContent && audioContent instanceof HTMLAudioElement) {
          audioContent.addEventListener('ended', () => {
            revealEmotionButtons();
            continueButton.style.display = 'flex';

            //set start time
            start_time = performance.now();
          });
        }

        const buttonSelections = document.querySelectorAll('button[name="custom-button"]');

        buttonSelections.forEach((button) => {
          button.addEventListener('click', (e) => {
            if (e.target instanceof HTMLButtonElement && e.target === button) {
              const val = button.innerHTML;
              finalResponse = val;
              buttonSelections.forEach(btn => btn.classList.remove('active'));
              // Add active class to the clicked button
              e.target.classList.add('active');
            }
          });
        });
        continueButton.addEventListener('click', () => {
          if (!finalResponse) {
            alert(i18n.t('buttonSelectionWarning'));
            return;
          }
          jsPsych.finishTrial({
            rt: performance.now() - start_time,
            response: finalResponse
          });
          continueButton.remove();
        });
      },
      on_finish: function (data: EmotionalTrialData) {
        if (finalResponse) {
          data.correctResponse = correctAnswer;
          data.correctResponseSelected = correctAnswer === finalResponse ? 1 : 0;
          data.mediaFileType = mediaType;
          data.itemCode = mediaCode;
          data.trialType = 'emotionChoice';
          data.language = language as string;
        }
      }
    };
  };

  const videoInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p style="text-align:center; justify-content:center; font-size: 20px">${i18n.t('videoTaskInstructions')}</p>`,
    on_load: function () {
      document.addEventListener('click', clickHandler);
    },
    on_finish: function () {
      document.removeEventListener('click', clickHandler);
    }
  };

  const audioVisualInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p style="text-align:center; justify-content:center; font-size: 20px">${i18n.t('audioVisualTaskInstructions')}</p>`,
    on_load: function () {
      document.addEventListener('click', clickHandler);
    },
    on_finish: function () {
      document.removeEventListener('click', clickHandler);
    }
  };

  const videoCheck = (filepath: string) => {
    return {
      type: HtmlKeyboardResponsePlugin,
      stimulus: function () {
        return videoCoverHtmlGenerator(filepath);
      },
      response_ends_trial: false,
      response_allowed_while_playing: false,
      on_load: () => {
        addBootstrapScripts();

        // Get references to the video and overlay elements
        const video = document.getElementById('video');
        const overlay = document.getElementById('overlay');
        const cross = document.getElementById('overlay-cross');

        const continueButton = addContinueButton();
        const continueButtonDiv = createContinueButtonDiv(continueButton);
        const jsPsychContent = document.getElementById('jspsych-content');

        if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
          jsPsychContent.appendChild(continueButtonDiv);
        } else {
          document.body.appendChild(continueButtonDiv);
        }

        const keyboardResponseContainer = document.getElementById("jspsych-html-keyboard-response-stimulus");

        if (keyboardResponseContainer && keyboardResponseContainer instanceof HTMLElement) {
          keyboardResponseContainer.style.display = 'flex';
          keyboardResponseContainer.style.justifyContent = 'center';
          keyboardResponseContainer.style.alignItems = 'center';
        }

        let videoCount = 0;

        // Add a click event listener to the overlay
        if (overlay && cross) {
          overlay.addEventListener('click', function () {
            if (videoCount > 0) {
              return;
            }

            // Hide the overlay
            setTimeout(() => {
              overlay.style.opacity = '0';
              setTimeout(() => {
                if (video && video instanceof HTMLVideoElement) {
                  video.play().catch((err) => {
                    console.error('Error playing video:', err);
                  });
                }
              }, 550);
            }, 1400);

            videoCount++;
          });

          // Add an event listener to show the overlay when the video ends
          if (video && video instanceof HTMLVideoElement) {
            video.addEventListener('ended', () => {
              // Show the overlay again
              overlay.style.display = 'flex'; // Set it back to flex to maintain centering
              overlay.style.opacity = '1';
              cross.style.display = 'none';
              video.style.display = 'none';
              continueButton.style.display = 'flex';
            });
          }
        }

        continueButton.addEventListener('click', () => {
          jsPsych.finishTrial();
          continueButton.remove();
        });
      }
    };
  };

  const videoCheckWithButtons = (
    filepath: string,
    mediaCode: string,
    mediaType: string,
    emotionChoices: string[],
    correctAnswer: string
  ) => {
    let finalResponse: string = '';
    return {
      type: HtmlButtonResponsePlugin,
      stimulus: function () {
        return videoCoverHtmlGenerator(filepath);
      },
      choices: emotionChoices,
      button_html: (choice: string) => {
        return `<div name='custom-button-div' data-toggle="buttons" style="padding:10px; display:none; justify-content: center; align-items: center;  width: 100%"><button name="custom-button" type="button" class="btn btn-primary" style="width:100%">${choice}</button></div>`;
      },
      correct_answer: correctAnswer,

      response_ends_trial: false,
      response_allowed_while_playing: true,

      on_load: () => {
        addBootstrapScripts();

        const video = document.getElementById('video');
        const overlay = document.getElementById('overlay');
        const cross = document.getElementById('overlay-cross');

        const continueButton = addContinueButton();
        const continueButtonDiv = createContinueButtonDiv(continueButton);
        const jsPsychContent = document.getElementById('jspsych-content');

        if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
          jsPsychContent.appendChild(continueButtonDiv);
        } else {
          document.body.appendChild(continueButtonDiv);
        }

        const buttonResponseContainer = document.getElementById('jspsych-html-button-response-stimulus');

        if (buttonResponseContainer && buttonResponseContainer instanceof HTMLElement) {
          buttonResponseContainer.style.display = 'flex';
          buttonResponseContainer.style.justifyContent = 'center';
          buttonResponseContainer.style.alignItems = 'center';
        }

        let videoCount = false;
        let start_time = 0;

        // Add a click event listener to the overlay
        if (overlay && cross) {
          overlay.addEventListener('click', function () {
            if (videoCount) {
              return;
            }
            // Hide the overlay
            setTimeout(() => {
              overlay.style.opacity = '0';
              setTimeout(() => {
                if (video && video instanceof HTMLVideoElement) {
                  video.play().catch((err) => {
                    console.error('Error playing video:', err);
                  });
                }
              }, 550);
            }, 1400);

            videoCount = true;
          });

          // Add an event listener to show the overlay when the video ends
          if (video && video instanceof HTMLVideoElement) {
            video.addEventListener('ended', () => {
              // Show the overlay again
              overlay.style.opacity = '1';
              cross.style.display = 'none';
              video.style.display = 'none';

              revealEmotionButtons();

              //reveal continue button
              continueButton.style.display = 'block';

              //set start time
              start_time = performance.now();
            });
          }
        }

        const buttonSelections = document.querySelectorAll('button[name="custom-button"]');

        buttonSelections.forEach((button) => {
          button.addEventListener('click', (e) => {
            if (e.target instanceof HTMLButtonElement && e.target === button) {
              const val = button.innerHTML;
              finalResponse = val;
              buttonSelections.forEach(btn => btn.classList.remove('active'));
              // Add active class to the clicked button
              e.target.classList.add('active');
            }
          });
        });

        continueButton.addEventListener('click', () => {
          if (!finalResponse) {
            alert(i18n.t('buttonSelectionWarning'));
            return;
          }
          jsPsych.finishTrial({
            rt: performance.now() - start_time,
            response: finalResponse
          });
          continueButton.remove();
          
        });
      },
      on_finish: function (data: EmotionalTrialData) {
        if (finalResponse) {
          data.correctResponse = correctAnswer;
          data.correctResponseSelected = correctAnswer === finalResponse ? 1 : 0;
          data.mediaFileType = mediaType;
          data.itemCode = mediaCode;
          data.trialType = 'emotionChoice';
          data.language = language as string;
        }
      }
    };
  };

  timeline.push(preload);
  timeline.push(taskInstructions);
  timeline.push(audioVisualInstructions);
  for (const [key, videoInfo] of Object.entries(OdcMediaContent.Content.VideoAndAudio)) {
    timeline.push(videoCheck(videoInfo.Filepath));
    const { emotions: translatedEmotions, correctAnswer } = getTranslatedEmotions(videoInfo);
    timeline.push(videoCheckWithButtons(videoInfo.Filepath, key, 'VideoAndAudio', translatedEmotions, correctAnswer));
  }
  timeline.push(videoInstructions);
  for (const [key, videoInfo] of Object.entries(OdcMediaContent.Content.Video)) {
    timeline.push(videoCheck(videoInfo.Filepath));
    const { emotions: translatedEmotions, correctAnswer } = getTranslatedEmotions(videoInfo);
    timeline.push(videoCheckWithButtons(videoInfo.Filepath, key, 'Video', translatedEmotions, correctAnswer));
  }
  timeline.push(audioInstructions);
  for (const [key, audioInfo] of Object.entries(OdcMediaContent.Content.Audio)) {
    timeline.push(audioHtmlTask(audioInfo.Filepath));
    const { emotions: translatedEmotions, correctAnswer } = getTranslatedEmotions(audioInfo);
    timeline.push(audioHtmlEmotionChoice(audioInfo.Filepath, key, 'Audio', translatedEmotions, correctAnswer));
  }
  const jsPsych = initJsPsych({
    timeline: timeline,
    on_finish: function () {
      try {
        const filteredData = jsPsych.data.get().filter({ trialType: 'emotionChoice' });
        const resultJson = transformAndExportJson(filteredData);
        transformAndDownload(filteredData);
        downloadJson(resultJson, resultJson.timestamp);
      } catch (error) {
        console.error('Error collection Emotion Recognition Data:', error);
      }
    }
  });

  jsPsych.run(timeline);

  function simulateKeyPress(jsPsych: JsPsych, key: string) {
    jsPsych.pluginAPI.keyDown(key);
    jsPsych.pluginAPI.keyUp(key);
  }
  function translate(emotion: string) {
    try {
      const translation = i18n.t(`emotions.${emotion}`);
      return translation;
    } catch (error) {
      console.error(`Translation error for emotion "${emotion}":`, error);
      return emotion;
    }
  }

  function getTranslatedEmotions(mediaInfo: { Emotions: string[]; CorrectAnswer: string }) {
    return {
      emotions: mediaInfo.Emotions.map(translate),
      correctAnswer: translate(mediaInfo.CorrectAnswer)
    };
  }
}
