class Block {
  static indexCount = 0;

  constructor(timestamp, data, previousHash = '') {
    this.index = Block.indexCount++;
    this.timestamp = timestamp;
    this.data = data;  
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  getData() {
    return {index: this.index, timestamp: this.timestamp,data: this.data, previousHash: this.previousHash, hash: this.hash};
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