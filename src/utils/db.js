import firebase from 'firebase/app';
import 'firebase/database';

export default class FirebaseDB {
  constructor() {
    this.firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    };
    this.dbRef = 'scores/';
    this.scoresRef = null;
  }

  initDB() {
    firebase.initializeApp(this.firebaseConfig);
    this.retrieveDataFromDB();
  }

  storeInDB(scoreTable, { score, nickname, level, speed }) {
    if (!scoreTable[nickname] || scoreTable[nickname]?.score < score) {
      return firebase.database().ref(this.dbRef).child(nickname).set({ score, level, speed });
    }
  }

  retrieveDataFromDB(callback) {
    this.scoresRef = firebase.database().ref(this.dbRef);
    return this.scoresRef.on('value', (snapshot) => callback && callback(snapshot.val() || {}));
  }

  detach() {
    this.scoresRef.off();
  }
}
