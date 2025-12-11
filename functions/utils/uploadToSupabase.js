const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function sanitizeFilename(filename) {
  return filename
    .normalize('NFKD')                     // remove acentos
    .replace(/[\u0300-\u036f]/g, '')       // remove diacríticos
    .replace(/[^a-zA-Z0-9._-]/g, '_');     // troca tudo fora do permitido
}

async function uploadToSupabase(filePath, filename) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY devem estar configurados no .env');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const fileBuffer = fs.readFileSync(filePath);

  // 🔥 Sanitiza o nome do arquivo
  const cleanName = sanitizeFilename(filename);

  const timestamp = Date.now();
  const finalName = `${timestamp}_${cleanName}`;

  const { data, error } = await supabase.storage
    .from('document-blockchain')
    .upload(finalName, fileBuffer, {
      contentType: 'application/pdf',
      upsert: false
    });

  if (error) {
    throw new Error(`Erro ao fazer upload no Supabase: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('document-blockchain')
    .getPublicUrl(finalName);

  return {
    filename: finalName,
    url: publicUrlData.publicUrl,
    path: data.path
  };
}

module.exports = { uploadToSupabase };
