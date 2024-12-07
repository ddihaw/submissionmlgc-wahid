const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore({databaseId: "(default)"});

async function storeData(id, data) {
  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
}
 
async function getAllData() {
  try {
    const snapshot = await db.collection('prediction').get();
    const data = snapshot.docs.map(doc => doc.data());
    return data;
  } catch (error) {
    console.error('Error getting data:', error);
    return [];
  }
}

module.exports = { storeData, getAllData };