const admin = require('firebase-admin');
const crypto = require('crypto');
const { setTimeout: wait } = require('timers/promises');

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

const DIFFICULTY = 5; // número de zeros exigidos

function sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

function isValid(hash) {
    return hash.startsWith('0'.repeat(DIFFICULTY));
}

const minerId = process.argv[2] || "miner";

async function mineBlock(docId, data) {
    const { timestamp, previousHash, data: fileData } = data;
    let nonce = 0;
    let hash;

    do {
        nonce++;
        const toHash = `${timestamp}${JSON.stringify(fileData)}${previousHash}${nonce}${minerId}`;
        hash = sha256(toHash);
    } while (!isValid(hash));

    return { ...data, nonce, blockHash: hash, miner: minerId };
}


async function runMiner() {
    console.log("Minerador iniciado...");

    while (true) {
        const snapshot = await db.collection('pendingBlocks').orderBy('timestamp').limit(1).get();
        if (snapshot.empty) {
            console.log("Nenhum bloco pendente...");
            await wait(2000);
            continue;
        }

        const doc = snapshot.docs[0];
        const pendingData = doc.data();
        const mined = await mineBlock(doc.id, pendingData);

        try {
            // grava em /chain e remove de /pendingBlocks
            await db.collection('chain').doc(doc.id).set(mined);
            console.log(`✅ Bloco salvo em 'chain'`);
            
            await db.collection('minedBlocks').doc(doc.id).set(mined);
            console.log(`✅ Bloco salvo em 'minedBlocks'`);
            
            await db.collection('pendingBlocks').doc(doc.id).delete();
            console.log(`✅ Bloco removido de 'pendingBlocks'`);

            console.log(`✅ Bloco ${doc.id} minerado: ${mined.blockHash}`);
        } catch (error) {
            console.error(`❌ Erro ao processar bloco ${doc.id}:`, error);
        }
    }
}

runMiner();
