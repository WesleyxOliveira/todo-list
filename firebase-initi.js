const firebaseConfig = {
  apiKey: "AIzaSyCJ2YI71wTR6Y4--xvCck0VuBsowTvdY3g",
  authDomain: "controle-de-gastos-70850.firebaseapp.com",
  projectId: "controle-de-gastos-70850",
  storageBucket: "controle-de-gastos-70850.appspot.com",
  messagingSenderId: "572745736504",
  appId: "1:572745736504:web:49c57dfa5eb92c077321cd"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
