let produtos = JSON.parse(localStorage.getItem('minhas_compras_produtos')) || [
    { id: 1, nome: 'Arroz', unidade: '1kg', categoria: 'Alimentos', status: 'falta', duracao: '1 semana', atualizacao: '10/10/2026' },
    { id: 2, nome: 'Feijão', unidade: '1kg', categoria: 'Alimentos', status: 'falta', duracao: '2 semanas', atualizacao: '01/10/2026' },
     { id: 3, nome: 'Peito de frango', unidade: '2kg', categoria: 'Alimentos', status: 'estoque', duracao: '3 semanas', atualizacao: '11/10/2026' },
    { id: 4, nome: 'Farinha de Trigo', unidade: '1kg', categoria: 'Alimentos', status: 'finalizando', duracao: '1 mês', atualizacao: '20/09/2026' },
    { id: 5, nome: 'Ovos', unidade: '1 caixa c/10', categoria: 'Alimentos', status: 'estoque', duracao: '3 semanas', atualizacao: '12/10/2026' }
];

let listaCompras = JSON.parse(localStorage.getItem('minhas_compras_lista')) || [
    { id: 1, nome: 'Arroz', categoria: 'Alimentos', comprado: false },
    { id: 2, nome: 'Feijão', categoria: 'Alimentos', comprado: false },
    { id: 3, nome: 'Farinha de aveia', categoria: 'Alimentos', comprado: false },
    { id: 4, nome: 'Batata', categoria: 'Alimentos', comprado: true },
    { id: 5, nome: 'Laranja', categoria: 'Alimentos', comprado: true },
    { id: 6, nome: 'Leite', categoria: 'Alimentos', comprado: false },
    { id: 7, nome: 'Desodorante', categoria: 'Higiene', comprado: true },
    { id: 8, nome: 'Sabonete', categoria: 'Higiene', comprado: true },
    { id: 9, nome: 'Pasta de dente', categoria: 'Higiene', comprado: false },
    { id: 10, nome: 'Shampoo', categoria: 'Higiene', comprado: true },
    { id: 11, nome: 'Condicionador', categoria: 'Higiene', comprado: false },
    { id: 12, nome: 'Detergente', categoria: 'Limpeza', comprado: true },
    { id: 13, nome: 'Amaciante', categoria: 'Limpeza', comprado: true },
    { id: 14, nome: 'Sabão em pó', categoria: 'Limpeza', comprado: true },
    { id: 15, nome: 'Desinfetante', categoria: 'Limpeza', comprado: false }
];

let filtroAtualStatus = 'todos';
let produtoSelecionadoId = null;
let modalCompradoAtual = null;

function atualizarRelogio() {
    let elementoRelogio = document.getElementById('relogio-ao-vivo');
    if (elementoRelogio) {
        let agora = new Date();
        let horas = String(agora.getHours()).padStart(2, '0');
        let minutos = String(agora.getMinutes()).padStart(2, '0');
        elementoRelogio.innerText = horas + ':' + minutos;
    }
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

function mudarTela(idAba) {
    document.querySelectorAll('.app-tela').forEach(el => el.classList.remove('ativo'));
    document.querySelectorAll('.botao-navegacao-aba').forEach(el => el.classList.remove('ativo'));
    document.getElementById('tela-' + idAba).classList.add('ativo');

    let enderecos = {
        'inicio': 'minhascompras.com.br',
        'despensa': 'minhascompras.com.br/Despensa',
        'lista': 'minhascompras.com.br/ListaDeMercado',
        'comprados': 'minhascompras.com.br/Comprados'
    };
    document.getElementById('url-navegador').innerText = enderecos[idAba] || 'minhascompras.com.br';

    let barraInferior = document.getElementById('barra-inferior');
    if (idAba === 'comprados') {
        barraInferior.className = 'barra-abas-inferior fundo-barra-branco';
    } else {
        barraInferior.className = 'barra-abas-inferior fundo-barra-verde';
    }
    document.querySelectorAll('.botao-navegacao-aba').forEach(botao => {
        if (botao.getAttribute('onclick').includes(idAba)) {
            botao.classList.add('ativo');
        }
    });

    if (idAba === 'despensa') renderDespensa();
    if (idAba === 'lista') renderListaCompras();
    if (idAba === 'comprados') renderComprados();
    atualizarAlertasComprados();
}

function salvarDados() {
    localStorage.setItem('minhas_compras_produtos', JSON.stringify(produtos));
    localStorage.setItem('minhas_compras_lista', JSON.stringify(listaCompras));
}

function calcularStatusDinamico(produto) {
    if (!produto.atualizacao) return { status: 'estoque', texto: produto.duracao || '2 semanas' };
    let partes = produto.atualizacao.split('/');
    if (partes.length < 2) return { status: 'estoque', texto: produto.duracao || '2 semanas' };

    let dia = parseInt(partes[0], 10);
    let mes = parseInt(partes[1], 10) - 1;
    let ano = partes[2] ? parseInt(partes[2], 10) : new Date().getFullYear();

    let dataAtualizacao = new Date(ano, mes, dia);
    let hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

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
    else if (duracaoStr.includes('4 meses')) duracaoDias = 120;
    else if (duracaoStr.includes('5 meses')) duracaoDias = 150;
    else if (duracaoStr.includes('6 meses')) duracaoDias = 180;
    else if (duracaoStr.includes('7 meses')) duracaoDias = 210;
    else if (duracaoStr.includes('8 meses')) duracaoDias = 240;
    else if (duracaoStr.includes('9 meses')) duracaoDias = 270;
    else if (duracaoStr.includes('10 meses')) duracaoDias = 300;
    else if (duracaoStr.includes('11 meses')) duracaoDias = 330;
    else if (duracaoStr.includes('1 ano')) duracaoDias = 365;

    let diasRestantes = duracaoDias - diffEmDias;

    if (produto.validade && /^\d{4}-\d{2}-\d{2}$/.test(produto.validade)) {
        let [anoValidade, mesValidade, diaValidade] = produto.validade.split('-').map(Number);
        let dataValidade = new Date(anoValidade, mesValidade - 1, diaValidade);
        let diasAteValidade = Math.round((dataValidade - hoje) / (1000 * 60 * 60 * 24));
        diasRestantes = Math.min(diasRestantes, diasAteValidade);
    }

    let status = 'estoque';
    if (diasRestantes < 6) {
        status = 'falta';
    } else if (diasRestantes <= 14) {
        status = 'finalizando';
    } else {
        status = 'estoque';
    }

    let textoDinamico = diasRestantes <= 0 ? 'Expirado' : diasRestantes + ' dias restantes';
    return { status: status, texto: textoDinamico };
}

function renderDespensa(filtroTexto = '') {
    let container = document.getElementById('lista-despensa-container');
    container.innerHTML = '';

    produtos.forEach(produto => {
        let calculo = calcularStatusDinamico(produto);
        produto.status = calculo.status;
        produto.duracaoCalculada = calculo.texto;
    });

    createLists([produtos],['nome'],[filtroTexto])

    console.log(filtroAtualStatus)
    if (filtroTexto != '') {
    window.filtrados = results.filter(produto => {
        let combinaTexto = true
        let combinaStatus = filtroAtualStatus === 'todos' || produto.status === filtroAtualStatus;
        return combinaTexto && combinaStatus;
    });
    }else{
    
    window.filtrados = produtos.filter(produto => {
        let combinaTexto = produto.nome.toLowerCase().includes(filtroTexto.toLowerCase())
        let combinaStatus = filtroAtualStatus === 'todos' || produto.status === filtroAtualStatus;
        return combinaTexto && combinaStatus;
    });

    console.log('1aaaaaaaaaa',filtrados)
    }

    if (filtroAtualStatus === 'todos') {
        let pesoStatus = { 'falta': 1, 'finalizando': 2, 'estoque': 3 };
        filtrados.sort((a, b) => pesoStatus[a.status] - pesoStatus[b.status]);
    }

    if (filtrados.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#555; font-size:0.85rem; padding:15px;">Nenhum produto encontrado.</p>';
        return;
    }

    filtrados.forEach(produto => {
        console.log('produto: ',produto, produto.innertext == undefined)
        let nome
        if (produto.innertext == undefined || filtroTexto == '') {
            nome = produto.nome
        }else{
            nome = produto.innertext
        }
        let bolinha = produto.status === 'estoque' ? '🟢' : produto.status === 'finalizando' ? '🟡' : '🔴';
        let nomeSlug = produto.nome.toLowerCase().replace(/\s+/g, '-');
        let dataExibicao = produto.atualizacao ? produto.atualizacao.substring(0, 5) : '10/08';
        let validadeExibicao = produto.validade ? '<br>Validade: ' + formatarDataISO(produto.validade) : '';

        container.innerHTML += `
            <div class="despensa-row-item">
                <div class="despensa-item-left">
                    <div class="despensa-circle-img">
                        <img src="imagens/${nomeSlug}.png" alt="${produto.nome}">
                    </div>
                    <div class="despensa-item-details">
                        <h4>${nome}</h4>
                        <p>${produto.unidade}<br>Última atualização: ${dataExibicao}${validadeExibicao}<br>${bolinha} ${produto.duracaoCalculada}</p>
                    </div>
                </div>
                <span class="seta-indicador" style="cursor:pointer; padding:5px 10px;" onclick="abrirModalAcao(${produto.id})">➤</span>
            </div>
        `;
    });
}

function filtrarDespensa() {
    renderDespensa(document.getElementById('busca-despensa').value);
}

function filtrarStatus(status, elemento) {
    filtroAtualStatus = status;
    document.querySelectorAll('.botao-chip').forEach(c => c.classList.remove('ativo'));
    elemento.classList.add('ativo');
    renderDespensa(document.getElementById('busca-despensa').value);
}

function abrirModalAcao(id) {
    produtoSelecionadoId = id;
    let produto = produtos.find(p => p.id === id);
    if (produto) {
        document.getElementById('modal-produto-nome').innerText = produto.nome;
        document.getElementById('modal-acao-despensa').style.display = 'flex';
    }
}

function fecharModalAcao() {
    document.getElementById('modal-acao-despensa').style.display = 'none';
    produtoSelecionadoId = null;
}

function enviarDaDespensaParaLista() {
    if (!produtoSelecionadoId) return;
    let indice = produtos.findIndex(p => p.id === produtoSelecionadoId);
    if (indice !== -1) {
        let produto = produtos[indice];
        listaCompras.push({
            id: Date.now(),
            nome: produto.nome,
            categoria: produto.categoria || 'Alimentos',
            comprado: false
        });
        produtos.splice(indice, 1);
        salvarDados();
        fecharModalAcao();
        renderDespensa();
    }
}

function enviarDaDespensaParaComprados() {
    if (produtoSelecionadoId === null) return;
    let produto = produtos.find(p => p.id === produtoSelecionadoId);
    if (!produto) return;
    let id = produto.id;
    fecharModalAcao();
    abrirModalComprado(id, 'despensa');
}

function alternarCategoria(slugCategoria) {
    let invuculo = document.getElementById('wrapper-cat-' + slugCategoria);
    let seta = document.getElementById('arrow-cat-' + slugCategoria);
    if (invuculo) {
        if (invuculo.classList.contains('recolhido')) {
            invuculo.classList.remove('recolhido');
            if (seta) seta.innerText = '^';
        } else {
            invuculo.classList.add('recolhido');
            if (seta) seta.innerText = 'v';
        }
    }
}

function renderListaCompras() {
    let container = document.getElementById('lista-compras-container');
    container.innerHTML = '';
    let categorias = [
        { nome: 'Alimentos', slug: 'alimentos' },
        { nome: 'Higiene', slug: 'higiene' },
        { nome: 'Limpeza', slug: 'limpeza' }
    ];

    categorias.forEach(cat => {
        let itensCat = listaCompras.filter(i => i.categoria === cat.nome && !i.comprado);
        let htmlItens = itensCat.map(i => `
            <div class="checklist-row-item">
                <label>
                    <input type="checkbox" onclick="alternarComprado(${i.id})">
                    <span>${i.nome}</span>
                </label>
            </div>
        `).join('');

        container.innerHTML += `
            <div class="bloco-categoria-nota">
                <h4 class="cabecalho-categoria-nota" onclick="alternarCategoria('${cat.slug}')">
                    <span class="conteudo-titulo-categoria">
                        <img src="imagens/${cat.slug}.png" alt="${cat.nome}" class="imagem-icone-categoria">
                        ${cat.nome}
                    </span>
                    <span id="arrow-cat-${cat.slug}">^</span>
                </h4>
                <div id="wrapper-cat-${cat.slug}" class="envoltorio-itens-categoria"> ${htmlItens || '<p style="font-size:0.75rem; color:#777; padding:4px 0;">Nenhum item pendente.</p>'} </div>
            </div>
        `;
    });
}

function adicionarNaLista() {
    let entrada = document.getElementById('novo-item-lista');
    let nome = entrada.value.trim();
    if (!nome) return;
    listaCompras.push({ id: Date.now(), nome, categoria: 'Alimentos', comprado: false });
    entrada.value = '';
    salvarDados();
    renderListaCompras();
}

function alternarComprado(id) {
    if (listaCompras.some(item => item.id === id && !item.comprado)) {
        abrirModalComprado(id, 'lista');
    }
}

function dataHojeISO() {
    let hoje = new Date();
    let ano = hoje.getFullYear();
    let mes = String(hoje.getMonth() + 1).padStart(2, '0');
    let dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function formatarDataISO(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '')) return '';
    let [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function escaparHtml(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
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

const opcoesUnidadeComprados = ['1kg', '500g', '250g', '2kg', '5kg', '1 unidade', '1 pacote', '1 caixa', '1L', '500ml', '200ml', '100g', '100ml'];
const opcoesDuracaoComprados = ['1 dia', '2 dias', '3 dias', '4 dias', '5 dias', '6 dias', '1 semana', '2 semanas', '3 semanas', '1 mês', '2 meses', '3 meses', '4 meses', '5 meses', '6 meses', '7 meses', '8 meses', '9 meses', '10 meses', '11 meses', '1 ano'];

function dataISOEmDias(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '')) return null;
    let [ano, mes, dia] = data.split('-').map(Number);
    let valor = Date.UTC(ano, mes - 1, dia) / 86400000;
    let verificacao = new Date(valor * 86400000);
    if (verificacao.getUTCFullYear() !== ano || verificacao.getUTCMonth() + 1 !== mes || verificacao.getUTCDate() !== dia) return null;
    return valor;
}

function duracaoCompradoEmDias(duracao) {
    let resultado = /^(\d+)\s+(dia|dias|semana|semanas|mês|meses|ano|anos)$/.exec(duracao || '');
    if (!resultado) return null;
    let numero = Number(resultado[1]);
    let unidade = resultado[2];
    if (unidade.startsWith('dia')) return numero;
    if (unidade.startsWith('semana')) return numero * 7;
    if (unidade === 'mês' || unidade === 'meses') return numero * 30;
    return numero * 365;
}

function calcularAlertaComprado(item) {
    let hoje = dataISOEmDias(dataHojeISO());
    let prazoValidade = dataISOEmDias(item.validade);
    let dataCompra = dataISOEmDias(item.dataCompra);
    let duracao = duracaoCompradoEmDias(item.duracao);
    let avisos = [];

    if (prazoValidade !== null) avisos.push({ tipo: 'validade', dias: prazoValidade - hoje });
    if (dataCompra !== null && duracao !== null) avisos.push({ tipo: 'duracao', dias: dataCompra + duracao - hoje });
    if (!avisos.length) return null;
    avisos.sort((a, b) => a.dias - b.dias);
    let maisProximo = avisos[0];
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
    let alertas = listaCompras.filter(item => item.comprado && calcularAlertaComprado(item)).length;
    ['alerta-comprados-inicio', 'alerta-comprados-aba'].forEach(id => {
        let indicador = document.getElementById(id);
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
    let container = document.getElementById('lista-comprados-container');
    let contador = document.getElementById('comprados-contador');
    let comprados = listaCompras.filter(item => item.comprado);
    let busca = normalizarBuscaComprados(document.getElementById('busca-comprados').value);
    let encontrados = busca ? comprados.filter(item => normalizarBuscaComprados(item.nome).includes(busca)) : comprados;
    contador.textContent = busca
        ? `${encontrados.length} ${encontrados.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`
        : `${comprados.length} ${comprados.length === 1 ? 'item comprado' : 'itens comprados'}`;
    container.innerHTML = '';

    if (comprados.length === 0) {
        container.innerHTML = '<div class="comprados-vazio"><img src="imagens/comprados.png" alt=""><p>Nenhum produto comprado por enquanto.</p><span>Marque os itens na Lista de Compras para encontrá-los aqui.</span></div>';
        atualizarAlertasComprados();
        return;
    }

    if (encontrados.length === 0) {
        container.innerHTML = '<div class="comprados-vazio"><p>Nenhum produto encontrado.</p><span>Tente buscar por outro nome.</span></div>';
        atualizarAlertasComprados();
        return;
    }

    encontrados.forEach(item => {
        let nome = escaparHtml(item.nome);
        let categoria = escaparHtml(item.categoria || 'Alimentos');
        let nomeSlug = item.nome.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        let alerta = calcularAlertaComprado(item);
        let quantidadeExibicao = item.quantidade ? escaparHtml(item.quantidade) + (item.unidade ? ` × ${escaparHtml(item.unidade)}` : '') : 'Não informada';
        let validadeExibicao = item.validade ? formatarDataISO(item.validade) : 'Não informada';

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
                    <button type="button" class="botao-editar-comprado" onclick="abrirModalComprado(${item.id}, 'editar')">Editar informações</button>
                    <button type="button" class="botao-acabou-comprado" onclick="marcarCompradoAcabou(${item.id})">Marcar que acabou</button>
                </div>
            </div>
        `;
    });
    atualizarAlertasComprados();
}

function abrirModalComprado(id, origem) {
    let item = origem === 'despensa' ? produtos.find(p => p.id === id) : listaCompras.find(i => i.id === id);
    if (!item) return;
    modalCompradoAtual = { id, origem };
    document.getElementById('modal-comprado-titulo').textContent = origem === 'editar' ? 'Editar informações' : 'Produto comprado';
    document.getElementById('modal-comprado-nome').textContent = item.nome;

    let campoData = document.getElementById('comprado-data-compra');
    campoData.value = item.dataCompra || (origem === 'lista' ? document.getElementById('input-data-compra').value : '') || dataHojeISO();
    document.getElementById('comprado-validade').value = item.validade || '';
    let unidade = document.getElementById('comprado-unidade');
    let quantidade = document.getElementById('comprado-quantidade');
    let duracao = document.getElementById('comprado-duracao');
    unidade.innerHTML = '<option value="">Selecione</option>' + criarOpcoes(opcoesUnidadeComprados, item.unidade);
    quantidade.innerHTML = '<option value="">Selecione</option>' + criarOpcoes(Array.from({length: 20}, (_, indice) => String(indice + 1)), item.quantidade);
    duracao.innerHTML = '<option value="">Selecione</option>' + criarOpcoes(opcoesDuracaoComprados, item.duracao);

    let modal = document.getElementById('modal-comprado');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    campoData.focus();
}

function fecharModalComprado() {
    let modal = document.getElementById('modal-comprado');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modalCompradoAtual = null;
    renderListaCompras();
}

function clicarForaModalComprado(evento) {
    if (evento.target === document.getElementById('modal-comprado')) fecharModalComprado();
}

function salvarFormularioComprado(evento) {
    evento.preventDefault();
    if (!modalCompradoAtual) return;
    let { id, origem } = modalCompradoAtual;
    let dados = {
        dataCompra: document.getElementById('comprado-data-compra').value,
        validade: document.getElementById('comprado-validade').value,
        unidade: document.getElementById('comprado-unidade').value,
        quantidade: document.getElementById('comprado-quantidade').value,
        duracao: document.getElementById('comprado-duracao').value
    };
    if (!dados.dataCompra || !dados.unidade || !dados.quantidade || !dados.duracao) return;

    if (origem === 'despensa') {
        let indice = produtos.findIndex(p => p.id === id);
        if (indice === -1) return;
        let produto = produtos.splice(indice, 1)[0];
        listaCompras.push({ id: proximoIdComprado(), nome: produto.nome, categoria: produto.categoria || 'Alimentos', comprado: true, ...dados });
    } else {
        let item = listaCompras.find(i => i.id === id);
        if (!item) return;
        Object.assign(item, dados, { comprado: true });
    }

    salvarDados();
    fecharModalComprado();
    renderComprados();
    if (origem === 'despensa') renderDespensa();
}

function proximoIdComprado() {
    let ids = listaCompras.map(item => Number(item.id)).filter(Number.isFinite);
    return Math.max(Date.now(), 1, ...ids.map(id => id + 1));
}

function marcarCompradoAcabou(id) {
    let item = listaCompras.find(produto => produto.id === id && produto.comprado);
    if (!item) return;
    item.comprado = false;
    delete item.dataCompra;
    delete item.validade;
    delete item.unidade;
    delete item.quantidade;
    delete item.duracao;
    salvarDados();
    renderComprados();
    renderListaCompras();
}

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

atualizarAlertasComprados();

let inputDataCompra = document.getElementById('input-data-compra');
if (inputDataCompra) {
    inputDataCompra.value = localStorage.getItem('minhas_compras_data_compra') || dataHojeISO();
    inputDataCompra.addEventListener('change', () => {
        localStorage.setItem('minhas_compras_data_compra', inputDataCompra.value);
    });
}
