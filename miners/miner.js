const admin = require('firebase-admin');
const crypto = require('crypto');
const { setTimeout: wait } = require('timers/promises');

// ------------------------
// Inicialização do Firebase
// ------------------------
function initFirebase() {
    if (admin.apps.length) return;
    
    const serviceAccount = require('./firebase_credentials.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
    });
}

initFirebase();
const db = admin.firestore();

// ------------------------
// Configuração
// ------------------------
const DIFFICULTY = 5; // dificulade da mineração
const minerId = process.argv[2] || "miner";  // identifica o minerador

// ------------------------
// Funções utilitárias
// ------------------------
function sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

function isValid(hash) {
    return hash.startsWith('0'.repeat(DIFFICULTY));
}

// ------------------------
// Função principal de mineração
// ------------------------
async function mineBlock(docId, data) {
    const { timestamp, previousHash, data: fileData } = data;

    let nonce = 0;
    let hash;

    console.log(`⛏️  ${minerId}: Iniciando mineração do bloco ${docId}...`);

    do {
        nonce++;
        const toHash = `${timestamp}${JSON.stringify(fileData)}${previousHash}${nonce}${minerId}`;
        hash = sha256(toHash);
    } while (!isValid(hash));

    console.log(`🎉 ${minerId} encontrou o hash válido: ${hash}`);

    return {
        ...data,
        nonce,
        blockHash: hash,
        miner: minerId
    };
}

// ------------------------
// Loop contínuo do minerador
// ------------------------
async function runMiner() {
    console.log(`🚀 Minerador ${minerId} iniciado...`);

    while (true) {
        const snapshot = await db.collection('pendingBlocks')
            .orderBy('timestamp')
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log(`⏳ ${minerId}: Nenhum bloco pendente...`);
            await wait(2000);
            continue;
        }

        const doc = snapshot.docs[0];
        const pendingData = doc.data();

        // Minerando o bloco
        const mined = await mineBlock(doc.id, pendingData);

        try {
            // Atualiza a blockchain
            await db.collection('chain').doc(doc.id).set(mined);
            console.log(`🟢 ${minerId}: Bloco salvo na coleção 'chain'`);

            // Log opcional
            await db.collection('minedBlocks').doc(doc.id).set(mined);
            console.log(`🟢 ${minerId}: Log salvo em 'minedBlocks'`);

            // Remove da fila pendente
            await db.collection('pendingBlocks').doc(doc.id).delete();
            console.log(`🗑️ ${minerId}: Bloco removido de 'pendingBlocks'`);

            console.log(`🏁 ${minerId}: Bloco ${doc.id} minerado com sucesso!`);
        } catch (error) {
            console.error(`❌ ${minerId}: Erro ao finalizar bloco ${doc.id}:`, error);
        }
    }
}

runMiner();
