import { i18n } from '@douglasneuroinformatics/libui/i18n';
import emotionTranslations from '../src/translations/emotionTaskTranslation.json'

document.documentElement.setAttribute("lang", "en");


declare module '@douglasneuroinformatics/libui/i18n' {
  export namespace UserConfig {
    export interface LanguageOptions {
      en: true;
      fr: true;
    }
    export interface Translations {
      emotionTaskTranslation: typeof emotionTranslations
    }
  }
}

i18n.init({
  translations: {
    emotionTaskTranslation: emotionTranslations
  }
});



export default i18n;