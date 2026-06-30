
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

  // 1. Verificar autenticación
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado: Token no proporcionado.' });
  }

  const idToken = authorizationHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Opcional: Verificar si el usuario es el administrador permitido
    if (decodedToken.email !== 'sixtamux@gmail.com') {
      return res.status(403).json({ message: 'Acceso denegado: No tienes permisos de administrador.' });
    }

    const { id } = req.body;

    // 2. Validación básica
    if (!id) {
      return res.status(400).json({ message: 'Falta el ID del documento a eliminar.' });
    }

    await db.collection('portfolioItems').doc(id).delete();

    res.status(200).json({ message: 'Documento eliminado con éxito.' });
  } catch (error) {
    console.error("Error de autenticación o al eliminar documento:", error);
    if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-id-token') {
        return res.status(401).json({ message: 'Token de autenticación inválido o expirado.' });
    }
    res.status(500).json({ message: 'Error interno del servidor', details: error.message });
  }
};
