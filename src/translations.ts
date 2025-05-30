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




