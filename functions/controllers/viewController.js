// Controlador não é mais necessário pois a rota envia diretamente o arquivo
// Mantemos um export no caso de uso futuro
const path = require('path');

function homeController(req, res) {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }
        // Envia o arquivo templates/index.html
        res.sendFile(path.join(__dirname, '..', 'templates', 'index.html'));
    } catch (error) {
        console.error('Erro ao renderizar HTML:', error);
        res.status(500).send('Erro interno do servidor');
    }

}

function loginController(req, res) {
    const { username, password } = req.body;
    // TODO: substituir por validação real (BD, hash etc.)
    if (username === process.env.EMAIL_LOGIN && password === process.env.SENHA) {
        req.session.user = { username };

        // Salvar cookies (válidos por 7 dias)
        res.cookie('username', username, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
            httpOnly: true, // não acessível via JavaScript
            secure: true // mude para true se usar HTTPS
        });
        res.cookie('password', password, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        });


        return res.redirect('/');
    }
    return res.redirect('/login?error=invalid');
}

module.exports = {
    homeController,
    loginController
};