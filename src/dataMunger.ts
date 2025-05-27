import { $EmotionRecognitionTaskResult } from './schemas.ts';

import type { EmotionRecognitionTask } from './schemas.ts';
import type { DataCollection } from '/runtime/v1/jspsych@8.x';

type ExperimentResultExport = {
  version: string;
  timestamp: string;
  experimentResult: {
      correctResponse: string;
      correctResponseSelected: number;
      response: string;
      language?: string;
      rt: number;
      trialType: string;
      itemCode: string;
      mediaFileType: string;
  }[];
}

function dataMunger(data: DataCollection) {
  const trials = data.values() as EmotionRecognitionTask[];
  const experimentResult: EmotionRecognitionTask[] = [];
  for (const trial of trials) {
    // parsed experimentResults go here
    try {
      const result = $EmotionRecognitionTaskResult.parse({
        trialType: trial.trialType,
        response: trial.response,
        correctResponse: trial.correctResponse,
        correctResponseSelected: trial.correctResponseSelected,
        language: trial.language,
        rt: trial.rt,
        mediaFileType: trial.mediaFileType,
        itemCode: trial.itemCode,
        selectedLanguage: trial.language
      });
      experimentResult.push(result);
    } catch (error) {
      console.error('Failed to parse trial:', error);
    }
  }

  return experimentResult;
}

function arrayToCSV(array: EmotionRecognitionTask[]) {
  const header = Object.keys(array[0]!).join(',');
  const trials = array.map((trial) => Object.values(trial).join(',')).join('\n');
  return `${header}\n${trials}`;
}

function downloadCSV(dataForCSV: string, filename: string) {
  const blob = new Blob([dataForCSV], { type: 'text/csv;charset=utf8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function getLocalTime() {
  const localTime = new Date();

  const year = localTime.getFullYear();
  // months start at 0 so add 1
  const month = String(localTime.getMonth() + 1).padStart(2, '0');
  const day = String(localTime.getDate()).padStart(2, '0');
  const hours = String(localTime.getHours()).padStart(2, '0');
  const minutes = String(localTime.getMinutes()).padStart(2, '0');
  const seconds = String(localTime.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// for ODC
function exportToJsonSerializable(data: EmotionRecognitionTask[]): ExperimentResultExport {
  return {
    version: '1.0',
    timestamp: getLocalTime(),
    experimentResult: data.map((result) => ({
      correctResponse: result.correctResponse,
      correctResponseSelected: result.correctResponseSelected,
      response: result.response,
      language: result.language,
      rt: result.rt,
      trialType: result.trialType,
      itemCode: result.itemCode,
      mediaFileType: result.mediaFileType
    }))
  };
}

export function transformAndDownload(data: DataCollection) {
  const mungedData = dataMunger(data);
  const dataForCSV = arrayToCSV(mungedData);
  const currentDate = getLocalTime();
  downloadCSV(dataForCSV, `${currentDate}.csv`);
}
export function transformAndExportJson(data: DataCollection): ExperimentResultExport {
  const mungedData = dataMunger(data);
  const jsonSerializableData = exportToJsonSerializable(mungedData);
  return jsonSerializableData;
}

export function downloadJson(data: unknown, filename: string) {
  const blobData = JSON.stringify(data);
  const blob = new Blob([blobData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
