const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function initFirebase() {
  if (admin.apps.length) return;

  // Prioridade: variável JSON > caminho para arquivo > arquivo local functions/firebase_credentials.json > default env (Cloud Functions / GOOGLE_APPLICATION_CREDENTIALS)
  let rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const defaultLocal = path.join(__dirname, 'firebase_credentials.json');

  try {
    if (!rawServiceAccount) {
      const tryPath = envPath || defaultLocal;
      if (tryPath && fs.existsSync(tryPath)) {
        rawServiceAccount = fs.readFileSync(tryPath, 'utf8');
      }
    }

    if (rawServiceAccount) {
      const serviceAccount = JSON.parse(rawServiceAccount);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else {
      // fallback para ambiente do Cloud Functions ou GOOGLE_APPLICATION_CREDENTIALS
      admin.initializeApp();
    }
  } catch (err) {
    // se der erro no JSON, lança pra facilitar debug
    throw new Error(`Falha ao inicializar Firebase: ${err.message}`);
  }
}

/**
 * Adiciona ou atualiza um documento no Firestore.
 * @param {string} collection - nome da coleção
 * @param {Object} data - dados a serem salvos
 * @param {string|null} [docId=null] - id do documento (se fornecido, faz set; senão add())
 * @param {Object} [options] - opções: { merge: boolean } para set()
 * @returns {Promise<{ id: string, ref: FirebaseFirestore.DocumentReference }>}
 */
async function addToFirestore(collection, data, docId = null, options = {}) {
  initFirebase();
  const db = admin.firestore();

  if (!collection || typeof collection !== 'string') {
    throw new Error('collection é obrigatório e deve ser string');
  }

  if (docId) {
    const ref = db.collection(collection).doc(docId);
    await ref.set(data, { merge: !!options.merge });
    return { id: docId, ref };
  } else {
    const ref = await db.collection(collection).add(data);
    return { id: ref.id, ref };
  }
}

module.exports = { addToFirestore };
