import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyA1D0n1OW7NuDEYJ5nLTf0blfQxfHYuzwQ",
  authDomain: "webhardheat.firebaseapp.com",
  projectId: "webhardheat",
  storageBucket: "webhardheat.appspot.com",
  messagingSenderId: "863313311527",
  appId: "1:863313311527:web:c5ec7e98ed8a99202e1b02"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();