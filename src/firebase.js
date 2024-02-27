// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA4eDytrjfsvvmH-W7IlSPGjvOsuFM8IwY",
    authDomain: "togo-7f889.firebaseapp.com",
    projectId: "togo-7f889",
    storageBucket: "togo-7f889.appspot.com",
    messagingSenderId: "861859089841",
    appId: "1:861859089841:web:5b55bc6bc5573930694190",
    measurementId: "G-4DSC9GYT3S"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const { REACT_APP_VAPID_KEY } = process.env;
const publicKey = "BK1onSdP3jZqkXPuhNnpXw-vjS4k-jhUtQwWnWnolR7xqBNopgcenixt2b7CP4Uat8yosMY2KC0LTN8exLmEWbk";

// console.log(publicKey);

export const getUserToken = async (/* setTokenFound */) => {
    let currentToken = '';
    // console.log(messaging)
    try {
        currentToken = await getToken(messaging, { vapidKey: publicKey });
        /* if (currentToken) {
            setTokenFound(true);
        } else {
            setTokenFound(false);
        } */
    } catch (error) {
        console.log('An error occurred while retrieving token.', error);
    }
    return currentToken;
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log(payload);
            console.log({messaging})
            resolve(payload);
        });
    });