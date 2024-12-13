import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import HtmlButtonResponse from '@jspsych/plugin-html-button-response';
import PreloadPlugin from "@jspsych/plugin-preload";
import { JsPsych } from "/runtime/v1/jspsych@8.x";
import { addBootstrapScripts, addContinueButton, createContinueButtonDiv, revealEmotionButtons } from "./helperFunctions";
import * as mediaData from  '../src/mediaContentData.json'

const jsPsych = initJsPsych();

/* create timeline */

export default function emotionRecognitionTask() {

  const videoCoverHtmlGenerator = (filepath:string) => {
    return `
      <style>
      /* Style for the video container */
      .video-container {
        position: relative;
        width: 50vw;
        height: 40vh;
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
        transition: .5s ease;
      }

      /* The video element */
      video {
        position: absolute;
        object-fit: cover;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .spacedButtons {
              padding: 10px
            }
    </style>
    <div class="video-container">
        <div class="video-overlay" id="overlay">
          <svg id="overlay-cross" height="100" width="100" xmlns="http://www.w3.org/2000/svg">
            <line x1="50" y1="0" x2="50" y2="100" style="stroke:white;stroke-width:18" />
            <line x1="0" y1="50" x2="100" y2="50" style="stroke:white;stroke-width:18" />
            Sorry, your browser does not support inline SVG.
          </svg>
        </div>
        <video id="video" preload="auto" src=${filepath}>
        </video>
        
    </div>
    `;
  }
  
  

  const audioHtmlGenerator = (filepath:string) => {
    return ` 
      <svg id="audioIcon" xmlns="http://www.w3.org/2000/svg" style="align-content: center;" version="1.0" width="200" height="200" viewBox="10 0 45 120">
            <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style="stroke:#111;stroke-width:5;stroke-linejoin:round;fill:#111;"/>
            <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style="fill:none;stroke:#111;stroke-width:5;stroke-linecap:round"/>
        </svg>
        <audio id="audioContent" preload="auto">
            <source src=${filepath} type="audio/mpeg">
        </audio>
          `;
  } 


  const clickHandler = () => { document.addEventListener(
    "click",
    () => simulateKeyPress(jsPsych, "a"),
    { once: true },
  )};


  const timeline = [];

  const preload = {
    type: PreloadPlugin,
    auto_preload: true,
    show_progress_bar: true,
    message: `<p>loading media</p>`,
  };

  const instructions = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `<p>Hello this is a test. The audio will play twice. please select the most accurate emotion displayed after</p>`,
    on_load: function () {
      document.addEventListener('click', clickHandler)
    },
    on_finish: function () {
      document.removeEventListener('click', clickHandler)
    }
  };

  const audioHtmlTask = (filepath: string) => {
    return {
      type: HtmlKeyboardResponsePlugin,
      stimulus: function() {
        return audioHtmlGenerator(filepath)
      },
      prompt: "<p>Click on the sound icon to play audio</p>",
      
      response_allowed_while_playing: false,
      response_ends_trial: false,

      on_load: () => {
        addBootstrapScripts()

        let playOnce = false;
        const audioIcon = document.getElementById("audioIcon")
        const audioContent = document.getElementById("audioContent")

        const continueButton = addContinueButton()
        const continueButtonDiv = createContinueButtonDiv(continueButton)
        const jsPsychContent = document.getElementById('jspsych-content')
        
        if(jsPsychContent){
          jsPsychContent.appendChild(continueButtonDiv)
        }
        else {
          document.body.appendChild(continueButtonDiv)
        }
        

        if(audioIcon){
          audioIcon.addEventListener("click", () => {
            if(audioContent && audioContent instanceof HTMLAudioElement && !playOnce){
              audioContent.play()
              playOnce = true
            }

          })
        }

        if(audioContent && audioContent instanceof HTMLAudioElement){
          audioContent.addEventListener('ended', () => {
            continueButton.style.display = 'flex'
          }

          )
        }

        continueButton.addEventListener("click", () => {
          jsPsych.finishTrial();
          continueButton.remove()
        })

      }

    }
    

  };

  const audioHtmlEmotionChoice = (filepath: string, emotionChoices: string[], correctAnswer: string) => {
    return {
      type: HtmlButtonResponse,
      stimulus: function() {
        return audioHtmlGenerator(filepath)
      },
      choices: emotionChoices,
      button_html: (choice: string) => {
        return `<div name='custom-button-div' data-toggle="buttons" style="padding:10px;  display:none; justify-content: center; align-items: center;  width: 100%"><button name="custom-button" type="button" class="btn btn-primary" style="width:100%">${choice}</button></div>`;
      },
      prompt: "<p>Select the most accurate emotion </p>",
      
      response_allowed_while_playing: false,
      correct_answer: correctAnswer,
      response_ends_trial: false,

      on_load: () => {
        addBootstrapScripts()

        let playOnce = false;
        const audioIcon = document.getElementById("audioIcon")
        const audioContent = document.getElementById("audioContent")

        let response: string = "";
        let start_time = 0;

        const continueButton = addContinueButton()
        const continueButtonDiv = createContinueButtonDiv(continueButton)
        const jsPsychContent = document.getElementById('jspsych-content')
        
        if(jsPsychContent){
          jsPsychContent.appendChild(continueButtonDiv)
        }
        else {
          document.body.appendChild(continueButtonDiv)
        }
        

        if(audioIcon){
          audioIcon.addEventListener("click", () => {
            if(audioContent && audioContent instanceof HTMLAudioElement && !playOnce){
              audioContent.play()
              playOnce = true
            }

          })
        }

        if(audioContent && audioContent instanceof HTMLAudioElement){
          audioContent.addEventListener('ended', () => {
            revealEmotionButtons()
            continueButton.style.display = 'flex'


            //set start time
            start_time = performance.now();
          }

          )
        }

        const buttonSelections = document.querySelectorAll('button[name="custom-button"]')

        buttonSelections.forEach((button) => {
          button.addEventListener('click', (e) => {
            if(e.target instanceof HTMLButtonElement && e.target === button){
              const val = button.innerHTML;
              response = val
            }
            
          })
        })
        continueButton.addEventListener("click", () => {
  
          if(!response){
            alert("Please select a button")
            return
          }
          jsPsych.finishTrial({rt: (performance.now() - start_time), response: response});
          continueButton.remove()
        })

      }
    }
    
  };

  const videoInstructions = {
      type: HtmlKeyboardResponsePlugin,
      stimulus: `<p>Now onto video tasks, the video will be played twice for the subject to determine the emotion displayed.  Press any key to continue to the videos</p>`,
      on_load: function () {
        document.addEventListener('click', clickHandler)
      },
      on_finish: function () {
        document.removeEventListener('click', clickHandler)
      }
    };

    const videoCheck = (filepath: string) => {
      return {
        type: HtmlKeyboardResponsePlugin,
        stimulus: function() {
          return videoCoverHtmlGenerator(filepath)
        },
        prompt: "<p>Please press the continue button after the video has completed</p>",
        response_ends_trial: false,
        response_allowed_while_playing: false,
        on_load: () => {
      
          addBootstrapScripts()
          
          // Get references to the video and overlay elements
          const video = document.getElementById("video");
          const overlay = document.getElementById("overlay");
          const cross = document.getElementById("overlay-cross")

          const continueButton = addContinueButton()
          const continueButtonDiv = createContinueButtonDiv(continueButton)
          const jsPsychContent = document.getElementById('jspsych-content')
          
          if(jsPsychContent){
            jsPsychContent.appendChild(continueButtonDiv)
          }
          else {
            document.body.appendChild(continueButtonDiv)
          }

          let videoCount = 0

        // Add a click event listener to the overlay
          if(overlay && cross){
          overlay.addEventListener("click", function() {
            if(videoCount > 0){
              return
            }
            

            // Hide the overlay
            setTimeout(() => {
              overlay.style.opacity = "0";
              setTimeout(() => {
                if(video && video instanceof HTMLVideoElement){
                  video.play().catch((err) => {
                    console.error("Error playing video:", err);
                  });
                }
                
              }, 550);
            }, 1400)

            videoCount++
          });

          // Add an event listener to show the overlay when the video ends
          if (video && video instanceof HTMLVideoElement) {
            video.addEventListener("ended", function() {
          // Show the overlay again
            overlay.style.display = "flex"; // Set it back to flex to maintain centering
            overlay.style.opacity = "1"
            cross.style.display = "none"
            video.style.display = "none"
            continueButton.style.display = "flex"
            });
          }

        }

        continueButton.addEventListener("click", () => {
          jsPsych.finishTrial();
          continueButton.remove()
        })
        
        },
      }
    
  };


  const videoCheckWithButtons = (filepath: string, emotionChoices: string[], correctAnswer: string) => {
    return {
      type: HtmlButtonResponse,
      stimulus: function() {
        return videoCoverHtmlGenerator(filepath)
      },
      choices: emotionChoices,
      button_html: (choice: string) => {
        return `<div name='custom-button-div' data-toggle="buttons" style="padding:10px; display:none; justify-content: center; align-items: center;  width: 100%"><button name="custom-button" type="button" class="btn btn-primary" style="width:100%">${choice}</button></div>`;
      },
      correct_answer: correctAnswer,

      prompt: `<p>Once the video completes and the emotion selection displays. Please select the most accurate emotion displayed.
      <br>Once you are satisfied with your answer press the "Continue" button</p>`,
      response_ends_trial: false,
      response_allowed_while_playing: true,
      
      
      on_load: () => {
        addBootstrapScripts()
        
        const video = document.getElementById("video");
        const overlay = document.getElementById("overlay");
        const cross = document.getElementById("overlay-cross")

        const continueButton = addContinueButton()
        const continueButtonDiv = createContinueButtonDiv(continueButton)
        const jsPsychContent = document.getElementById('jspsych-content')
        
        if(jsPsychContent){
          jsPsychContent.appendChild(continueButtonDiv)
        }
        else {
          document.body.appendChild(continueButtonDiv)
        }

        let videoCount = false
        let start_time = 0

        let response: string = "";

      // Add a click event listener to the overlay
        if(overlay && cross){
        overlay.addEventListener("click", function() {
          if(videoCount){
            return
          }
          // Hide the overlay
          setTimeout(() => {
            overlay.style.opacity = "0";
            setTimeout(() => {
              if(video && video instanceof HTMLVideoElement){
                video.play().catch((err) => {
                  console.error("Error playing video:", err);
                });
              }
              
            }, 550);
          }, 1400)

          videoCount = true
        });

        // Add an event listener to show the overlay when the video ends
        if (video && video instanceof HTMLVideoElement) {
          video.addEventListener("ended", function() {
          
          // Show the overlay again
          overlay.style.opacity = "1"
          cross.style.display = "none"
          video.style.display = "none"

          revealEmotionButtons()

          //reveal continue button
          continueButton.style.display = "block"

          //set start time
          start_time = performance.now();

          });
        } 
        }

        const buttonSelections = document.querySelectorAll('button[name="custom-button"]')

        buttonSelections.forEach((button) => {
          button.addEventListener('click', (e) => {
            if(e.target instanceof HTMLButtonElement && e.target === button){
              const val = button.innerHTML;
              response = val
            }
          })
        })
        
        continueButton.addEventListener("click", () => {

          if(!response){
            alert("Please select a button")
            return
          }
          jsPsych.finishTrial({rt: (performance.now() - start_time), response: response});
          continueButton.remove()
        })
      },
    }
    
  };

  timeline.push(preload);
  timeline.push(instructions);
  timeline.push(audioHtmlTask(mediaData.Content.Audio.Filepath))
  timeline.push(audioHtmlEmotionChoice(mediaData.Content.Audio.Filepath,mediaData.Content.Audio.Emotions,mediaData.Content.Audio.CorrectAnswer))
  timeline.push(videoInstructions);
  timeline.push(videoCheck(mediaData.Content.Video.Filepath));
  timeline.push(videoCheckWithButtons(mediaData.Content.Audio.Filepath,mediaData.Content.Video.Emotions,mediaData.Content.Video.CorrectAnswer));
  jsPsych.run(timeline);

  function simulateKeyPress(jsPsych: JsPsych, key: string) {
    jsPsych.pluginAPI.keyDown(key);
    jsPsych.pluginAPI.keyUp(key);
  }

}
