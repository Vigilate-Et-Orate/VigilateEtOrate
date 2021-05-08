import firebase from 'firebase/app'
import { LogBox } from 'react-native'
import 'firebase/auth'
import 'firebase/firestore'

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

// Init firebase + try to enable persistence
firebase.initializeApp(firebaseConfig)
// firebase.firestore().enablePersistence()
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
// Disable timer warnings
LogBox.ignoreLogs(['Setting a timer', 'Firebase Analytics'])

export default firebase
