import type { RuntimeNotification } from '@opendatacapture/runtime-v1/@opendatacapture/runtime-core/index.js';

const container = document.getElementById('notification-modal-container')!;
const closeButton = document.getElementById('notification-close-button')!;
const title = document.getElementById('notification-modal-title')!;
const message = document.getElementById('notification-modal-message')!;

export function configureNotifications() {
  document.addEventListener('addNotification', (event) => {
    const notification = (event as CustomEvent<RuntimeNotification>).detail;
    title.textContent = notification.title ?? notification.type;
    message.textContent = notification.message ?? '';
    container.setAttribute('data-state', 'open');
  });
  closeButton.addEventListener('click', () => {
    container.setAttribute('data-state', 'closed');
  });
}
