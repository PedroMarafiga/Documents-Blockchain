// Controlador não é mais necessário pois a rota envia diretamente o arquivo
// Mantemos um export no caso de uso futuro
const path = require('path');
const admin = require('firebase-admin');

function homeController(req, res) {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }
        // Envia o arquivo public/home.html
        res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
    } catch (error) {
        console.error('Erro ao renderizar HTML:', error);
        res.status(500).send('Erro interno do servidor');
    }

}

async function loginController(req, res) {
    const { idToken, email } = req.body;
    
    try {
        // Verificar o token do Firebase Authentication
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        // Token válido, criar sessão
        req.session.user = { 
            username: email,
            uid: uid,
            email: decodedToken.email
        };

        // Salvar cookies (válidos por 7 dias)
        res.cookie('username', email, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
            httpOnly: true,
            secure: false // mude para true se usar HTTPS
        });

        return res.status(200).json({ success: true, message: 'Login realizado com sucesso' });
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(401).json({ success: false, message: 'Token inválido' });
    }
}

module.exports = {
    homeController,
    loginController
};