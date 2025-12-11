// Configuração da API
const API_CONFIG = {
    // URL do ngrok - Troque aqui quando o ngrok gerar uma nova URL
    NGROK_URL: 'https://0214541622f5.ngrok-free.app',
    
    // Detecta automaticamente se está rodando localmente
    isLocal() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    },
    
    // Retorna a URL base da API
    getBaseURL() {
        return this.isLocal() ? '' : this.NGROK_URL;
    },
    
    // Constrói a URL completa da API
    getAPIUrl(endpoint) {
        return `${this.getBaseURL()}${endpoint}`;
    },
    
    // Retorna os headers necessários (inclui bypass do ngrok warning)
    getHeaders(additionalHeaders = {}) {
        const headers = {
            'ngrok-skip-browser-warning': 'true',
            ...additionalHeaders
        };
        return headers;
    }
};

// Exporta para uso em outros arquivos
window.API_CONFIG = API_CONFIG;
