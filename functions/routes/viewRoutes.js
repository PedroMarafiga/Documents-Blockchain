const path = require('path');
const { homeController, loginController } = require('../controllers/viewController');

function viewRoutes(app) {
    app.get('/', homeController);

    app.get('/blockchain', (req, res) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }
        res.sendFile(path.join(__dirname, '..', 'public', 'blockchain.html'));
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
    });

    // processa submissão do login
    app.post('/login', loginController);

    app.post('/logout', (req, res) => {
        req.session.destroy(() => res.redirect('/login'));
    });
}

module.exports = viewRoutes;