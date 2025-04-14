// firebase.js
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCocT8PeSflu6nfVBxRVlh6p6zGDmjqMmw",
  authDomain: "todoapp-1919.firebaseapp.com",
  projectId: "todoapp-1919",
  storageBucket: "todoapp-1919.firebasestorage.app",
  messagingSenderId: "47223246849",
  appId: "1:47223246849:web:07312a0f7641dee6023000"
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Conecta com o Firestore
const db = getFirestore(app);

module.exports = db;