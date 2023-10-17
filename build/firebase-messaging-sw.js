
importScripts("https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.8/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyA4eDytrjfsvvmH-W7IlSPGjvOsuFM8IwY",
    authDomain: "togo-7f889.firebaseapp.com",
    projectId: "togo-7f889",
    storageBucket: "togo-7f889.appspot.com",
    messagingSenderId: "861859089841",
    appId: "1:861859089841:web:5b55bc6bc5573930694190",
    measurementId: "G-4DSC9GYT3S"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/logo192.png",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});