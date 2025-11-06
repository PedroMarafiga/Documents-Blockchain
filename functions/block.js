class Block {


  constructor(timestamp, data, previousHash = '') {

    this.timestamp = timestamp;
    this.data = data;  
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nounce = 0;
  }

  getData() {
    return {timestamp: this.timestamp,data: this.data, previousHash: this.previousHash, hash: this.hash, nounce: this.nounce };
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