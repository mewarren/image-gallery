import firebase from 'firebase';


var config = {
  apiKey: 'AIzaSyC01xmpQ55EQ2q6WSTPF0v5RfIS_Egp_hs',
  authDomain: 'image-gallery-659ed.firebaseapp.com',
  databaseURL: 'https://image-gallery-659ed.firebaseio.com',
  projectId: 'image-gallery-659ed',
  storageBucket: 'image-gallery-659ed.appspot.com',
  messagingSenderId: '936006419391'
};

const firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.database(); //the real-time database
export const storage = firebase.storage(); //the firebase storage adjunct for images
export const auth = firebaseApp.auth(); //the firebase auth namespace
