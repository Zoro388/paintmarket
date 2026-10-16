
importScripts(
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBfQvhWjMzi1VbpKwy6z1RPymU__v8AiVs",
  authDomain: "paintdomain-notifications.firebaseapp.com",
  projectId: "paintdomain-notifications",
  storageBucket: "paintdomain-notifications.firebasestorage.app",
  messagingSenderId: "72086826811",
  appId: "1:72086826811:web:923830f2216f602fd0511e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    payload.notification?.title || "Paintdomain notification";

  const options = {
    body: payload.notification?.body || "",
    icon: "/icon.png",
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});


self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const bookingId = event.notification?.data?.bookingId;

  const targetUrl = bookingId
    ? `https://paintdomain.com/dashboard/inspection-bookings/${encodeURIComponent(bookingId)}`
    : "https://paintdomain.com/dashboard";

  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});

