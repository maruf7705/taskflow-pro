export function setupNotifications() {
  // Request permission for notifications
  if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }

  // Set up hourly notifications
  setInterval(() => {
    if (Notification.permission === 'granted') {
      new Notification('TaskFlow Pro', {
        body: 'How is your progress going?',
        icon: '/icons/icon-192.png',
      });
    }
  }, 1000 * 60 * 60); // Every hour
}
