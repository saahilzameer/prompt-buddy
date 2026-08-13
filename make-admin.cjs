const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, updateDoc, doc } = require("firebase/firestore");
const fs = require("fs");

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function test() {
  const users = await getDocs(collection(db, "users"));
  if (users.docs.length > 0) {
    users.docs.forEach(async (u) => {
      await updateDoc(doc(db, "users", u.id), { is_admin: true });
      console.log(`Made ${u.id} an admin!`);
    });
  } else {
    console.log("No users found");
  }
}
test();
