/**
 * ESTE FICHEIRO TRATA APENAS DA RENDERIZAÇÃO DINÂMICA
 * A configuração do Firebase (db) deve vir do script.js
 */

// --- FUNÇÕES DE CARREGAMENTO ---

async function carregarConteudoSkills() {
    const tabela = document.getElementById('tabela-corpo');
    const listaAcademica = document.getElementById('lista-academica');
    const listaSoft = document.getElementById('lista-soft');
    const listaHard = document.getElementById('lista-hard');

    if (!tabela && !listaAcademica && !listaSoft && !listaHard) return;

    try {
        const snapshot = await db.collection("formacoes").orderBy("ano", "desc").get();
        
        if (tabela) tabela.innerHTML = ""; 
        if (listaAcademica) listaAcademica.innerHTML = ""; 
        if (listaSoft) listaSoft.innerHTML = ""; 
        if (listaHard) listaHard.innerHTML = "";

        snapshot.forEach(doc => {
            const f = doc.data();
            
            if (f.tipo === "Academica") {
                if (listaAcademica) {
                    listaAcademica.innerHTML += `
                        <li style="margin-bottom: 15px;">
                            ★ <strong>${f.area}</strong><br>
                            <small style="color: #bbb;">${f.instituicao || ''} (${f.ano || ''})</small>
                        </li>`;
                }
            } 
            else if (f.tipo === "Soft") {
                if (listaSoft) {
                    listaSoft.innerHTML += `
                        <li style="margin-bottom: 15px;">
                            <span style="color: var(--neon-pink);">★</span> <strong>${f.area}</strong>
                            <p style="font-size: 0.85rem; color: #ccc; margin: 5px 0 0 15px;">${f.descricao || ''}</p>
                        </li>`;
                }
            } 
            else if (f.tipo === "Hard") {
                if (listaHard) {
                    listaHard.innerHTML += `
                        <li style="margin-bottom: 15px;">
                            <span style="color: var(--neon-blue);">★</span> <strong>${f.area}</strong>
                            <p style="font-size: 0.85rem; color: #ccc; margin: 5px 0 0 15px;">${f.descricao || ''}</p>
                        </li>`;
                }
            }
            else {
                if (tabela) {
                    const corEstado = f.estado === "Concluído" ? "#00ff88" : "var(--neon-blue)";
                    tabela.innerHTML += `
                        <tr>
                            <td><strong>${f.area}</strong></td>
                            <td style="font-size: 0.9rem;">${f.descricao || ''}</td>
                            <td>${f.instituicao || ''}</td>
                            <td>${f.ano || ''}</td>
                            <td style="color: ${corEstado};">${f.estado || '---'}</td>
                        </tr>`;
                }
            }
        });
    } catch (error) {
        console.error("Erro ao carregar conteúdo:", error);
    }
}

async function carregarProjetos() {
    const container = document.getElementById('container-projetos');
    if (!container) return;

    try {
        const snapshot = await db.collection("projetos").orderBy("dataCriacao", "desc").get();
        container.innerHTML = "";

        snapshot.forEach(doc => {
            const p = doc.data();
            container.innerHTML += `
                <section class="card" style="grid-column: span 2; margin-bottom: 20px;">
                    <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
                        <img src="${p.linkImagem || '../assets/img/3.png'}" alt="Preview" style="width: 200px; height: 120px; object-fit: cover; border-radius: 15px; border: 1px solid var(--neon-pink);">
                        <div style="flex: 1; min-width: 250px;">
                            <h2 style="color: var(--neon-pink);">${p.titulo || p.nome}</h2>
                            <p>${p.descricao}</p>
                            <p style="margin: 10px 0;"><strong>Stack:</strong> ${p.tecnologias}</p>
                            <a href="${p.link}" target="_blank">
                               <button style="cursor: pointer; padding: 8px 15px;">Ver Projeto</button>
                            </a>
                        </div>
                    </div>
                </section>`;
        });
    } catch (error) {
        console.error("Erro ao carregar projetos:", error);
    }
}

async function carregarPostsBlogPublico() {
    const container = document.getElementById('blog-container');
    if (!container) return;

    try {
        const snapshot = await db.collection("posts_blog").orderBy("data", "desc").get();
        container.innerHTML = "";

        if (snapshot.empty) {
            container.innerHTML = "<p style='text-align: center; grid-column: span 2;'>Ainda não há artigos publicados.</p>";
            return;
        }

        snapshot.forEach((doc, index) => {
            const post = doc.data();
            const isLarge = index % 3 === 0; 
            const gridStyle = isLarge ? 'style="grid-column: span 2;"' : '';

            container.innerHTML += `
                <article class="card" ${gridStyle} style="display: flex; align-items: center; padding: 25px; min-height: 280px; overflow: hidden;">
                    <div style="display: flex; gap: 30px; flex-wrap: wrap; align-items: center; width: 100%; justify-content: center;">
                        
                        ${post.imagem ? `
                            <div style="flex-shrink: 0;">
                                <img src="${post.imagem}" alt="Thumbnail" 
                                    style="width: 160px; height: 160px; border-radius: 20px; object-fit: cover; border: 2px solid var(--neon-pink); box-shadow: 0 0 15px var(--neon-pink);">
                            </div>` : ''}

                        <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column; justify-content: center;">
                            <span style="color: var(--neon-pink); font-weight: bold; font-size: 0.75rem; letter-spacing: 1px;">#INSIGHTS</span>
                            <h2 style="margin: 12px 0; font-size: 1.5rem; color: #fff; line-height: 1.2;">${post.titulo}</h2>
                            <p style="font-size: 1rem; opacity: 0.85; color: #eee; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                ${post.resumo}
                            </p>
                            <div>
                                <button onclick="abrirArtigo('${doc.id}')" style="padding: 10px 25px; border-radius: 8px; background: linear-gradient(45deg, var(--neon-pink), #ff75c3); color: white; border: none; cursor: pointer; font-weight: bold;">
                                    Ler Artigo
                                </button>
                            </div>
                        </div>

                    </div>
                </article>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar blog:", error);
    }
}


async function abrirArtigo(id) {
    const modal = document.getElementById('article-modal');
    const content = document.getElementById('modal-content');
    
    try {
        const doc = await db.collection("posts_blog").doc(id).get();
        if (doc.exists) {
            const p = doc.data();
            content.innerHTML = `
                <img src="${p.imagem}" style="width:100%; height:300px; object-fit:cover; border-radius:15px; margin-bottom:20px;">
                <h1 style="color: var(--neon-pink); margin-bottom:10px;">${p.titulo}</h1>
                <p style="opacity:0.6; font-size:0.9rem; margin-bottom:20px;">Publicado em: ${p.data ? p.data.toDate().toLocaleDateString('pt-PT') : '---'}</p>
                <div style="line-height:1.8; font-size:1.1rem; white-space: pre-wrap;">${p.conteudo || p.resumo}</div>
            `;
            modal.style.display = "block";
            document.body.style.overflow = "hidden"; // Impede scroll na página de baixo
        }
    } catch (error) {
        console.error("Erro ao abrir artigo:", error);
    }
}

function fecharModal() {
    document.getElementById('article-modal').style.display = "none";
    document.body.style.overflow = "auto"; // Devolve o scroll
}


// --- INICIALIZAÇÃO ---
window.addEventListener('DOMContentLoaded', () => {
    carregarConteudoSkills();
    carregarProjetos();
    carregarPostsBlogPublico();
});