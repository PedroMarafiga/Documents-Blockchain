const fs = require('fs');
const crypto = require('crypto');
const {Blockchain } = require('./blockchain');
const { Block } = require('./block');


const FILE_PATH = './blockchain.json';
const blockchain = new Blockchain();

function saveBlockchain(chain) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(chain, null, 2));
}

function loadBlockchain() {
  if (fs.existsSync(FILE_PATH)) {
    return JSON.parse(fs.readFileSync(FILE_PATH));
  }
  return null;
}

function hashFile(path) {
  const fileBuffer = fs.readFileSync(path);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}
console.log("Hash do arquivo:", hashFile("meuDocumento.pdf"));

// Uso:
const blockchainData = loadBlockchain();

if (blockchainData) {
  blockchain.chain = blockchainData;
}

const fileHash = hashFile("meuDocumento.pdf");
blockchain.addBlock(new Block(Date.now(), { fileHash }));
saveBlockchain(blockchain.chain);

const fileHash2 = hashFile("meuDocumento2.pdf");
blockchain.addBlock(new Block(Date.now(), { fileHash: fileHash2 }));
saveBlockchain(blockchain.chain);

console.log(JSON.stringify(blockchain.chain, null, 2));

