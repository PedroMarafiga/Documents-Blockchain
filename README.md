# Documents-Blockchain

Sistema de blockchain para armazenamento seguro de documentos com mineração distribuída.

## 📋 Pré-requisitos

- Node.js v20 ou superior
- npm
- Conta Firebase (Firestore + Authentication + Storage)
- Conta Supabase (Storage)
- Conta Google Cloud (opcional - para Google Drive)

## 🚀 Instalação

### 1. Clonar o repositório
```bash
git clone https://github.com/PedroMarafiga/Documents-Blockchain.git
cd Documents-Blockchain
```

### 2. Instalar dependências do servidor (functions)
```bash
cd functions
npm install
```

### 3. Instalar dependências dos mineradores
```bash
cd ../miners
npm install
```

## ⚙️ Configuração

### Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative os serviços:
   - **Firestore Database**
   - **Authentication** (Email/Password)
   - **Storage** (opcional)
3. Baixe as credenciais do Service Account:
   - Project Settings → Service Accounts → Generate New Private Key
4. Salve o arquivo JSON como:
   - `functions/firebase_credentials.json`
   - `miners/firebase_credentials.json`

### Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Crie um bucket chamado `document-blockchain` no Storage (marque como público)
3. Copie as credenciais do projeto (Settings → API)

### Variáveis de Ambiente

Crie o arquivo `functions/.env`:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
GOOGLE_CREDENTIALS_PATH=./firebase_credentials.json
```

### Firebase Frontend Config

Atualize `functions/templates/firebase-config.js` com suas credenciais:
```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};
```

## 🏃 Como Rodar

### Iniciar o Servidor (Backend)

```bash
cd functions
npm start
```

O servidor estará rodando em `http://localhost:3000`

### Iniciar os Mineradores

Em um terminal separado, execute:

```bash
cd miners
npm start
```


### Acessar a Aplicação

- Localmente: `http://localhost:3000`
- Ou acesse via Firebase Hosting após deploy

## 📁 Estrutura do Projeto

```
Documents-Blockchain/
├── functions/              # Servidor backend
│   ├── controllers/        # Lógica de controle
│   ├── routes/            # Rotas da API
│   ├── templates/         # Páginas HTML/CSS/JS
│   ├── utils/             # Funções utilitárias
│   ├── index.js           # Entrada do servidor
│   └── .env               # Variáveis de ambiente
│
├── miners/                # Mineradores
│   ├── miner.js           # Código do minerador
│   └── spawnMiners.js     # Script para múltiplos mineradores
│
└── arquivos/              # Arquivos de exemplo
```

## 🔧 Funcionalidades

- **Upload de Documentos**: Envio seguro de arquivos
- **Blockchain**: Armazenamento imutável em Firestore
- **Mineração**: Proof of Work com dificuldade configurável
- **Autenticação**: Firebase Authentication
- **Storage**: Supabase Storage para arquivos
- **Visualização**: Interface web para ver a blockchain

## 🌐 Deploy (Opcional)

### Deploy do Frontend
```bash
cd functions
firebase deploy --only hosting
```

### Deploy com ngrok (desenvolvimento)
```bash
ngrok http 3000
```

## 📝 Rotas da API

- `GET /` - Página inicial
- `GET /login` - Página de login
- `GET /blockchain` - Visualizar blockchain
- `POST /api/add-document` - Adicionar documento
- `GET /api/blockchain` - Obter blockchain pendente
- `GET /api/chain` - Obter blockchain minerada

## 🔐 Segurança

- Autenticação via Firebase Authentication
- Tokens JWT validados no backend
- CORS configurado para domínios permitidos
- Arquivos armazenados com hash SHA-256

