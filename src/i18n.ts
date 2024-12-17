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
    }
  },
});
// the whole i18n implementation needs to be changed
document.addEventListener("changeLanguage", function (event) {
  // @ts-expect-error the event does have a detail
  document.documentElement.setAttribute("lang", event.detail as string);
});
export default i18n;