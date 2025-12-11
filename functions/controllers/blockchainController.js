const path = require('path');
const { sha256File } = require('../utils/sha256File');
const { Block } = require('../block');
const { firestore } = require('firebase-admin');
const { getAllFromFirestore } = require('../firebase');
const { uploadToSupabase } = require('../utils/uploadToSupabase');

// Factory que cria handlers do controller com dependências injetadas
function buildBlockchainController({ blockchain }) {
  if (!blockchain) throw new Error('blockchain é obrigatório no controller');

  const getBlockchain = async (req, res) => {
    return res.json({ chain: blockchain.chain });
  };

  const getMinedBlockchain = async (req, res) => {
    try {
      const minedBlocks = await getAllFromFirestore('chain');
      return res.json({ chain: minedBlocks });
    } catch (error) {
      console.error('Erro ao buscar blockchain minerada:', error);
      return res.status(500).json({ message: 'Erro ao buscar blockchain minerada.' });
    }
  };

  const addDocument = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      }

      const filePath = req.file.path;
      const fileHash = sha256File(filePath);

      // Upload para o Supabase Storage
      let storageData = null;
      try {
        storageData = await uploadToSupabase(filePath, req.file.originalname);
        console.log('📁 Arquivo salvo no Supabase Storage:', storageData.filename);
      } catch (storageError) {
        console.warn('⚠️ Erro ao fazer upload para o Supabase, continuando sem ele:', storageError.message);
      }

      const data = {
        filename: req.file.originalname,
        storedAs: path.basename(filePath),
        fileHash,
        owner: req.session?.user?.username || req.cookies?.username || 'Desconhecido',
        ...(storageData && {
          storageFilename: storageData.filename,
          storageUrl: storageData.url,
          storagePath: storageData.path
        })
      };

      const newBlock = new Block(Date.now(), data);
      await blockchain.addBlock(newBlock);

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

  return { getBlockchain, addDocument, getMinedBlockchain };
}

module.exports = { buildBlockchainController };