
function renderComprados() {
    const container = document.getElementById('lista-comprados-container');
    if (!container) return;
    container.innerHTML = '';

    const lista = obterListaCompras();
    const comprados = lista.filter(i => i.comprado);

    if (comprados.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#555; font-size:0.85rem; padding:25px;">Nenhum item recente marcado como comprado.</p>';
        return;
    }

    comprados.forEach(i => {
        const nomeSlug = i.nome.toLowerCase().replace(/\s+/g, '-');
        const opcoesQuantidade = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const opcoesDuracao = [
            '1 dia', '2 dias', '3 dias', '4 dias', '5 dias', '6 dias',
            '1 semana', '2 semanas', '3 semanas',
            '1 mês', '2 meses', '3 meses', '4 meses', '5 meses', '6 meses', '1 ano'
        ];

        const htmlOpcoesQtd = opcoesQuantidade.map(q => 
            `<div class="caixa-suspensa-opcao" onclick="selecionarOpcao(${i.id}, 'qtd', '${q}')">${q}</div>`
        ).join('');

        const htmlOpcoesDur = opcoesDuracao.map(d => 
            `<div class="caixa-suspensa-opcao" onclick="selecionarOpcao(${i.id}, 'dur', '${d}')">${d}</div>`
        ).join('');

        // Se o item já possuir data de compra herdada da finalização, usa-a; senão, data de hoje
        const dataCompraValor = i.dataCompra || new Date().toISOString().split('T')[0];

        container.innerHTML += `
            <div class="comprado-item-row">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div class="despensa-circle-img">
                            <img src="imagens/${nomeSlug}.png" onerror="this.src='imagens/cesta.png'" alt="${i.nome}">
                        </div>
                        <h4 style="font-size:1rem; color:#000; font-weight:400;">${i.nome}</h4>
                    </div>
                    <button onclick="reverterParaLista(${i.id})" title="Voltar para a Lista de Compras" style="background:#ffffff; border:1px solid #ccc; color:#000; font-size:0.75rem; font-weight:400; width:22px; height:22px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 2px rgba(0,0,0,0.1);">✕</button>
                </div>

                <div class="comprado-grid">
                    <label>Unidade: 
                        <select id="unidade-${i.id}" onchange="verificarCamposObrigatorios(${i.id})">
                            <option value="">Selecione</option>
                            <option value="1kg">1kg</option>
                            <option value="500g">500g</option>
                            <option value="1 unidade">1 unidade</option>
                            <option value="1 pacote">1 pacote</option>
                            <option value="1 litro">1 litro</option>
                        </select>
                    </label>

                    <label>Quantidade: 
                        <div class="caixa-suspensa">
                            <div id="qtd-cabecalho-${i.id}" class="caixa-suspensa-cabecalho" onclick="alternarCaixaSuspensa(${i.id}, 'qtd')">
                                <span id="qtd-texto-${i.id}">Selecione</span> <span>⌵</span>
                            </div>
                            <div id="qtd-lista-${i.id}" class="caixa-suspensa-lista">
                                ${htmlOpcoesQtd}
                            </div>
                        </div>
                        <input type="hidden" id="qtd-val-${i.id}" value="" onchange="verificarCamposObrigatorios(${i.id})">
                    </label>

                    <label>Duração estimada: 
                        <div class="caixa-suspensa">
                            <div id="dur-cabecalho-${i.id}" class="caixa-suspensa-cabecalho" onclick="alternarCaixaSuspensa(${i.id}, 'dur')">
                                <span id="dur-texto-${i.id}">Selecione</span> <span>⌵</span>
                            </div>
                            <div id="dur-lista-${i.id}" class="caixa-suspensa-lista">
                                ${htmlOpcoesDur}
                            </div>
                        </div>
                        <input type="hidden" id="dur-val-${i.id}" value="" onchange="verificarCamposObrigatorios(${i.id})">
                    </label>

                    <label>Data de compra: 
                        <input type="date" id="datacompra-${i.id}" value="${dataCompraValor}">
                    </label>

                    <label>Prazo de validade: 
                        <input type="date" id="val-${i.id}">
                    </label>
                </div>

                <button id="botao-adicionar-${i.id}" class="botao-adicionar-despensa" onclick="enviarParaDespensa(${i.id})">Adicionar</button>
            </div>
        `;
    });
}

function alternarCaixaSuspensa(id, tipo) {
    document.querySelectorAll('.caixa-suspensa-lista').forEach(l => {
        if (l.id !== tipo + '-lista-' + id) l.classList.remove('aberta');
    });
    const lista = document.getElementById(tipo + '-lista-' + id);
    if (lista) lista.classList.toggle('aberta');
}

function selecionarOpcao(id, tipo, valor) {
    const textoEl = document.getElementById(tipo + '-texto-' + id);
    if (textoEl) textoEl.innerText = valor;
    const inputOculto = document.getElementById(tipo + '-val-' + id);
    if (inputOculto) inputOculto.value = valor;
    const lista = document.getElementById(tipo + '-lista-' + id);
    if (lista) lista.classList.remove('aberta');
    verificarCamposObrigatorios(id);
}

function verificarCamposObrigatorios(id) {
    const unidade = document.getElementById('unidade-' + id)?.value;
    const quantidade = document.getElementById('qtd-val-' + id)?.value;
    const duracao = document.getElementById('dur-val-' + id)?.value;
    const botao = document.getElementById('botao-adicionar-' + id);
    if (!botao) return;

    if (unidade && quantidade && duracao) {
        botao.classList.add('pronto');
    } else {
        botao.classList.remove('pronto');
    }
}

// Fecha menus suspensos ao clicar fora
window.addEventListener('click', function(evento) {
    if (!evento.target.closest('.caixa-suspensa')) {
        document.querySelectorAll('.caixa-suspensa-lista').forEach(l => l.classList.remove('aberta'));
    }
});

/**
 * Reverte um item comprado de volta para a Lista de Compras pendente
 * @param {number} id 
 */
function reverterParaLista(id) {
    const lista = obterListaCompras();
    const item = lista.find(i => i.id === id);
    if (item) {
        item.comprado = false;
        item.selecionado = false;
        salvarListaComprasCompleta(lista);
        renderComprados();
    }
}

/**
 * Captura os dados do formulário de comprados, valida e envia para a Despensa (LocalStorage)
 * @param {number} id 
 */
function enviarParaDespensa(id) {
    const lista = obterListaCompras();
    const item = lista.find(i => i.id === id);
    if (!item) return;

    const unidade = document.getElementById('unidade-' + id)?.value;
    const quantidade = document.getElementById('qtd-val-' + id)?.value;
    const duracao = document.getElementById('dur-val-' + id)?.value;
    const dataCompraInput = document.getElementById('datacompra-' + id)?.value;
    const validadeInput = document.getElementById('val-' + id)?.value;

    if (!unidade || !quantidade || !duracao) {
        alert('Por favor, selecione Unidade, Quantidade e Duração estimada antes de adicionar.');
        return;
    }

    // Formata data de atualização/compra para exibição DD/MM/AAAA
    let dataAtualizacao = '';
    if (dataCompraInput) {
        const partes = dataCompraInput.split('-');
        if (partes.length === 3) {
            dataAtualizacao = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
    }
    if (!dataAtualizacao) {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        dataAtualizacao = `${dia}/${mes}/${hoje.getFullYear()}`;
    }

    // Salva na Despensa usando a função limpa de persistência
    salvarProduto({
        id: Date.now(),
        nome: item.nome,
        unidade: `${quantidade}x ${unidade}`,
        categoria: item.categoria || 'Alimentos',
        status: 'estoque',
        duracao: duracao,
        atualizacao: dataAtualizacao,
        validade: validadeInput || ''
    });

    // Remove o item da lista de compras
    removerItemLista(id);

    // Re-renderiza a tela de Comprados
    renderComprados();
}

