import './index.css';
import './style.css';
import emotionRecognitionTask from './EmotionRecognitionTask';
import '/runtime/v1/jspsych@8.x/css/jspsych.css';

import { configureNotifications } from './notifications';

configureNotifications();

// no top-level await: the default build target (es2020 / Safari 14) does not support it
void emotionRecognitionTask();
