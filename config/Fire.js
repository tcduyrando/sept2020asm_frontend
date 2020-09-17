import firebase from 'firebase/app';
import 'firebase/auth';        // for authentication

const config = {
    apiKey: "AIzaSyB1QPCegsI3q5JbpBNPvds4X5q1Puwn4jE",
    authDomain: "obs-user-login.firebaseapp.com",
    databaseURL: "https://obs-user-login.firebaseio.com",
    projectId: "obs-user-login",
    storageBucket: "obs-user-login.appspot.com",
    messagingSenderId: "269568849201",
    appId: "1:269568849201:web:aa0c32b9865e87d471ec10",
    measurementId: "G-LPYYJCRC14"
};

const fire = firebase.initializeApp(config);
export default fire;