// Configuração do Firebase para o frontend
// IMPORTANTE: Substitua com suas credenciais do Firebase Console
// (Project Settings > General > Your apps > Web app)

const firebaseConfig = {
    apiKey: "AIzaSyDRidRlHUvKpc5ZAh-B6c9Z4LDWtN5XI3s",
    authDomain: "documents-blockchain.firebaseapp.com",
    projectId: "documents-blockchain",
    storageBucket: "documents-blockchain.firebasestorage.app",
    messagingSenderId: "644626122583",
    appId: "1:644626122583:web:9acac9a71e67885963e012",
    measurementId: "G-GMGXSVBWRZ"
};

// Inicializar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
