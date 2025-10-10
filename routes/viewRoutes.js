const path = require('path');

function viewRoutes(app) {
    app.get('/', async (req, res) => {
        try {
            // Envia o arquivo templates/index.html
            res.sendFile(path.join(__dirname, '..', 'templates', 'index.html'));
        } catch (error) {
            console.error('Erro ao renderizar HTML:', error);
            res.status(500).send('Erro interno do servidor');
        }
    });
}

module.exports = viewRoutes;