const db = firebase.firestore();

// --- 1. FUNÇÕES DE APOIO ---

function limparCampos() {
    document.querySelectorAll('input, textarea').forEach(i => i.value = '');
    document.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html";
    });
}

// --- 2. FUNÇÕES DE CRIAÇÃO (CREATE) ---

async function criarFormacaoCompleta() {
    const dados = {
        area: document.getElementById('f-area').value,
        descricao: document.getElementById('f-desc').value,
        instituicao: document.getElementById('f-inst').value,
        ano: document.getElementById('f-ano').value,
        tipo: "Academica",
        estado: document.getElementById('f-estado').value,
        dataCriacao: new Date()
    };

    if(!dados.area || !dados.instituicao) return alert("Preenche o nome e a instituição!");

    try {
        await db.collection("formacoes").add(dados);
        alert("Formação registada com sucesso!");
        limparCampos();
    } catch (e) { alert("Erro: " + e.message); }
}

async function criarSkillSimples() {
    const dados = {
        area: document.getElementById('s-nome').value,
        descricao: document.getElementById('s-desc').value,
        tipo: document.getElementById('s-tipo').value,
        instituicao: "", 
        ano: "",
        estado: "", 
        dataCriacao: new Date()
    };

    if(!dados.area) return alert("Escreve o nome da skill!");

    try {
        await db.collection("formacoes").add(dados);
        alert("Skill adicionada!");
        limparCampos();
    } catch (e) { alert("Erro: " + e.message); }
}

// (Funções de Blog e Projetos permanecem as mesmas que já tinhas)
async function criarPostBlog() {
    const dados = {
        titulo: document.getElementById('b-titulo').value,
        resumo: document.getElementById('b-resumo').value,
        imagem: document.getElementById('b-link').value,
        data: new Date()
    };
    try {
        await db.collection("posts_blog").add(dados);
        alert("Artigo publicado!");
        limparCampos();
    } catch (e) { alert("Erro: " + e); }
}

async function criarProjeto() {
    const dados = {
        titulo: document.getElementById('p-nome').value,
        tecnologias: document.getElementById('p-tech').value,
        descricao: document.getElementById('p-desc').value,
        link: document.getElementById('p-link').value,
        dataCriacao: new Date()
    };
    try {
        await db.collection("projetos").add(dados);
        alert("Projeto adicionado!");
        limparCampos();
    } catch (e) { alert("Erro: " + e); }
}

// --- 3. FUNÇÕES DE LISTAGEM (READ) ---

function carregarTabelasFormacoesESkills() {
    const tabelaAcad = document.getElementById('tabela-academica-body');
    const tabelaSkills = document.getElementById('tabela-skills-body');

    if (!tabelaAcad && !tabelaSkills) return;

    db.collection("formacoes").orderBy("dataCriacao", "desc").onSnapshot((snapshot) => {
        if (tabelaAcad) tabelaAcad.innerHTML = '';
        if (tabelaSkills) tabelaSkills.innerHTML = '';

        snapshot.forEach((doc) => {
            const f = doc.data();
            const id = doc.id;

            // --- NOVA LÓGICA DE TRIAGEM ---
            // Se tiver Instituição OU for do tipo Academica, vai para a tabela superior
            if (f.tipo === "Academica" || (f.instituicao && f.instituicao.trim() !== "")) {
                if (tabelaAcad) {
                    tabelaAcad.innerHTML += `
                        <tr>
                            <td><strong>${f.area}</strong><br><small>${f.instituicao || ''}</small></td>
                            <td>${f.ano || '---'}</td>
                            <td style="color: ${f.estado === 'Concluído' ? '#00ff88' : '#ffcc00'}">${f.estado || 'Em curso'}</td>
                            <td>
                                <button class="btn-action btn-edit" onclick="editarAcademica('${id}')">Editar</button>
                                <button class="btn-action btn-delete" onclick="eliminarItem('formacoes', '${id}')">Apagar</button>
                            </td>
                        </tr>`;
                }
            } 
            // Caso contrário (Soft, Hard ou sem instituição), vai para a tabela de Skills
            else {
                if (tabelaSkills) {
                    tabelaSkills.innerHTML += `
                        <tr>
                            <td><strong>${f.area}</strong></td>
                            <td>${f.descricao || '---'}</td>
                            <td><span style="color: var(--neon-blue)">${f.tipo || 'Hard'}</span></td>
                            <td>
                                <button class="btn-action btn-edit" onclick="editarSkillSimples('${id}')">Editar</button>
                                <button class="btn-action btn-delete" onclick="eliminarItem('formacoes', '${id}')">Apagar</button>
                            </td>
                        </tr>`;
                }
            }
        });
    });
}

// --- 4. FUNÇÕES DE EDIÇÃO (UPDATE) ---

async function editarAcademica(id) {
    try {
        const doc = await db.collection("formacoes").doc(id).get();
        const f = doc.data();

        const area = prompt("Nome da Formação:", f.area);
        if (area === null) return;
        const inst = prompt("Instituição:", f.instituicao);
        const ano = prompt("Ano:", f.ano);
        const desc = prompt("Descrição:", f.descricao);
        const estado = confirm("A formação está concluída? (OK = Sim / Cancelar = Em curso)") ? "Concluído" : "Em curso";

        await db.collection("formacoes").doc(id).update({ 
            area, instituicao: inst, ano, descricao: desc, estado 
        });
        alert("Formação atualizada!");
    } catch (e) { alert("Erro ao editar: " + e.message); }
}

async function editarSkillSimples(id) {
    try {
        const doc = await db.collection("formacoes").doc(id).get();
        const f = doc.data();

        const area = prompt("Nome da Skill:", f.area);
        if (area === null) return;
        const desc = prompt("Descrição/Detalhes:", f.descricao);

        await db.collection("formacoes").doc(id).update({ area, descricao: desc });
        alert("Skill atualizada!");
    } catch (e) { alert("Erro ao editar: " + e.message); }
}

// Funções de apoio para Projetos e Blog (conforme o teu código anterior)
function carregarTabelaProjetos() {
    const tabela = document.getElementById('tabela-projetos-body');
    if (!tabela) return;
    db.collection("projetos").orderBy("dataCriacao", "desc").onSnapshot(snapshot => {
        tabela.innerHTML = '';
        snapshot.forEach(doc => {
            const p = doc.data();
            tabela.innerHTML += `<tr><td><strong>${p.titulo || p.nome}</strong></td><td>${p.tecnologias}</td><td>${p.descricao}</td>
            <td><button class="btn-action btn-edit" onclick="prepararEdicaoProjeto('${doc.id}')">Alterar</button>
            <button class="btn-action btn-delete" onclick="eliminarItem('projetos', '${doc.id}')">Apagar</button></td></tr>`;
        });
    });
}

async function eliminarItem(colecao, id) {
    if (confirm("Tens a certeza que queres apagar este item permanentemente?")) {
        try {
            await db.collection(colecao).doc(id).delete();
            alert("Removido!");
        } catch (e) { alert("Erro ao apagar: " + e); }
    }
}

// --- 5. INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    carregarTabelasFormacoesESkills(); // Carrega as duas tabelas novas
    if (document.getElementById('tabela-projetos-body')) carregarTabelaProjetos();
    // Adicionar carregarTabelaBlog() se necessário
});