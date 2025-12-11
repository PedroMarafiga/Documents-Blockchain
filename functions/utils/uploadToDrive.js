const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Função para fazer upload de arquivo para o Google Drive
async function uploadToDrive(filePath, filename) {
  try {
    // Usar firebase_credentials.json (mesmo arquivo que você testou)
    const credentialsPath = path.join(__dirname, '..', 'firebase_credentials.json');

    if (!fs.existsSync(credentialsPath)) {
      throw new Error('Credenciais do Google não encontradas em firebase_credentials.json');
    }

    // Carregar credenciais
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    // Autenticar com Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    const drive = google.drive({ version: 'v3', auth });

    // Metadados do arquivo - salvar na pasta específica
    const fileMetadata = {
      name: filename,
      parents: ['130daLUamP1Z1hya6i0kndQhGrYOK9jEO'] // ID da pasta que você testou
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath)
    };

    // Upload do arquivo
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink'
    });

    // Tornar o arquivo público (opcional - remova se não quiser)
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    console.log(`✅ Arquivo enviado para o Google Drive: ${response.data.id}`);

    return {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink
    };

  } catch (error) {
    console.error('❌ Erro ao fazer upload para o Google Drive:', error);
    throw error;
  }
}

module.exports = { uploadToDrive };
