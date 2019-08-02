import firebase from 'firebase';
require('firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyB1RemRFRMIeu5_dd4Eodeh27zlTR7h3C4",
    authDomain: "teamplayers-f3b25.firebaseapp.com",
    databaseURL: "https://teamplayers-f3b25.firebaseio.com",
    projectId: "teamplayers-f3b25",
    storageBucket: "teamplayers-f3b25.appspot.com",
    messagingSenderId: "92289914084",
    appId: "1:92289914084:web:30d1c832e06a66c6"
  };

  firebase.initializeApp(firebaseConfig);

  export const db = firebase.firestore();
  export const storage = firebase.storage();
