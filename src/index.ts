import './style.css';
import emotionRecognitionTask from './EmotionRecognitionTask.ts';
import { experimentSettingsJson } from "./experimentSettings.ts";
import '/runtime/v1/jspsych@8.x/css/jspsych.css';
const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');
import { $EmotionRecognitionTaskResult, $Settings } from './schemas.ts';
import { translator } from './translations.ts';

export default defineInstrument({
  kind: "INTERACTIVE",
  language: ['en', 'fr'],
  tags: {
    en: ["interactive", "jsPsych", "EmotionRecognitionTask", "CERAM"],
    fr: ["interactif", "jsPsych", "EmotionRecognitionTask", "CERAM"]
  },


  internal: {
    edition: 1,
    name: 'CLINICAL_EMOTION_RECOGNITION_ASSESSMENT_IN_MULTIPLE_MODALITIES'
  },
  content: {
    async render(done) {
      const settingsParseResult = $Settings.safeParse(experimentSettingsJson);

      // parse settings
      if (!settingsParseResult.success) {
        throw new Error(`Validation error, check experiment settings: ${settingsParseResult.error.toString()}`)
      }
      translator.init();
      await emotionRecognitionTask(done);
    }
  },
  details: {
    description: {
      en: 'A task to decipher a subjects ability to interpret emotion displayed in audio and visual mediums. Developed by David Roper for Dr. Maxime Montembeault',
      fr: "Une tâche visant à déchiffrer la capacité d'un sujet à interpréter les émotions affichées dans des supports audio et visuels. Développé par David Roper pour le Dr Maxime Montembeault"
    } ,
    estimatedDuration: 20,
    instructions: {
      en: ['Please read the instruction presented within the task carefully'],
      fr: ['Veuillez lire attentivement les instructions présentées dans la tâche']
    },
    license: 'UNLICENSED',
    title: {
      en: 'Emotion Recognition Task',
      fr: 'Tâche de reconnaissance des émotions'
    }
  },
  measures: {
    version: {
      kind: "const",
      label: {
        "en": "Version",
        "fr": "Version"
      },
      ref: "version"
    },
    timestamp: {
      kind: "const",
      label: {
        "en": "Timestamp",
        "fr": "Horodatage"
      },
      ref: "timestamp"
    },
    experimentResult: {
      kind: "computed",
      label: {
        "en": "Experiment Results",
        "fr": "Resultats"
      },
      value: (data) => {
        const val = data.experimentResult || [];
        const formattedResults = val.map(info => ({
          "Correct response": info.correctResponse,
          "response": info.response,
          "Correct response collected": info.correctResponseSelected,
          "Form of media": info.mediaFileType,
          "response time": info.rt,
          "item code": info.itemCode,
          "language selected": info.language
        }));
        return JSON.stringify(formattedResults);
      }
      
    }
  },

  validationSchema: z.object({
    version: z.string(),
    timestamp: z.string(),
    experimentResult: z.array($EmotionRecognitionTaskResult)
  })
});