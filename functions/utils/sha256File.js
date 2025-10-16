// calcular hash SHA-256 de um arquivo
const fs = require('fs');
const crypto = require('crypto');

function sha256File(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

module.exports = { sha256File };