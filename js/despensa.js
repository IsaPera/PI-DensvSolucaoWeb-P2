
let filtroAtualStatus = 'todos';
let produtoSelecionadoId = null;


function calcularStatusDinamico(produto) {
    if (!produto.atualizacao) return { status: 'estoque', texto: produto.duracao || '2 semanas' };
    
    // Suporta formato DD/MM/AAAA ou AAAA-MM-DD
    let dia, mes, ano;
    if (produto.atualizacao.includes('/')) {
        let partes = produto.atualizacao.split('/');
        dia = parseInt(partes[0], 10);
        mes = parseInt(partes[1], 10) - 1;
        ano = partes[2] ? parseInt(partes[2], 10) : new Date().getFullYear();
    } else if (produto.atualizacao.includes('-')) {
        let partes = produto.atualizacao.split('-');
        ano = parseInt(partes[0], 10);
        mes = parseInt(partes[1], 10) - 1;
        dia = parseInt(partes[2], 10);
    } else {
        return { status: 'estoque', texto: produto.duracao || '2 semanas' };
    }

    let dataAtualizacao = new Date(ano, mes, dia);
    let hoje = new Date();
    
    let diffEmDias = Math.floor((hoje - dataAtualizacao) / (1000 * 60 * 60 * 24));
    let duracaoDias = 14; 
    let duracaoStr = (produto.duracao || '').toLowerCase();
    
    if (duracaoStr.includes('1 dia')) duracaoDias = 1;
    else if (duracaoStr.includes('2 dias')) duracaoDias = 2;
    else if (duracaoStr.includes('3 dias')) duracaoDias = 3;
    else if (duracaoStr.includes('4 dias')) duracaoDias = 4;
    else if (duracaoStr.includes('5 dias')) duracaoDias = 5;
    else if (duracaoStr.includes('6 dias')) duracaoDias = 6;
    else if (duracaoStr.includes('1 semana')) duracaoDias = 7;
    else if (duracaoStr.includes('2 semanas')) duracaoDias = 14;
    else if (duracaoStr.includes('3 semanas')) duracaoDias = 21;
    else if (duracaoStr.includes('1 mês')) duracaoDias = 30;
    else if (duracaoStr.includes('2 meses')) duracaoDias = 60;
    else if (duracaoStr.includes('3 meses')) duracaoDias = 90;
    else if (duracaoStr.includes('6 meses')) duracaoDias = 180;
    else if (duracaoStr.includes('1 ano')) duracaoDias = 365;

    let diasRestantes = duracaoDias - diffEmDias;

    let status = 'estoque';
    if (diasRestantes <= 6) {
        status = 'falta';
    } else if (diasRestantes <= 14) {
        status = 'finalizando';
    } else {
        status = 'estoque';
    }

    let textoDinamico = '';
    if (diasRestantes <= 0) {
        textoDinamico = 'Acabando (0 dias)';
    } else if (diasRestantes === 1) {
        textoDinamico = 'Acabando (< 1 dia restante)';
    } else if (diasRestantes <= 7) {
        textoDinamico = 'Acabando (< 1 semana restante)';
    } else if (diasRestantes <= 14) {
        textoDinamico = 'Repor em breve (1 a 2 semanas)';
    } else if (diasRestantes <= 21) {
        textoDinamico = 'Em estoque (2 a 3 semanas)';
    } else {
        textoDinamico = `Em estoque (${diasRestantes} dias restantes)`;
    }

    return { status: status, texto: textoDinamico };
}

/**
 * Renderiza os produtos da despensa aplicando os filtros de status e busca textual
 * @param {string} filtroTexto 
 */
function renderDespensa(filtroTexto = '') {
    const container = document.getElementById('lista-despensa-container');
    if (!container) return;
    container.innerHTML = '';

    const produtos = obterProdutos();

    // Recalcula status dinâmico para cada produto
    produtos.forEach(produto => {
        const calculo = calcularStatusDinamico(produto);
        produto.statusCalculado = calculo.status;
        produto.duracaoCalculada = calculo.texto;
    });

    const buscaLimpa = filtroTexto.trim().toLowerCase();

    // Filtragem combinada: busca textual + status
    let filtrados = produtos.filter(produto => {
        const combinaTexto = !buscaLimpa || produto.nome.toLowerCase().includes(buscaLimpa);
        const combinaStatus = filtroAtualStatus === 'todos' || produto.statusCalculado === filtroAtualStatus;
        return combinaTexto && combinaStatus;
    });

    // Ordenação de urgência quando em "Todos": falta -> finalizando -> estoque
    if (filtroAtualStatus === 'todos') {
        const pesoStatus = { 'falta': 1, 'finalizando': 2, 'estoque': 3 };
        filtrados.sort((a, b) => (pesoStatus[a.statusCalculado] || 9) - (pesoStatus[b.statusCalculado] || 9));
    }

    if (filtrados.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#555; font-size:0.85rem; padding:20px;">Nenhum produto encontrado.</p>';
        return;
    }

    filtrados.forEach(produto => {
        const bolinha = produto.statusCalculado === 'estoque' ? '🟢' : produto.statusCalculado === 'finalizando' ? '🟡' : '🔴';
        const nomeSlug = produto.nome.toLowerCase().replace(/\s+/g, '-');
        const dataExibicao = produto.atualizacao || 'Recente';

        container.innerHTML += `
            <div class="despensa-row-item">
                <div class="despensa-item-left">
                    <div class="despensa-circle-img">
                        <img src="imagens/${nomeSlug}.png" onerror="this.src='imagens/cesta.png'" alt="${produto.nome}">
                    </div>
                    <div class="despensa-item-details">
                        <h4>${produto.nome}</h4>
                        <p>${produto.unidade || ''}<br>Última atualização: ${dataExibicao}<br>${bolinha} ${produto.duracaoCalculada}</p>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button class="botao-remover-item-lista" onclick="deletarProdutoDespensa(${produto.id})" title="Remover produto da despensa">✕</button>
                    <span class="seta-indicador" style="cursor:pointer; padding:5px 8px;" onclick="abrirModalAcao(${produto.id})">➤</span>
                </div>
            </div>
        `;
    });
}

/**
 * Evento de digitação na caixa de busca
 */
function filtrarDespensa() {
    const input = document.getElementById('busca-despensa');
    const valor = input ? input.value : '';
    renderDespensa(valor);
}

/**
 * Evento de clique nos chips de filtro
 * @param {string} status - 'todos' | 'estoque' | 'finalizando' | 'falta'
 * @param {HTMLElement} elemento 
 */
function filtrarStatus(status, elemento) {
    filtroAtualStatus = status;
    document.querySelectorAll('.botao-chip').forEach(c => c.classList.remove('ativo'));
    if (elemento) elemento.classList.add('ativo');
    const input = document.getElementById('busca-despensa');
    renderDespensa(input ? input.value : '');
}

/**
 * Exclui produto diretamente da despensa usando a camada storage.js
 * @param {number} id 
 */
function deletarProdutoDespensa(id) {
    if (confirm('Deseja realmente remover este produto da despensa?')) {
        removerProduto(id);
        renderDespensa(document.getElementById('busca-despensa')?.value || '');
    }
}

/**
 * Abre o modal de ação (Mover para Comprados ou Enviar para Lista)
 * @param {number} id 
 */
function abrirModalAcao(id) {
    produtoSelecionadoId = id;
    const produtos = obterProdutos();
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        document.getElementById('modal-produto-nome').innerText = produto.nome;
        document.getElementById('modal-acao-despensa').style.display = 'flex';
    }
}

function fecharModalAcao() {
    document.getElementById('modal-acao-despensa').style.display = 'none';
    produtoSelecionadoId = null;
}

/**
 * Ação do modal: envia o produto da despensa para a Lista de Compras
 */
function enviarDaDespensaParaLista() {
    if (!produtoSelecionadoId) return;
    const produtos = obterProdutos();
    const produto = produtos.find(p => p.id === produtoSelecionadoId);
    if (produto) {
        salvarItemLista({
            id: Date.now(),
            nome: produto.nome,
            categoria: produto.categoria || 'Alimentos',
            selecionado: false,
            comprado: false,
            dataCompra: ''
        });
        removerProduto(produtoSelecionadoId);
        fecharModalAcao();
        renderDespensa();
    }
}

/**
 * Ação do modal: move o item para a tela de Comprados
 */
function enviarDaDespensaParaComprados() {
    if (produtoSelecionadoId === null) return;
    const id = produtoSelecionadoId;
    fecharModalAcao();
    abrirModalComprado(id, 'despensa');
}
