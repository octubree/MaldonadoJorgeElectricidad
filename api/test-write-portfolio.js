
const admin = require('firebase-admin');

// Asegúrate de que la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY esté configurada en Vercel
// y contenga el JSON de tu clave de cuenta de servicio codificado en base64.
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    // No lanzar el error aquí para permitir que la función responda con un error HTTP
  }
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (!admin.apps.length) {
    return res.status(500).json({ error: "Firebase Admin SDK no inicializado. Revisa FIREBASE_SERVICE_ACCOUNT_KEY." });
  }

  try {
    const docRef = await db.collection('portfolioItems').add({
      category: 'filter-test',
      imageUrl: 'https://example.com/test-image.jpg',
      altText: 'Imagen de prueba para verificar escritura en Firestore',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: 'Documento de prueba añadido con éxito a Firestore', docId: docRef.id });
  } catch (error) {
    console.error("Error al añadir documento a Firestore:", error);
    res.status(500).json({ error: 'Error al añadir documento a Firestore', details: error.message });
  }
};
