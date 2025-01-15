import './index.css';
import emotionRecognitionTask from './EmotionRecognitionTask.ts';
import '/runtime/v1/jspsych@8.x/css/jspsych.css';
const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');
import { $EmotionRecognitionTaskResult } from './schemas.ts';

export default defineInstrument({
  kind: "INTERACTIVE",
  language: 'en',
  tags: ["interactive", "jsPysch", "PictureNamingTask"],


  internal: {
    edition: 1,
    name: 'Emotion Recognition Task'
  },
  content: {
    render() {
      emotionRecognitionTask();
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
    message: $EmotionRecognitionTaskResult
  })
});