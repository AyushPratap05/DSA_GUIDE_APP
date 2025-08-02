// importData.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Path to your downloaded service account key
const fs = require('fs'); // Node.js File System module

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL is not strictly needed for Firestore, but can be added if desired
  // databaseURL: "https://dsa-study-guide-app.firebaseio.com" // Replace with your project ID
});

const db = admin.firestore();

// Define the path to your data file relative to this script
const dataFilePath = './firestore_import_data/artifacts/dsa-study-guide-app/public/data/dsaTopics/dsa_topics_data.json';

// **CORRECTED TARGET COLLECTION PATH**
// This path directly points to the 'dsaTopics' collection.
// Firestore will implicitly create 'artifacts', 'dsa-study-guide-app' (as a document in artifacts),
// 'public' (as a subcollection in dsa-study-guide-app), 'data' (as a document in public),
// and finally 'dsaTopics' (as a subcollection in data) when the first document is added.
const targetCollectionRef = db.collection('artifacts').doc('dsa-study-guide-app').collection('public').doc('data').collection('dsaTopics');


async function importData() {
  try {
    // Read the JSON data file
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    console.log(`Starting import of data from: ${dataFilePath}`);

    // Iterate over each topic (document) in your JSON
    for (const docId in data) {
      if (data.hasOwnProperty(docId)) {
        const docData = data[docId];
        const docRef = targetCollectionRef.doc(docId); // Get a reference to the specific document

        // Use set() to create or overwrite the document
        await docRef.set(docData); // No merge: false needed, default is overwrite for set() if doc doesn't exist
        console.log(`Successfully imported document: ${docId}`);
      }
    }

    console.log('All data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    // Exit the script
    process.exit();
  }
}

// Run the import function
importData();
