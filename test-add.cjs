const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");
const fs = require("fs");
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function test() {
  console.log("Adding doc...");
  const ref = await addDoc(collection(db, "matches"), { test: true, created_at: serverTimestamp() });
  console.log("Added doc", ref.id);
}
test().catch(console.error);
