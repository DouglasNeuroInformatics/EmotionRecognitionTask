import { createI18Next } from "/runtime/v1/@opendatacapture/runtime-core";

document.documentElement.setAttribute("lang", "en");

const i18n = createI18Next({
  translations: {
    welcome: {
      en: "Welcome. Press any key to begin",
      fr: "Bienvenue. Appuyez sur n'importe quelle touche pour commencer",
    },
    correctResponse: {
      en: "Correct response:",
      fr: "La réponse correcte est:",
    },
    loadingStimulus: {
      en: "Loading stimulus",
      fr: "Stimulus de chargement",
    },
    audioInstructions: {
      en: `Hello this is a test. The audio will play twice. please select the most accurate emotion displayed after.`,
      fr: `Bonjour, c'est un test. L'audio sera joué deux fois. veuillez sélectionner l'émotion la plus précise affichée après.`
    },
    initialAudioTask: {
      en: "Click on the sound icon to play audio.",
      fr: "Cliquez sur l'icône du son pour écouter l'audio."
    },
    audioEmotionSelection: {
      en: "Select the most accurate emotion.",
      fr: "Sélectionnez l'émotion la plus précise."
    },
    videoTaskInstructions: {
      en: "Now onto video tasks, the video will be played twice for the subject to determine the emotion displayed.  Press any key to continue to the videos",
      fr: "Passons maintenant aux tâches vidéo, la vidéo sera lue deux fois pour que le sujet détermine l'émotion affichée.  Appuyez sur n'importe quelle touche pour continuer avec les vidéos."
    },
    initialVideoTask: {
      en: 'Please press the "continue" button after the video has completed',
      fr: `Veuillez appuyer sur le bouton "Continuer" une fois la vidéo terminée`
    },
    videoEmotionSelection: {
      en: `Once the video completes and the emotion selection displays. Please select the most accurate emotion displayed.
      <br>Once you are satisfied with your answer press the "Continue" button`,
      fr: `Une fois la vidéo terminée et la sélection d'émotions s'affiche. Veuillez sélectionner l'émotion affichée la plus précise.
      <br>Une fois que vous êtes satisfait de votre réponse, appuyez sur le bouton "Continuer".`
    },
    buttonSelectionWarning: {
      en: `Please select a button`,
      fr: `Veuillez sélectionner un bouton`
    }


  },
});
// the whole i18n implementation needs to be changed
document.addEventListener("changeLanguage", function (event) {
  // @ts-expect-error the event does have a detail
  document.documentElement.setAttribute("lang", event.detail as string);
});
export default i18n;