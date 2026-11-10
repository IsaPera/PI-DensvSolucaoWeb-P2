let modalCompradoAtual = null;
let filaFinalizacaoCompras = [];

const opcoesUnidadeComprados = ['1kg', '500g', '250g', '2kg', '5kg', '1 unidade', '1 pacote', '1 caixa', '1L', '500ml', '200ml', '100g', '100ml'];
const opcoesDuracaoComprados = ['1 dia', '2 dias', '3 dias', '4 dias', '5 dias', '6 dias', '1 semana', '2 semanas', '3 semanas', '1 mês', '2 meses', '3 meses', '4 meses', '5 meses', '6 meses', '7 meses', '8 meses', '9 meses', '10 meses', '11 meses', '1 ano'];

function dataHojeISO() {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
}

function formatarDataISO(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '')) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function escaparHtml(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caractere]);
}

function criarOpcoes(opcoes, selecionado) {
    return opcoes.map(opcao => `<option value="${escaparHtml(opcao)}" ${opcao === String(selecionado || '') ? 'selected' : ''}>${escaparHtml(opcao)}</option>`).join('');
}

function dataISOEmDias(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '')) return null;
    const [ano, mes, dia] = data.split('-').map(Number);
    const valor = Date.UTC(ano, mes - 1, dia) / 86400000;
    const verificacao = new Date(valor * 86400000);
    if (verificacao.getUTCFullYear() !== ano || verificacao.getUTCMonth() + 1 !== mes || verificacao.getUTCDate() !== dia) return null;
    return valor;
}

function duracaoCompradoEmDias(duracao) {
    const resultado = /^(\d+)\s+(dia|dias|semana|semanas|mês|meses|ano|anos)$/.exec(duracao || '');
    if (!resultado) return null;
    const numero = Number(resultado[1]);
    const unidade = resultado[2];
    if (unidade.startsWith('dia')) return numero;
    if (unidade.startsWith('semana')) return numero * 7;
    if (unidade === 'mês' || unidade === 'meses') return numero * 30;
    return numero * 365;
}

function calcularAlertaComprado(item) {
    const hoje = dataISOEmDias(dataHojeISO());
    const prazoValidade = dataISOEmDias(item.validade);
    const dataCompra = dataISOEmDias(item.dataCompra);
    const duracao = duracaoCompradoEmDias(item.duracao);
    const avisos = [];

    if (prazoValidade !== null) avisos.push({ tipo: 'validade', dias: prazoValidade - hoje });
    if (dataCompra !== null && duracao !== null) avisos.push({ tipo: 'duracao', dias: dataCompra + duracao - hoje });
    if (!avisos.length) return null;
    avisos.sort((a, b) => a.dias - b.dias);
    const maisProximo = avisos[0];
    if (maisProximo.dias > 7) return null;

    if (maisProximo.tipo === 'validade') {
        if (maisProximo.dias < 0) return 'Validade vencida';
        if (maisProximo.dias === 0) return 'Vence hoje';
        if (maisProximo.dias === 1) return 'Validade amanhã';
        return `Validade em ${maisProximo.dias} dias`;
    }
    if (maisProximo.dias <= 0) return 'Previsão de consumo atingida';
    if (maisProximo.dias === 1) return 'Pode acabar amanhã';
    return `Pode acabar em ${maisProximo.dias} dias`;
}

function atualizarAlertasComprados() {
    const alertas = obterListaCompras().filter(item => item.comprado && calcularAlertaComprado(item)).length;
    ['alerta-comprados-inicio', 'alerta-comprados-aba'].forEach(id => {
        const indicador = document.getElementById(id);
        if (!indicador) return;
        indicador.hidden = alertas === 0;
        indicador.textContent = alertas > 9 ? '9+' : String(alertas);
        indicador.setAttribute('aria-label', `${alertas} ${alertas === 1 ? 'produto precisa' : 'produtos precisam'} de atenção`);
    });
}

function normalizarBuscaComprados(texto) {
    return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
}

function filtrarComprados() {
    renderComprados();
}

function renderComprados() {
    const container = document.getElementById('lista-comprados-container');
    const contador = document.getElementById('comprados-contador');
    if (!container || !contador) return;
    const comprados = obterListaCompras().filter(item => item.comprado);
    const busca = normalizarBuscaComprados(document.getElementById('busca-comprados')?.value);
    const encontrados = busca ? comprados.filter(item => normalizarBuscaComprados(item.nome).includes(busca)) : comprados;
    contador.textContent = busca
        ? `${encontrados.length} ${encontrados.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`
        : `${comprados.length} ${comprados.length === 1 ? 'item comprado' : 'itens comprados'}`;
    container.innerHTML = '';

    if (!comprados.length) {
        container.innerHTML = '<div class="comprados-vazio"><img src="imagens/comprados.png" alt=""><p>Nenhum produto comprado por enquanto.</p><span>Finalize as compras na Lista de Compras para encontrá-las aqui.</span></div>';
        atualizarAlertasComprados();
        return;
    }
    if (!encontrados.length) {
        container.innerHTML = '<div class="comprados-vazio"><p>Nenhum produto encontrado.</p><span>Tente buscar por outro nome.</span></div>';
        atualizarAlertasComprados();
        return;
    }

    encontrados.forEach(item => {
        const nome = escaparHtml(item.nome);
        const categoria = escaparHtml(item.categoria || 'Alimentos');
        const nomeSlug = String(item.nome || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const alerta = calcularAlertaComprado(item);
        const quantidadeExibicao = item.quantidade ? escaparHtml(item.quantidade) + (item.unidade ? ` × ${escaparHtml(item.unidade)}` : '') : 'Não informada';
        const validadeExibicao = item.validade ? (formatarDataISO(item.validade) || 'Não informada') : 'Não informada';
        const id = Number(item.id);

        container.innerHTML += `
            <div class="comprado-item-row ${alerta ? 'comprado-com-alerta' : ''}">
                ${alerta ? `<div class="alerta-comprado-etiqueta" role="status"><span class="alerta-simbolo">!</span>${escaparHtml(alerta)}</div>` : ''}
                <div class="comprado-item-topo">
                    <div class="comprado-item-produto">
                        <div class="despensa-circle-img">
                            <img src="imagens/${nomeSlug}.png" alt="${nome}" onerror="this.onerror=null;this.src='imagens/cesta.png'">
                        </div>
                        <div class="comprado-item-textos">
                            <h4>${nome}</h4>
                            <span>${categoria}</span>
                        </div>
                    </div>
                </div>
                <div class="comprado-item-resumo">
                    <div class="comprado-resumo-dado">
                        <span>Quantidade</span>
                        <strong>${quantidadeExibicao}</strong>
                    </div>
                    <div class="comprado-resumo-dado">
                        <span>Validade</span>
                        <strong>${validadeExibicao}</strong>
                    </div>
                </div>
                <div class="comprado-item-acoes">
                    <button type="button" class="botao-editar-comprado" onclick="abrirModalComprado(${id}, 'editar')">Editar informações</button>
                    <button type="button" class="botao-acabou-comprado" onclick="marcarCompradoAcabou(${id})">Marcar que acabou</button>
                </div>
            </div>
        `;
    });
    atualizarAlertasComprados();
}

function iniciarFinalizacaoCompras(ids) {
    filaFinalizacaoCompras = [...ids];
    abrirProximoItemComprado();
}

function abrirProximoItemComprado() {
    while (filaFinalizacaoCompras.length) {
        const id = filaFinalizacaoCompras[0];
        const item = obterListaCompras().find(i => String(i.id) === String(id) && !i.comprado && i.selecionado);
        if (item) {
            abrirModalComprado(id, 'lista');
            return;
        }
        filaFinalizacaoCompras.shift();
    }
    mudarTela('comprados');
}

function abrirModalComprado(id, origem) {
    const item = origem === 'despensa'
        ? obterProdutos().find(p => String(p.id) === String(id))
        : obterListaCompras().find(i => String(i.id) === String(id));
    if (!item) return;
    modalCompradoAtual = { id, origem };
    document.getElementById('modal-comprado-titulo').textContent = origem === 'editar' ? 'Editar informações' : 'Produto comprado';
    document.getElementById('modal-comprado-nome').textContent = item.nome;

    const emEdicao = origem === 'editar';
    const campoData = document.getElementById('comprado-data-compra');
    campoData.value = emEdicao ? (item.dataCompra || '') : '';
    document.getElementById('comprado-validade').value = emEdicao ? (item.validade || '') : '';
    document.getElementById('comprado-unidade').innerHTML = '<option value="">Selecione</option>' + criarOpcoes(opcoesUnidadeComprados, emEdicao ? item.unidade : '');
    document.getElementById('comprado-quantidade').innerHTML = '<option value="">Selecione</option>' + criarOpcoes(Array.from({ length: 20 }, (_, indice) => String(indice + 1)), emEdicao ? item.quantidade : '');
    document.getElementById('comprado-duracao').innerHTML = '<option value="">Selecione</option>' + criarOpcoes(opcoesDuracaoComprados, emEdicao ? item.duracao : '');

    const modal = document.getElementById('modal-comprado');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    campoData.focus();
}

function fecharModalComprado(cancelarFila = true) {
    const modal = document.getElementById('modal-comprado');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modalCompradoAtual = null;
    if (cancelarFila) filaFinalizacaoCompras = [];
    renderListaCompras();
    atualizarAlertasComprados();
}

function clicarForaModalComprado(evento) {
    if (evento.target === document.getElementById('modal-comprado')) fecharModalComprado();
}

function salvarFormularioComprado(evento) {
    evento.preventDefault();
    if (!modalCompradoAtual) return;
    const { id, origem } = modalCompradoAtual;
    const dados = {
        dataCompra: document.getElementById('comprado-data-compra').value,
        validade: document.getElementById('comprado-validade').value,
        unidade: document.getElementById('comprado-unidade').value,
        quantidade: document.getElementById('comprado-quantidade').value,
        duracao: document.getElementById('comprado-duracao').value
    };
    if (dataISOEmDias(dados.dataCompra) === null || !dados.unidade || !dados.quantidade || !dados.duracao) {
        document.getElementById('form-comprado').reportValidity();
        return;
    }

    if (origem === 'despensa') {
        const produto = obterProdutos().find(p => String(p.id) === String(id));
        if (!produto) return;
        salvarItemLista({ id: proximoIdComprado(), nome: produto.nome, categoria: produto.categoria || 'Alimentos', selecionado: false, comprado: true, ...dados });
        removerProduto(id);
    } else {
        const lista = obterListaCompras();
        const item = lista.find(i => String(i.id) === String(id));
        if (!item) return;
        Object.assign(item, dados, { comprado: true, selecionado: false });
        salvarListaComprasCompleta(lista);
    }

    const temFila = origem === 'lista' && filaFinalizacaoCompras.length > 0;
    if (temFila) filaFinalizacaoCompras.shift();
    fecharModalComprado(false);
    renderComprados();
    if (origem === 'despensa') {
        renderDespensa();
        mudarTela('comprados');
    } else if (temFila) {
        abrirProximoItemComprado();
    }
}

function proximoIdComprado() {
    const ids = obterListaCompras().map(item => Number(item.id)).filter(Number.isFinite);
    return Math.max(Date.now(), 1, ...ids.map(id => id + 1));
}

function marcarCompradoAcabou(id) {
    const lista = obterListaCompras();
    const item = lista.find(produto => String(produto.id) === String(id) && produto.comprado);
    if (!item) return;
    item.comprado = false;
    item.selecionado = false;
    delete item.dataCompra;
    delete item.validade;
    delete item.unidade;
    delete item.quantidade;
    delete item.duracao;
    salvarListaComprasCompleta(lista);
    renderComprados();
    renderListaCompras();
    atualizarAlertasComprados();
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarAlertasComprados();
});

window.addEventListener('focus', () => {
    atualizarAlertasComprados();
    if (document.getElementById('tela-comprados').classList.contains('ativo')) renderComprados();
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        atualizarAlertasComprados();
        if (document.getElementById('tela-comprados').classList.contains('ativo')) renderComprados();
    }
});

setInterval(() => {
    atualizarAlertasComprados();
    if (document.getElementById('tela-comprados').classList.contains('ativo')) renderComprados();
}, 600000);
