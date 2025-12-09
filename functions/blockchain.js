const { Block } = require('./block');
const { addToFirestore, getAllFromFirestore } = require('./firebase');


class Blockchain {
  constructor() {
    this.chain = [];
  }

  async init() {
    this.chain = await this.loadOrCreateChain();
  }

  createGenesisBlock() {
    return new Block(Date.now(), { "filename": "GenesisBlock", "storedAs": "genesis_block", "fileHash": "genesis" }, "-");
  }

  async loadOrCreateChain() {
    const chain = await getAllFromFirestore('pendingBlocks');
    if (Array.isArray(chain) && chain.length > 0) {
      console.log("✅ Blockchain carregada do Firebase com", chain.length, "blocos.");
      return chain.map(b => new Block(
        b.timestamp,
        b.data,
        b.previousHash,
        b.index,
        b.hash
      ));
    }
    console.log("⚙️ Criando blockchain nova com bloco gênese...");
    const genesis = [this.createGenesisBlock()];
    await addToFirestore('pendingBlocks', genesis[0].getData(), '0');
    return genesis;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  async addBlock(newBlock) {
    // Garante que a cadeia está carregada
    if (this.chain.length === 0) {
      await this.init();
    }
    const latest = this.getLatestBlock();
    newBlock.previousHash = latest.hash;
    newBlock.hash = newBlock.calculateHash();
    newBlock.nounce = 0;
    const timestamp = this.formatTimestamp(newBlock.timestamp);
    await addToFirestore('pendingBlocks', newBlock.getData(), timestamp);
    this.chain.push(newBlock);

    // Atualiza a chain local após adicionar no Firestore
    await this.init();
  }

  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}_${month}_${day} ${hours}:${minutes}:${seconds}`;
  }
}



module.exports = { Blockchain };