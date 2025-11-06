const path = require('path');
const { sha256File } = require('../utils/sha256File');
const { Block } = require('../block');

// Factory que cria handlers do controller com dependências injetadas
function buildBlockchainController({ blockchain }) {
  if (!blockchain) throw new Error('blockchain é obrigatório no controller');

  const getBlockchain = (req, res) => {
    return res.json({ chain: blockchain.chain });
  };

  const addDocument = (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      }

      const filePath = req.file.path;
      const fileHash = sha256File(filePath);

      const data = {
        filename: req.file.originalname,
        storedAs: path.basename(filePath),
        fileHash,
        owner: req.body.username || 'Desconhecido'
      };

      const newBlock = new Block(Date.now(), data);
      blockchain.addBlock(newBlock);

      return res.status(201).json({
        message: 'Documento adicionado à blockchain com sucesso.',
        block: {
          index: newBlock.index,
          timestamp: newBlock.timestamp,
          hash: newBlock.hash,
          previousHash: newBlock.previousHash,
          data
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  };

  return { getBlockchain, addDocument };
}

module.exports = { buildBlockchainController };