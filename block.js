class Block {
  static indexCount = 0;

  constructor(timestamp, data, previousHash = '') {
    this.index = Block.indexCount++;
    this.timestamp = timestamp;
    this.data = data;  // hash do documento
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const crypto = require('crypto');
    return crypto
      .createHash('sha256')
      .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash)
      .digest('hex');
  }
}

module.exports = { Block };