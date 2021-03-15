const firebase = require("firebase/app")
require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyC2TJ729yzyNCFGYijXfEkU0V5Ybxo-yBo",
  authDomain: "kiei-451-76a52.firebaseapp.com",
  projectId: "kiei-451-76a52",
  storageBucket: "kiei-451-76a52.appspot.com",
  messagingSenderId: "1025996709056",
  appId: "1:1025996709056:web:e785c5cfde31db86b76125"
} // replace

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

module.exports = firebase