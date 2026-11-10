import { addNotification } from '@opendatacapture/runtime-v1/@opendatacapture/runtime-core/index.js';

import { addBootstrapScripts } from './helperFunctions.ts';
import { OdcMediaContent } from './ODCMediaContent.ts';
import { translator } from './translations.ts';

// Volume calibration screen shown once, before the general instructions.
// The participant can replay the reference clip any number of times and cannot skip the screen:
// keyboard responses are disabled and the trial only ends via "Sounds good, continue",
// which stays disabled until the clip has started playing at least once.
// The trial sets no trialType, so it is excluded from the exported data like the other non-scored trials.

const speakerIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="80" height="72" viewBox="15 -12 40 100" aria-hidden="true">
    <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style="stroke:currentColor;stroke-width:5;stroke-linejoin:round;fill:currentColor;"/>
    <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style="fill:none;stroke:currentColor;stroke-width:5;stroke-linecap:round"/>
  </svg>`;

function getSoundCheckAudioPath(): string {
  return translator.resolvedLanguage === 'en' ? OdcMediaContent.SoundCheck.en : OdcMediaContent.SoundCheck.fr;
}

function soundCheckHtml(audioPath: string): string {
  return `
    <style>
      @keyframes sound-check-pulse {
        0% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.6); }
        70% { box-shadow: 0 0 0 20px rgba(13, 110, 253, 0); }
        100% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
      }
      .sound-check-pulse { animation: sound-check-pulse 1.6s infinite; }
      @media (prefers-reduced-motion: reduce) { .sound-check-pulse { animation: none; } }
    </style>
    <div style="max-width: 700px; margin: 0 auto; text-align: left; font-size: 20px">
      <section id="sound-check-view">
        <h3 style="text-align: center">${translator.t('soundCheck.title')}</h3>
        <ul>
          <li>${translator.t('soundCheck.intro')}</li>
          <li>${translator.t('soundCheck.headphones')}</li>
          <li>${translator.t('soundCheck.instructions')}</li>
        </ul>
        <div style="display: flex; justify-content: center; padding: 1rem 0">
          <button
            id="sound-check-play"
            type="button"
            class="btn btn-primary rounded-circle sound-check-pulse"
            style="width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(13, 110, 253, 0.4)"
            aria-label="${translator.t('soundCheck.title')}"
          >
            ${speakerIcon}
          </button>
        </div>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap">
          <button id="sound-check-cant-hear" type="button" class="btn btn-outline-secondary btn-lg">
            ${translator.t('soundCheck.cantHearButton')}
          </button>
          <button id="sound-check-continue" type="button" class="btn btn-primary btn-lg" disabled>
            ${translator.t('soundCheck.continueButton')}
          </button>
        </div>
      </section>
      <section id="sound-check-troubleshooting" style="display: none">
        <p><b>${translator.t('troubleshooting.heading')}</b> ${translator.t('troubleshooting.intro')}</p>
        <ul>
          <li>${translator.t('troubleshooting.mute')}</li>
          <li>${translator.t('troubleshooting.headphones')}</li>
          <li>${translator.t('troubleshooting.outputDevice')}</li>
          <li>${translator.t('troubleshooting.otherApplication')}</li>
        </ul>
        <p>${translator.t('troubleshooting.contact')}</p>
        <div style="display: flex; justify-content: center">
          <button id="sound-check-try-again" type="button" class="btn btn-primary btn-lg">
            ${translator.t('troubleshooting.tryAgainButton')}
          </button>
        </div>
      </section>
      <audio id="sound-check-audio" preload="auto" src="${audioPath}"></audio>
    </div>`;
}

/**
 * @param plugin the jsPsych HtmlKeyboardResponsePlugin (loaded dynamically from the ODC runtime)
 * @param finishTrial ends the current trial, e.g. () => jsPsych.finishTrial()
 */
export function createSoundCheckTrial<TPlugin>(plugin: TPlugin, finishTrial: () => void) {
  return {
    type: plugin,
    stimulus: () => soundCheckHtml(getSoundCheckAudioPath()),
    choices: 'NO_KEYS',
    response_ends_trial: false,
    on_load: () => {
      addBootstrapScripts();

      const audio = document.getElementById('sound-check-audio');
      const playButton = document.getElementById('sound-check-play');
      const continueButton = document.getElementById('sound-check-continue');
      const cantHearButton = document.getElementById('sound-check-cant-hear');
      const tryAgainButton = document.getElementById('sound-check-try-again');
      const soundCheckView = document.getElementById('sound-check-view');
      const troubleshootingView = document.getElementById('sound-check-troubleshooting');

      if (
        !(audio instanceof HTMLAudioElement) ||
        !(continueButton instanceof HTMLButtonElement) ||
        !playButton ||
        !cantHearButton ||
        !tryAgainButton ||
        !soundCheckView ||
        !troubleshootingView
      ) {
        addNotification({
          type: 'error',
          message: 'Sound check failed to load'
        });
        return;
      }

      playButton.addEventListener('click', () => {
        // restart from the beginning on every click so the clip can be replayed freely
        audio.currentTime = 0;
        audio.play().catch((err: Error) => {
          addNotification({
            type: 'error',
            message: `Error playing sound check audio: ${err.message}`
          });
        });
      });

      audio.addEventListener(
        'playing',
        () => {
          continueButton.disabled = false;
          // stop drawing attention to the play button once the clip has been heard
          playButton.classList.remove('sound-check-pulse');
        },
        { once: true }
      );

      cantHearButton.addEventListener('click', () => {
        audio.pause();
        soundCheckView.style.display = 'none';
        troubleshootingView.style.display = 'block';
      });

      tryAgainButton.addEventListener('click', () => {
        troubleshootingView.style.display = 'none';
        soundCheckView.style.display = 'block';
      });

      continueButton.addEventListener('click', () => {
        audio.pause();
        finishTrial();
      });
    }
  };
}
