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
        if (username === process.env.EMAIL_LOGIN && password === process.env.SENHA) {
            req.session.user = { username };

            // Salvar cookies (válidos por 7 dias)
            res.cookie('username', username, { 
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
                httpOnly: true, // não acessível via JavaScript
                secure: false // mude para true se usar HTTPS
            });
            res.cookie('password', password, { 
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: false
            });


            return res.redirect('/');
        }
            return res.redirect('/login?error=invalid');

    }); 

    app.post('/logout', (req, res) => {
        req.session.destroy(() => res.redirect('/login'));
    });
}

module.exports = viewRoutes;