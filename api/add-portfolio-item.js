
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
    return res.status(500).json({ error: "Firebase Admin SDK no inicializado. Revisa FIREBASE_SERVICE_ACCOUNT_KEY." });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Solo se permiten solicitudes POST' });
  }

  try {
    const { imageUrl, category, altText } = req.body;

    // Validación básica
    if (!imageUrl || !category || !altText) {
      return res.status(400).json({ message: 'Faltan campos requeridos: imageUrl, category, altText' });
    }

    const newItem = {
      imageUrl,
      category,
      altText,
      timestamp: admin.firestore.FieldValue.serverTimestamp(), // Para ordenar por fecha de creación
    };

    const docRef = await db.collection('portfolioItems').add(newItem);

    res.status(200).json({ message: 'Documento añadido con éxito', id: docRef.id });
  } catch (error) {
    console.error("Error al añadir documento a Firestore:", error);
    res.status(500).json({ message: 'Error interno del servidor', details: error.message });
  }
};
