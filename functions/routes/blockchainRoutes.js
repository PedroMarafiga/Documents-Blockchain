const { buildBlockchainController } = require('../controllers/blockchainController');

function blockchainRoutes(app, deps) {
  const { upload, blockchain } = deps || {};
  if (!app) throw new Error('app (express) é obrigatório');
  if (!upload) throw new Error('upload (multer) é obrigatório');
  if (!blockchain) throw new Error('blockchain é obrigatório');

  const { getBlockchain, addDocument, getMinedBlockchain } = buildBlockchainController({ blockchain });

  app.get('/api/blockchain', getBlockchain);
  app.get('/api/chain', getMinedBlockchain);
  app.post('/api/add-document', upload.single('document'), addDocument);
}

module.exports = blockchainRoutes;