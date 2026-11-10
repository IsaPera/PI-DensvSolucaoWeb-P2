
function alternarCategoria(slugCategoria) {
    const involucro = document.getElementById('wrapper-cat-' + slugCategoria);
    const seta = document.getElementById('arrow-cat-' + slugCategoria);
    if (involucro) {
        if (involucro.classList.contains('recolhido')) {
            involucro.classList.remove('recolhido');
            if (seta) seta.innerText = '^';
        } else {
            involucro.classList.add('recolhido');
            if (seta) seta.innerText = 'v';
        }
    }
}

/**
 * Renderiza o checklist de compras organizado por categorias
 */
function renderListaCompras() {
    const container = document.getElementById('lista-compras-container');
    if (!container) return;
    container.innerHTML = '';

    const lista = obterListaCompras();
    const categorias = [
        { nome: 'Alimentos', slug: 'alimentos' },
        { nome: 'Higiene', slug: 'higiene' },
        { nome: 'Limpeza', slug: 'limpeza' }
    ];

    // Contabiliza quantos itens estão selecionados no checklist
    let itensSelecionadosCount = 0;

    categorias.forEach(cat => {
        // Exibe apenas os itens pendentes (ainda não concluídos/comprados)
        const itensCat = lista.filter(i => i.categoria === cat.nome && !i.comprado);
        
        const htmlItens = itensCat.map(i => {
            const isChecked = i.selecionado ? 'checked' : '';
            if (i.selecionado) itensSelecionadosCount++;

            return `
                <div class="checklist-row-item">
                    <label>
                        <input type="checkbox" ${isChecked} onchange="alternarSelecaoItem(${i.id}, this.checked)">
                        <span class="${i.selecionado ? 'item-checado-texto' : ''}">${i.nome}</span>
                    </label>
                    <button class="botao-remover-item-lista" onclick="excluirItemDaLista(${i.id})" title="Remover item">✕</button>
                </div>
            `;
        }).join('');

        container.innerHTML += `
            <div class="bloco-categoria-nota">
                <h4 class="cabecalho-categoria-nota" onclick="alternarCategoria('${cat.slug}')">
                    <span class="conteudo-titulo-categoria">
                        <img src="imagens/${cat.slug}.png" alt="${cat.nome}" class="imagem-icone-categoria">
                        ${cat.nome}
                    </span>
                    <span id="arrow-cat-${cat.slug}">^</span>
                </h4>
                <div id="wrapper-cat-${cat.slug}" class="envoltorio-itens-categoria">
                    ${htmlItens || '<p style="font-size:0.75rem; color:#777; padding:4px 0;">Nenhum item pendente.</p>'}
                </div>
            </div>
        `;
    });

    // Atualiza ou cria a barra inferior com botão de finalizar compra
    atualizarBarraFinalizarCompra(itensSelecionadosCount);
}

/**
 * Atualiza o estado visual do botão "Finalizar Compra"
 * @param {number} totalSelecionados 
 */
function atualizarBarraFinalizarCompra(totalSelecionados) {
    let containerAcao = document.getElementById('container-acao-finalizar-compra');
    if (!containerAcao) {
        containerAcao = document.createElement('div');
        containerAcao.id = 'container-acao-finalizar-compra';
        containerAcao.className = 'container-acao-finalizar';
        const listaTela = document.getElementById('tela-lista');
        if (listaTela) {
            listaTela.appendChild(containerAcao);
        }
    }

    if (totalSelecionados > 0) {
        containerAcao.innerHTML = `
            <button class="botao-finalizar-compra" onclick="finalizarCompra()">
                ✓ Finalizar Compra (${totalSelecionados} ${totalSelecionados === 1 ? 'item' : 'itens'})
            </button>
        `;
        containerAcao.style.display = 'block';
    } else {
        containerAcao.innerHTML = '';
        containerAcao.style.display = 'none';
    }
}


function alternarSelecaoItem(id, selecionado) {
    const lista = obterListaCompras();
    const item = lista.find(i => i.id === id);
    if (item) {
        item.selecionado = selecionado;
        salvarListaComprasCompleta(lista);
        renderListaCompras();
    }
}

/**
 * Adiciona um novo item digitado à lista de compras
 */
function adicionarNaLista() {
    const entrada = document.getElementById('novo-item-lista');
    if (!entrada) return;
    const nome = entrada.value.trim();
    if (!nome) return;

    salvarItemLista({
        id: Date.now(),
        nome: nome,
        categoria: 'Alimentos', // Padrão Alimentos
        selecionado: false,
        comprado: false,
        dataCompra: ''
    });

    entrada.value = '';
    renderListaCompras();
}


function excluirItemDaLista(id) {
    removerItemLista(id);
    renderListaCompras();
}


function finalizarCompra() {
    const inputData = document.getElementById('input-data-compra');
    const dataEscolhida = inputData && inputData.value ? inputData.value : new Date().toISOString().split('T')[0];

    const lista = obterListaCompras();
    let alterou = false;

    lista.forEach(item => {
        if (item.selecionado && !item.comprado) {
            item.comprado = true;
            item.selecionado = false; // Desmarca para não ficar checado no futuro
            item.dataCompra = dataEscolhida;
            alterou = true;
        }
    });

    if (alterou) {
        salvarListaComprasCompleta(lista);
        // Redireciona para a tela de Comprados
        mudarTela('comprados');
    }
}

