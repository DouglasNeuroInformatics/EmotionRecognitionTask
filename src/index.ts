import './style.css';
import emotionRecognitionTask from './EmotionRecognitionTask.ts';
import { experimentSettingsJson } from "./experimentSettings.ts";
import '/runtime/v1/jspsych@8.x/css/jspsych.css';
const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');
import { $EmotionRecognitionTaskResult, $Settings } from './schemas.ts';
import { translator } from './translations.ts';

import type { Language } from "/runtime/v1/@opendatacapture/runtime-core";

export default defineInstrument({
  kind: "INTERACTIVE",
    // if multilingual experimentSettingsJson needs a language field
  language: experimentSettingsJson.language as Language,
  tags: ["interactive", "jsPysch", "PictureNamingTask"],


  internal: {
    edition: 1,
    name: 'EMOTION_RECOGNITION_TASK'
  },
  content: {
    async render(done) {
      const settingsParseResult = $Settings.safeParse(experimentSettingsJson);

      // parse settings
      if (!settingsParseResult.success) {
        throw new Error(`Validation error, check experiment settings: ${settingsParseResult.error.toString()}`)
      }
      translator.init();
      emotionRecognitionTask(done);
    }
  },
  details: {
    description: 'A task to decipher a subjects ability to interpret emotion displayed in audio and visual mediums',
    estimatedDuration: 20,
    instructions: ['Please read the instruction presented within the task carefully'],
    license: 'UNLICENSED',
    title: 'Emotion Recognition Task'
  },
  measures: {},

  validationSchema: z.object({
    version: z.string(),
    timestamp: z.string(),
    experimentResult: z.array($EmotionRecognitionTaskResult)
  })
});