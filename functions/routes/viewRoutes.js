const path = require('path');

function viewRoutes(app) {
    app.get('/', async (req, res) => {
    
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
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'templates', 'login.html'));
    });

    // processa submissão do login
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        // TODO: substituir por validação real (BD, hash etc.)
        if (username === 'admin' && password === 'senha') {
            req.session.user = { username };
            return res.redirect('/');
        }
        return res.status(401).send('Credenciais inválidas');
    });

    app.post('/logout', (req, res) => {
        req.session.destroy(() => res.redirect('/login'));
    });
}

module.exports = viewRoutes;