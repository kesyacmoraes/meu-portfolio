// Configurações do projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvZdzKhQjaPvyrOnRI68g66HzZ_b_tN6s",
  authDomain: "portfolio-7cdcc.firebaseapp.com",
  projectId: "portfolio-7cdcc",
  storageBucket: "portfolio-7cdcc.firebasestorage.app",
  messagingSenderId: "335109013938",
  appId: "1:335109013938:web:4f3bd74cd0dc10ff69e4ab",
  measurementId: "G-NYTQ24WX08"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// Função para fazer Login
function autenticar() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Login efetuado!");
            window.location.assign("dashboard.html"); 
        })
        .catch((error) => {
            alert("Erro: " + error.message);
        });
}

// PROTEÇÃO DE ROTA DINÂMICA
auth.onAuthStateChanged((user) => {
    const path = window.location.pathname;
    const corpo = document.getElementById('corpo-admin');

    // Se a página atual NÃO for o login, precisamos de verificar o user
    if (!path.includes("login.html")) {
        if (!user) {
            // Se não houver utilizador logado, expulsa para o login
            window.location.href = "login.html";
        } else {
            // SE EXISTIR UTILIZADOR: Mostra a página, seja ela qual for
            if (corpo) {
                corpo.style.display = 'block';
                console.log("Acesso autorizado!");
            }
        }
    }
});

// Função para Sair
function logout() {
    auth.signOut().then(() => {
        alert("Sessão encerrada!");
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Erro ao sair:", error);
    });
}