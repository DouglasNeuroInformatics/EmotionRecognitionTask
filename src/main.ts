import './index.css';
import emotionRecognitionTask from './EmotionRecognitionTask';
import '/runtime/v1/jspsych@8.x/css/jspsych.css';

import { configureNotifications } from './notifications';

configureNotifications();

await emotionRecognitionTask();
