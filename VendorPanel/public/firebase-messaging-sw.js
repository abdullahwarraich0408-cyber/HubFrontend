/* eslint-disable no-undef */
/**
 * Firebase Cloud Messaging service worker — receives pushes when the tab is closed.
 * Public Firebase web config (safe to embed).
 */
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCh_rJUG6PHgRl9TbFwoThqTxC3EZSp1G0',
  authDomain: 'medcare-a5507.firebaseapp.com',
  projectId: 'medcare-a5507',
  storageBucket: 'medcare-a5507.firebasestorage.app',
  messagingSenderId: '546088011555',
  appId: '1:546088011555:web:0cdb888476b859916f2e96',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || payload?.data?.title || 'Medzoos';
  const body = payload?.notification?.body || payload?.data?.body || '';
  const link = payload?.data?.link || '/';
  const options = {
    body,
    icon: '/favicon-32.png',
    badge: '/favicon-32.png',
    data: { link, ...((payload && payload.data) || {}) },
    tag: payload?.data?.id ? `medzoos-${payload.data.id}` : `medzoos-${Date.now()}`,
    renotify: true,
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification?.data?.link || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(link);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(link);
      }
      return undefined;
    })
  );
});
