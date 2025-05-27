import { z } from '/runtime/v1/zod@3.23.x';

const $Language = z.enum(['en', 'fr']);

//  below are some examples of zod object used both creating types and zod validation


const $Trial = z.object({
  trialType: z.string()
});
const $LoggingTrial = $Trial.extend({
  correctResponse: z.string(),
  difficultyLevel: z.coerce.number().positive().int().optional(),
  language: $Language.optional(),
  response: z.string(),
  rt: z.coerce.number().positive()
});
export const $ExperimentResults = $LoggingTrial.omit({ response: true, trialType: true }).extend({
  responseNotes: z.string(),
  responseResult: z.string()
});

export const $Settings = z.object({
  advancementSchedule: z.coerce.number().positive().int(),
  downloadOnFinish: z.coerce.boolean(),
  initialDifficulty: z.coerce.number().positive().int(),
  language: z.string(),
  numberOfLevels: z.coerce.number().positive().int(),
  regressionSchedule: z.coerce.number().int(),
  seed: z.coerce.number().positive().int(),
  totalNumberOfTrialsToRun: z.coerce.number().positive().int(),
});

export const $ExperimentImage = z.object({
  correctResponse: z.string(),
  difficultyLevel: z.coerce.number().positive().int(),
  language: z.string(),
  stimulus: z.string()
});

export const $EmotionRecognitionTaskResult = $LoggingTrial.extend({
  mediaFileType: z.string(),
  itemCode: z.string(),
  correctResponseSelected: z.number().int().min(0).max(1)
});

export type SupportedLanguage = z.infer<typeof $Language>;
export type Trial = z.infer<typeof $Trial>;
export type LoggingTrial = z.infer<typeof $LoggingTrial>;
export type ExperimentResults = z.infer<typeof $ExperimentResults>;
export type EmotionRecognitionTask = z.infer<typeof $EmotionRecognitionTaskResult>;
export type Settings = z.infer<typeof $Settings>;
export type ExperimentImage = z.infer<typeof $ExperimentImage>;
