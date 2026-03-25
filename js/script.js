// 1. Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCvZdzKhQjaPvyrOnRI68g66HzZ_b_tN6s",
    authDomain: "portfolio-7cdcc.firebaseapp.com",
    projectId: "portfolio-7cdcc",
    storageBucket: "portfolio-7cdcc.firebasestorage.app",
    messagingSenderId: "335109013938",
    appId: "1:335109013938:web:4f3bd74cd0dc10ff69e4ab",
    measurementId: "G-NYTQ24WX08"
};

// Inicializa o Firebase apenas se ainda não foi inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// --- Interface e Interatividade ---
document.addEventListener('DOMContentLoaded', () => {

    // 2. Formulário de Contacto (Envio para Firebase)
    const form = document.getElementById('form-contacto');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const assunto = document.getElementById('assunto').value;
            const mensagem = document.getElementById('mensagem').value;

            try {
                await db.collection("mensagens").add({
                    nome: nome,
                    email: email,
                    assunto: assunto,
                    mensagem: mensagem,
                    dataEnvio: new Date()
                });
                alert("Obrigada pelo contacto, " + nome + "! Mensagem guardada.");
                form.reset();
            } catch (error) {
                console.error("Erro ao enviar:", error);
                alert("Erro ao enviar. Verifique a consola.");
            }
        });
    }

    // 3. Saudação Dinâmica baseada no horário
    const heroTitle = document.querySelector('h4');
    if (heroTitle) {
        const hora = new Date().getHours();
        let saudacao = hora < 12 ? "Olá, Bom dia!" : hora < 18 ? "Olá, Boa tarde!" : "Olá, Boa noite!";
        const span = document.createElement('span');
        span.innerText = ` ${saudacao} `;
        heroTitle.prepend(span);
    }

    // 4. Inicia a renderização dos comentários caso o elemento exista (Blog)
    if (document.getElementById('lista-comentarios-tabela')) {
        comentarioController.render();
    }
    
    // Inicia o efeito de digitação se o elemento existir
    if (document.getElementById('slogan-dinamico')) {
        escreverTexto();
    }
});

// --- 5. Efeito de Digitação ---
const textoSlogan = "Desenvolvedora Frontend | Criativa | Aspirante a Segurança Digital";
let indexSlogan = 0;

function escreverTexto() {
    const slogan = document.getElementById('slogan-dinamico');
    if (!slogan) return;
    
    if (indexSlogan < textoSlogan.length) {
        slogan.innerHTML += textoSlogan.charAt(indexSlogan);
        indexSlogan++;
        setTimeout(escreverTexto, 80);
    }
}

// --- 6. Movimento da Foto (Parallax) ---
document.addEventListener('mousemove', (e) => {
    const foto1 = document.getElementById('foto-movel');
    const foto2 = document.getElementById('foto-kesya');
    const x = (window.innerWidth / 2 - e.pageX) / 30;
    const y = (window.innerHeight / 2 - e.pageY) / 30;

    if (foto1) foto1.style.transform = `translate(${x}px, ${y}px)`;
    if (foto2) foto2.style.transform = `translate(${x}px, ${y}px)`;
});

// --- 7. Módulo CRUD: Gestão de Comentários ---
const comentarioController = {
    
    // CREATE
    create: async function() {
        const nome = document.getElementById('input-nome').value;
        const texto = document.getElementById('input-texto').value;

        if (nome && texto) {
            try {
                await db.collection("comentarios").add({
                    nome: nome,
                    texto: texto,
                    data: new Date()
                });
                this.limparForm();
            } catch (error) {
                alert("Erro ao publicar comentário.");
            }
        } else {
            alert("Preencha todos os campos!");
        }
    },

    // READ (Tempo real com onSnapshot)
    render: function() {
        const container = document.getElementById('lista-comentarios-tabela');
        if (!container) return;

        db.collection("comentarios").orderBy("data", "desc").onSnapshot((snapshot) => {
            container.innerHTML = '';
            snapshot.forEach((doc) => {
                const com = doc.data();
                const idDoc = doc.id;
                const dataF = com.data ? com.data.toDate().toLocaleString('pt-PT') : "";

                container.innerHTML += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <td style="padding: 12px; font-size: 0.8rem; opacity: 0.7;">${dataF}</td>
                        <td style="padding: 12px; font-weight: bold; color: var(--neon-blue);">${com.nome}</td>
                        <td style="padding: 12px;">${com.texto}</td>
                        <td style="padding: 12px;">
                            <button onclick="comentarioController.prepareUpdate('${idDoc}', '${com.texto}')" style="background:none; border:1px solid var(--neon-blue); color:white; padding:4px 8px; cursor:pointer; margin-right: 5px;">Editar</button>
                            <button onclick="comentarioController.delete('${idDoc}')" style="background:none; border:1px solid #ff4d4d; color:white; padding:4px 8px; cursor:pointer;">Apagar</button>
                        </td>
                    </tr>
                `;
            });
        });
    },

    // UPDATE
    prepareUpdate: async function(id, textoAntigo) {
        const novoTexto = prompt("Edite o seu comentário:", textoAntigo);
        if (novoTexto !== null && novoTexto.trim() !== "" && novoTexto !== textoAntigo) {
            await db.collection("comentarios").doc(id).update({ texto: novoTexto });
        }
    },

    // DELETE
    delete: async function(id) {
        if (confirm("Deseja apagar este comentário?")) {
            await db.collection("comentarios").doc(id).delete();
        }
    },

    limparForm: function() {
        const inome = document.getElementById('input-nome');
        const itexto = document.getElementById('input-texto');
        if(inome) inome.value = '';
        if(itexto) itexto.value = '';
    }
};