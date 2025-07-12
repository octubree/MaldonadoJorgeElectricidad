
const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
  }
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (!admin.apps.length) {
    return res.status(500).json({ error: "Firebase Admin SDK no inicializado." });
  }

  try {
    const portfolioItemsRef = db.collection('portfolioItems');
    const snapshot = await portfolioItemsRef.orderBy('timestamp', 'desc').get(); // Ordenar por fecha de creación

    const items = [];
    snapshot.forEach(doc => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(items);
  } catch (error) {
    console.error("Error al leer documentos de Firestore:", error);
    res.status(500).json({ error: 'Error al leer documentos de Firestore', details: error.message });
  }
};
