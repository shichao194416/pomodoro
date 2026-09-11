// Browser Notification Utility
// Handles permission requests and sending notifications

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
	return 'denied';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
	return 'denied';
  }
  if (Notification.permission === 'granted') {
	return 'granted';
  }
  if (Notification.permission === 'denied') {
	return 'denied';
  }

  return await Notification.requestPermission();
}

export function sendNotification(
  title: string,
  body?: string
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
	return null;
  }

  const notification = new Notification(title, {
	body,
	icon: '/tomato-192x192.png',
	tag: 'pomodoro-notification',
  });

  setTimeout(()=> notification.close(), 5000);
  return notification;
}
