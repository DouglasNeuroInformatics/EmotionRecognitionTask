import './index.css';
import emotionRecognitionTask from './EmotionRecognitionTask';
import '/runtime/v1/jspsych@8.x/css/jspsych.css';

import { configureNotifications } from './notifications';
import { addNotification } from '@opendatacapture/runtime-v1/@opendatacapture/runtime-core/index.js';

configureNotifications();

setTimeout(() => {
  addNotification({
    type: 'info',
    message: 'Welcome!'
  });
}, 500);

await emotionRecognitionTask();
