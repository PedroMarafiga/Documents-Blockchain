const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { Blockchain } = require('./blockchain');
const { Block } = require('./block');
const viewRoutes = require('./routes/viewRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'troque-por-uma-chave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // secure:true só em HTTPS
}));

// Garantir diretório de uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config para salvar arquivos enviados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // manter nome original com timestamp para evitar colisões
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${timestamp}__${safeName}`);
  }
});
const upload = multer({ storage });

// Blockchain instance
const blockchain = new Blockchain();

// Função assíncrona para inicializar o servidor
async function startServer() {
  // Inicializar blockchain (carregar do Firebase)
  await blockchain.init();
  
  // Ajustar index do bloco para continuar a partir do tamanho atual da cadeia
  try {
    if (Array.isArray(blockchain.chain)) {
      Block.indexCount = blockchain.chain.length;
    }
  } catch {}

  // SERVIR ARQUIVOS ESTÁTICOS (CSS/JS/IMAGENS) em /static
  app.use('/public', express.static(path.join(__dirname, 'public')));

  viewRoutes(app);
  // injeta dependências necessárias nas rotas da blockchain
  blockchainRoutes(app, { upload, blockchain });

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}/`);
    console.log(`Blockchain inicializada com ${blockchain.chain.length} bloco(s)`);
  });
}

// Iniciar servidor
startServer().catch(err => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});

