const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");
const fs = require("fs");

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function test() {
  const users = await getDocs(collection(db, "users"));
  if (users.docs.length > 0) {
    const userId = users.docs[0].id;
    console.log("Found user:", userId);
    const res = await fetch("http://localhost:3000/api/ai/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    console.log(res.status);
    console.log(await res.text());
  } else {
    console.log("No users found");
  }
}
test().catch(console.error);
