import admin from "firebase-admin";

// 🔹 Tu service account completo como JSON en variable de entorno
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

// Inicializar Firebase Admin solo si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;
      data.timestamp = admin.firestore.FieldValue.serverTimestamp();
      await db.collection("events").add(data);
      res.status(200).json({ ok: true, msg: "Evento creado" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, error: e.message });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
