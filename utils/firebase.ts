import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyA_fPwqQxGhMhWkhHJ5DW2TtoEKSRE8-18',
  authDomain: 'vigilate-et-orate.firebaseapp.com',
  databaseURL: 'https://vigilate-et-orate.firebaseio.com',
  projectId: 'vigilate-et-orate',
  storageBucket: 'vigilate-et-orate.appspot.com',
  messagingSenderId: '378663841206',
  appId: '1:378663841206:web:619c0a485f33fcecb46517',
  measurementId: 'G-LJS0EGZJG7'
}

firebase.initializeApp(firebaseConfig)

export default firebase
