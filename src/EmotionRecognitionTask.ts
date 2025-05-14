import {
  addBootstrapScripts,
  addContinueButton,
  addInstructionContinueButton,
  audioHtmlGenerator,
  createContinueButtonDiv,
  createExamplePromptDiv,
  createWarningText,
  revealEmotionButtons,
  videoCoverHtmlGenerator
} from './helperFunctions.ts';
import { OdcMediaContent } from './ODCMediaContent.ts';

import { translator } from './translations.ts';
import { experimentSettingsJson } from './experimentSettings.ts';
import { $Settings } from './schemas.ts';
import type { EmotionRecognitionTask } from './schemas.ts';
import { transformAndExportJson, downloadJson, transformAndDownload } from './dataMunger.ts';

type EmotionRecognitionTaskResult = {
  version: string;
  timestamp: string;
  experimentResult: EmotionRecognitionTask[];
};

export default async function emotionRecognitionTask(onFinish?: (data: EmotionRecognitionTaskResult) => void) {
  translator.init();
  const { initJsPsych } = await import('/runtime/v1/jspsych@8.x/index.js');
  type JsPsych = import('/runtime/v1/jspsych@8.x/index.js').JsPsych;
  const { HtmlKeyboardResponsePlugin } = await import('/runtime/v1/@jspsych/plugin-html-keyboard-response@2.x/index.js');
  const { HtmlButtonResponsePlugin } = await import('/runtime/v1/@jspsych/plugin-html-button-response@2.x/index.js');
  const { PreloadPlugin } = await import('/runtime/v1/@jspsych/plugin-preload@2.x/index.js');

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

  const language = translator.resolvedLanguage.toString()

 
  // needed to set the language of the experiment later
  document.addEventListener('changeLanguage', function (event) {
    // @ts-expect-error the event does have a detail
    document.documentElement.setAttribute('lang', event.detail as string);
  });

  const timeline = [];

  const preload = {
    type: PreloadPlugin,
    auto_preload: true,
    show_progress_bar: true,
    message: `<p> ${translator.t('loadingStimulus')}</p>`
  };

  const taskInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: function () {
      return ` 
      <h3 classname="guidelines" style="color:red;"> ${translator.t('guidelines')} </h3>
      <p style="text-align:center; justify-content:center; font-size: 20px">${translator.t('initialInstructions')}</p>`;
    },
    on_load: function () {
      addBootstrapScripts();
      const continueButton = addInstructionContinueButton();
      const continueButtonDiv = createContinueButtonDiv(continueButton);

      const jsPsychContent = document.getElementById('jspsych-content');

      if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
        jsPsychContent.appendChild(continueButtonDiv);
      } else {
        document.body.appendChild(continueButtonDiv);
      }

      continueButton.addEventListener('click', () => {
        
        jsPsych.finishTrial();
        continueButton.remove();
      });
    }
  };

  const audioInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p style="text-align:center; justify-content:center; font-size: 20px">${translator.t('audioInstructions')}</p>`,
    on_load: function () {
      addBootstrapScripts();
      const continueButton = addInstructionContinueButton();
      const continueButtonDiv = createContinueButtonDiv(continueButton);
      continueButton.style.display = 'flex';

      const jsPsychContent = document.getElementById('jspsych-content');

      if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
        jsPsychContent.appendChild(continueButtonDiv);
      } else {
        document.body.appendChild(continueButtonDiv);
      }

      continueButton.addEventListener('click', () => {
        
        jsPsych.finishTrial();
        continueButton.remove();
      });
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

        const keyboardResponseContainer = document.getElementById('jspsych-html-keyboard-response-stimulus');

        if (keyboardResponseContainer && keyboardResponseContainer instanceof HTMLElement) {
          keyboardResponseContainer.style.display = 'flex';
          keyboardResponseContainer.style.justifyContent = 'center';
          keyboardResponseContainer.style.alignItems = 'center';
        }

        if (audioIcon && audioContent && audioContent instanceof HTMLAudioElement) {
          audioIcon.addEventListener('click', () => {
            if ( !playOnce) {
              audioContent.play();
              audioIcon.style.borderStyle = 'outset'
              playOnce = true;
            }
          });
          audioContent.addEventListener('ended', () => {
            audioIcon.style.borderStyle = 'none'
          })
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
    correctAnswer: string,
    isExample?: boolean
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
        const warningText = createWarningText(translator.t('buttonSelectionWarning'))
        const examplePrompt = createExamplePromptDiv(translator.t('examplePrompt'));
        const jsPsychContent = document.getElementById('jspsych-content');

        if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
          jsPsychContent.appendChild(continueButtonDiv);
          jsPsychContent.appendChild(warningText);
          if(isExample){
            jsPsychContent.appendChild(examplePrompt);
          } 
        } else {
          document.body.appendChild(continueButtonDiv);
          document.body.appendChild(warningText);
          if(isExample){
            document.body.appendChild(examplePrompt);
          } 
        }

        const buttonResponseContainer = document.getElementById('jspsych-html-button-response-stimulus');

        if (buttonResponseContainer && buttonResponseContainer instanceof HTMLElement) {
          buttonResponseContainer.style.display = 'flex';
          buttonResponseContainer.style.justifyContent = 'center';
          buttonResponseContainer.style.alignItems = 'center';
        }

        if (audioIcon && audioContent && audioContent instanceof HTMLAudioElement) {
          audioIcon.addEventListener('click', () => {
            if ( !playOnce) {
              audioContent.play();
              audioIcon.style.borderStyle = 'outset'
              playOnce = true;
            }
          });
          audioContent.addEventListener('ended', () => {
            audioIcon.style.borderStyle = 'none'
          })
        }

        if (audioContent && audioContent instanceof HTMLAudioElement) {
          audioContent.addEventListener('ended', () => {
            revealEmotionButtons();

            examplePrompt.style.display = 'flex';
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
              buttonSelections.forEach((btn) => btn.classList.remove('active'));
              // Add active class to the clicked button
              e.target.classList.add('active');
            }
          });
        });
        continueButton.addEventListener('click', () => {
          if (!finalResponse) {
            warningText.style.display = 'flex'
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
          data.trialType = !isExample ? 'emotionChoice' : '';
          data.language = language as string;
        }
      }
    };
  };

  const videoInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p style="text-align:center; justify-content:center; font-size: 20px">${translator.t('videoTaskInstructions')}</p>`,
    on_load: function () {
      addBootstrapScripts();
      const continueButton = addInstructionContinueButton();
      const continueButtonDiv = createContinueButtonDiv(continueButton);
      continueButton.style.display = 'flex';

      const jsPsychContent = document.getElementById('jspsych-content');

      if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
        jsPsychContent.appendChild(continueButtonDiv);
      } else {
        document.body.appendChild(continueButtonDiv);
      }

      continueButton.addEventListener('click', () => {
        
        jsPsych.finishTrial();
        continueButton.remove();
      });
    }
  };

  const audioVisualInstructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p style="text-align:center; justify-content:center; font-size: 20px">${translator.t('audioVisualTaskInstructions')}</p>`,
    on_load: function () {
      addBootstrapScripts();
      const continueButton = addInstructionContinueButton();
      const continueButtonDiv = createContinueButtonDiv(continueButton);

      const jsPsychContent = document.getElementById('jspsych-content');

      if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
        jsPsychContent.appendChild(continueButtonDiv);
      } else {
        document.body.appendChild(continueButtonDiv);
      }

      continueButton.addEventListener('click', () => {
        
        jsPsych.finishTrial();
        continueButton.remove();
      });
    }
  };

  const videoCheck = (filepath: string, top?: string, left?: string) => {
    return {
      type: HtmlKeyboardResponsePlugin,
      stimulus: function () {
        return videoCoverHtmlGenerator(filepath, top, left);
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

        const keyboardResponseContainer = document.getElementById('jspsych-html-keyboard-response-stimulus');

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
    correctAnswer: string,
    top?: string,
    left?: string,
    isExample?: boolean
  ) => {
    let finalResponse: string = '';
    return {
      type: HtmlButtonResponsePlugin,
      stimulus: function () {
        return videoCoverHtmlGenerator(filepath, top, left);
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

        const examplePrompt = createExamplePromptDiv(translator.t('examplePrompt'));
        const continueButton = addContinueButton();
        const warningText = createWarningText(translator.t('buttonSelectionWarning'))
        const continueButtonDiv = createContinueButtonDiv(continueButton);
        const jsPsychContent = document.getElementById('jspsych-content');

        if (jsPsychContent && jsPsychContent instanceof HTMLElement) {
          jsPsychContent.appendChild(continueButtonDiv);
          jsPsychContent.appendChild(warningText);
          if(isExample){
            jsPsychContent.appendChild(examplePrompt);
          } 
        } else {
          document.body.appendChild(continueButtonDiv);
          document.body.appendChild(warningText);
          if(isExample){
            document.body.appendChild(examplePrompt);
          } 
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
              examplePrompt.style.display = 'block';
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
              buttonSelections.forEach((btn) => btn.classList.remove('active'));
              // Add active class to the clicked button
              e.target.classList.add('active');
            }
          });
        });

        continueButton.addEventListener('click', () => {
          if (!finalResponse) {
            warningText.style.display = 'flex';
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
          data.trialType = !isExample ? 'emotionChoice' : '';
          data.language = language as string;
        }
      }
    };
  };

  timeline.push(preload);
  timeline.push(taskInstructions);
  
  //audio video section
  timeline.push(audioVisualInstructions);

  timeline.push(
    videoCheck(
      OdcMediaContent.Content.exampleAudioVideo['05rel_Gemep'].Filepath,
      OdcMediaContent.Content.exampleAudioVideo['05rel_Gemep'].top,
      OdcMediaContent.Content.exampleAudioVideo['05rel_Gemep'].left
    )
  );
  const { emotions: translatedEmotionsAudioVideo, correctAnswer: correctAnswerAudioVideo } = getTranslatedEmotions(
    OdcMediaContent.Content.exampleAudioVideo['05rel_Gemep']
  );
  timeline.push(
    videoCheckWithButtons(
      OdcMediaContent.Content.exampleAudioVideo['05rel_Gemep'].Filepath,
      '05rel_Gemep',
      'VideoAndAudio',
      translatedEmotionsAudioVideo,
      correctAnswerAudioVideo,
      OdcMediaContent.Content.exampleAudioVideo['05rel_Gemep'].top,
      OdcMediaContent.Content.exampleAudioVideo['05rel_Gemep'].left,
      true
    )
  );

  for (const [key, videoInfo] of Object.entries(OdcMediaContent.Content.VideoAndAudio)) {
    timeline.push(videoCheck(videoInfo.Filepath, videoInfo.top, videoInfo.left));
    const { emotions: translatedEmotions, correctAnswer } = getTranslatedEmotions(videoInfo);
    timeline.push(
      videoCheckWithButtons(
        videoInfo.Filepath,
        key,
        'VideoAndAudio',
        translatedEmotions,
        correctAnswer,
        videoInfo.top,
        videoInfo.left,
        false
      )
    );
  }

  const orderChoice = Math.floor(Math.random() * 2)

  if(orderChoice === 0){
    createVideoTaskToTimeline()
    createAudioTaskToTimeline()
  }
  else {
    createAudioTaskToTimeline()
    createVideoTaskToTimeline()
    
  }

  const jsPsych = initJsPsych({
      timeline: timeline,
      on_finish: function () {
        try {
          const filteredData = jsPsych.data.get().filter({ trialType: 'emotionChoice' });
          if(onFinish)
          {
            onFinish(transformAndExportJson(filteredData))
          }
          else {
            const resultJson = transformAndExportJson(filteredData);
            transformAndDownload(filteredData);
            downloadJson(resultJson, resultJson.timestamp);
          }
          
        } catch (error) {
          console.error('Error collection Emotion Recognition Data:', error);
        }
      }
    });
 

  jsPsych.run(timeline);

  function translate(emotion: string) {
    try {
      const translation = translator.t(`emotions.${emotion}`);
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

  function createAudioTaskToTimeline() {
    //audio section
    timeline.push(audioInstructions);

    timeline.push(audioHtmlTask(OdcMediaContent.Content.exampleAudio['03fea_Gemep'].Filepath));
    const { emotions: translatedEmotionsAudio, correctAnswer: correctAnswerAudio } = getTranslatedEmotions(
      OdcMediaContent.Content.exampleAudio['03fea_Gemep']
    );
    timeline.push(
      audioHtmlEmotionChoice(
        OdcMediaContent.Content.exampleAudio['03fea_Gemep'].Filepath,
        '03fea_Gemep',
        'Audio',
        translatedEmotionsAudio,
        correctAnswerAudio,
        true
      )
    );

    for (const [key, audioInfo] of Object.entries(OdcMediaContent.Content.Audio)) {
      timeline.push(audioHtmlTask(audioInfo.Filepath));
      const { emotions: translatedEmotions, correctAnswer } = getTranslatedEmotions(audioInfo);
      timeline.push(audioHtmlEmotionChoice(audioInfo.Filepath, key, 'Audio', translatedEmotions, correctAnswer, false));
    }
 }

 function createVideoTaskToTimeline() {
   //video section
   timeline.push(videoInstructions);

   timeline.push(
     videoCheck(
       OdcMediaContent.Content.exampleVideo['02ang_Gemep-2'].Filepath,
       OdcMediaContent.Content.exampleVideo['02ang_Gemep-2'].top,
       OdcMediaContent.Content.exampleVideo['02ang_Gemep-2'].left
     )
   );
   const { emotions: translatedEmotionsVideo, correctAnswer: correctAnswerVideo } = getTranslatedEmotions(
     OdcMediaContent.Content.exampleVideo['02ang_Gemep-2']
   );
   timeline.push(
     videoCheckWithButtons(
       OdcMediaContent.Content.exampleVideo['02ang_Gemep-2'].Filepath,
       '02ang_Gemep-2',
       'Video',
       translatedEmotionsVideo,
       correctAnswerVideo,
       OdcMediaContent.Content.exampleVideo['02ang_Gemep-2'].top,
       OdcMediaContent.Content.exampleVideo['02ang_Gemep-2'].left,
       true
     )
   );

   for (const [key, videoInfo] of Object.entries(OdcMediaContent.Content.Video)) {
     timeline.push(videoCheck(videoInfo.Filepath, videoInfo.top, videoInfo.left));
     const { emotions: translatedEmotions, correctAnswer } = getTranslatedEmotions(videoInfo);
     timeline.push(
       videoCheckWithButtons(
         videoInfo.Filepath,
         key,
         'Video',
         translatedEmotions,
         correctAnswer,
         videoInfo.top,
         videoInfo.left,
         false
       )
     );
   }
  }
}
