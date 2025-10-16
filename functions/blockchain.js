const { Block } = require('./block');

class Blockchain {
  constructor() {
    this.chain = this.loadOrCreateChain();
  }

  createGenesisBlock() {
    return new Block(Date.now(), {"filename": "GenesisBlock","storedAs": "genesis_block","fileHash":"genesis"}, "-");
  }

  loadOrCreateChain() {
    const fs = require('fs');
    const FILE_PATH = './blockchain.json';

    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, 'utf-8').trim();
      if (content) {
        try {
          const chain = JSON.parse(content);
          if (Array.isArray(chain) && chain.length > 0) {
            console.log("✅ Blockchain carregada com", chain.length, "blocos.");
            return chain;
          }
        } catch (err) {
          console.error("❌ JSON corrompido:", err.message);
        }
      }
    }

    // Se chegou aqui, é porque não havia blockchain válida
    console.log("⚙️ Criando blockchain nova com bloco gênese...");
    const genesis = [this.createGenesisBlock()];
    fs.writeFileSync(FILE_PATH, JSON.stringify(genesis, null, 2));
    return genesis;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    const latest = this.getLatestBlock();
    newBlock.previousHash = latest.hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);

    // Salvar automaticamente
    const fs = require('fs');
    fs.writeFileSync('./blockchain.json', JSON.stringify(this.chain, null, 2));
  }
}

module.exports = { Blockchain };