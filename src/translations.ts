import { Translator } from "/runtime/v1/@opendatacapture/runtime-core";

export const translator = new Translator({
  translations: {
    welcome: {
      en: 'Welcome. Press any key to begin',
      fr: "Bienvenue. Appuyez sur n'importe quelle touche pour commencer"
    },
    correctResponse: {
      en: 'Correct response:',
      fr: 'La réponse correcte est:'
    },
    loadingStimulus: {
      en: 'Loading stimulus',
      fr: 'Stimulus de chargement'
    },
    guidelines: {
      en: `Guidelines:`,
      fr: `Directives:`
    },
    initialInstructions: {
      en: ` 
            This test measures your ability to recognize emotions. <br>

            Your task is to watch a series of videos <br> with image and sound, without sound, or without image, <br>  in which a person expresses an emotion. <br><br> 
            
            You will watch each extract twice.<br>  After the second viewing, you will have to choose the word that best corresponds <br> to the emotion expressed by the person. <br><br>
            
            Make sure your volume is high enough to hear the sounds.`,

      fr: `  

            Ce test mesure votre capacité à reconnaître les émotions. <br>

            Votre tâche consiste à visionner une série de vidéos <br> avec image et son, sans son, ou sans image, <br>  dans lesquelles une personne exprime une émotion. <br><br> 
            
            Vous visionnerez chaque extrait 2 fois. <br>  Après le second visionnement, vous devrez choisir le mot qui correspond <br> le mieux à l'émotion exprimée par la personne.<br><br>
            
            Assurez-vous que votre volume est suffisamment élevé pour entendre les sons.`
    },
    audioInstructions: {
      en: `Snippets <span style="color:red"> <b> without images </b> </span> will now be presented.<br>
 
      Please click on the icon to play the audio. <br>
      
      An example will be presented before the start of the test`,
      fr: `
      Des extraits <span style="color:red"> <b> sans image  </b> </span> seront maintenant présentés.<br>
 
      Veuillez cliquer sur l'icône afin de lancer l'extrait. <br>

      Un exemple vous sera présenté avant de débuter le test. `
    },
    videoTaskInstructions: {
      en: `Videos <span style="color:red"> <b> without sound </b> </span> will now be presented. <br>
 
            Please click on the video to launch it. <br>
            
            An example will be presented before the start of the test`,

      fr: ` Des vidéos <span style="color:red"> <b> sans son </b> </span> seront maintenant présentées. <br>
 
        Veuillez cliquer sur le vidéo pour le lancer. <br>
        
        Un exemple vous sera présenté avant de débuter le test.`
    },
    audioVisualTaskInstructions: {
      en: `The first block is about to begin. <br>

         Videos <span style="color:red"> <b> with image and sound </b> </span> will be presented. <br>
          
          Please click on the video to play it <br>
          
          An example will be presented before the start of the test`,
      fr: `Le premier bloc va commencer. <br>

          Des vidéos <span style="color:red"> <b> avec image et son  </b> </span> seront présentées. <br>
          
          Veuillez cliquer sur le vidéo pour le lancer. <br>
          
          Un exemple vous sera présenté avant de débuter le test.`
    },
    buttonSelectionWarning: {
      en: `* Please select a button`,
      fr: `* Veuillez sélectionner un bouton`
    },
    // Sound check and troubleshooting wording approved by the Montembeault lab (scope of work 2026-001).
    soundCheck: {
      title: {
        en: 'Sound check',
        fr: 'Vérification du son'
      },
      intro: {
        en: 'Before we begin, let’s make sure you can hear the sounds clearly.',
        fr: 'Avant de commencer, assurons-nous que vous entendez bien les sons.'
      },
      headphones: {
        en: 'If you have headphones, please put them on now.',
        fr: 'Si vous avez des écouteurs, veuillez les mettre maintenant.'
      },
      instructions: {
        en: 'Click the speaker icon to play a short voice recording. Adjust the volume on your computer, tablet, or headphones until the voice is clear and comfortable: not too quiet, not too loud. You can play the sound as many times as you need.',
        fr: 'Cliquez sur l’icône du haut-parleur pour écouter un court enregistrement de voix. Réglez le volume de votre ordinateur, de votre tablette ou de vos écouteurs jusqu’à ce que la voix soit claire et confortable : ni trop faible, ni trop forte. Vous pouvez écouter le son autant de fois que nécessaire.'
      },
      // TODO: French button labels not yet approved by the lab.
      continueButton: {
        en: 'Sounds good, continue',
        fr: 'Le son est bon, continuer'
      },
      cantHearButton: {
        en: 'I can’t hear anything',
        fr: 'Je n’entends rien'
      }
    },
    troubleshooting: {
      heading: {
        en: 'Can’t hear the sound?',
        fr: 'Vous n’entendez pas le son?'
      },
      intro: {
        en: 'Please check the following, then try playing the sound again:',
        fr: 'Veuillez vérifier les points suivants, puis essayez d’écouter le son à nouveau :'
      },
      mute: {
        en: 'Your device is not muted, and the volume is turned up.',
        fr: 'Votre appareil n’est pas en mode silencieux et le volume est monté.'
      },
      headphones: {
        en: 'If you are using headphones, they are fully plugged in or connected via Bluetooth.',
        fr: 'Si vous utilisez des écouteurs, ils sont bien branchés ou connectés par Bluetooth.'
      },
      outputDevice: {
        en: 'Sound is coming out of the right device (for example, headphones rather than the computer’s speakers).',
        fr: 'Le son sort du bon appareil (par exemple, les écouteurs plutôt que les haut-parleurs de l’ordinateur).'
      },
      otherApplication: {
        en: 'No other application is blocking sound.',
        fr: 'Aucune autre application ne bloque le son.'
      },
      contact: {
        en: 'If you still cannot hear anything, please contact the research team before continuing.',
        fr: 'Si vous n’entendez toujours rien, veuillez communiquer avec l’équipe de recherche avant de continuer.'
      },
      tryAgainButton: {
        en: 'Try again',
        fr: 'Réessayer'
      }
    },
    examplePrompt: {
      en: `Click on continue to start the test`,
      fr: `Cliquer sur "Continue" pour débuter le test.`
    },
    emotions: {
      Anger: {
        en: 'Anger',
        fr: 'Colère'
      },
      Fear: {
        en: 'Fear',
        fr: 'Peur'
      },
      Contempt: {
        en: 'Contempt',
        fr: 'Mépris'
      },
      Interest: {
        en: 'Interest',
        fr: 'Intérêt'
      },
      Joy: {
        en: 'Joy',
        fr: 'Joie'
      },
      Pride: {
        en: 'Pride',
        fr: 'Fierté'
      },
      Pleasure: {
        en: 'Pleasure',
        fr: 'Plaisir'
      },
      Relief: {
        en: 'Relief',
        fr: 'Soulagement'
      },
      Sadness: {
        en: 'Sadness',
        fr: 'Tristesse'
      },
      Disgust: {
        en: 'Disgust',
        fr: 'Dégoût'
      }
    }
  }
}  
)




