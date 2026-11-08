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
    startEngine()

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
        let bolinha = produto.status === 'estoque' ? '🟢' : produto.status === 'finalizando' ? '🟡' : '🔴';
        let nomeSlug = produto.nome.toLowerCase().replace(/\s+/g, '-');
        let dataExibicao = produto.atualizacao ? produto.atualizacao.substring(0, 5) : '10/08';

        container.innerHTML += `
            <div class="despensa-row-item">
                <div class="despensa-item-left">
                    <div class="despensa-circle-img">
                        <img src="imagens/${nomeSlug}.png" alt="${produto.nome}">
                    </div>
                    <div class="despensa-item-details">
                        <h4>${produto.nome}</h4>
                        <p>${produto.unidade}<br>Última atualização: ${dataExibicao}<br>${bolinha} ${produto.duracaoCalculada}</p>
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
    if (!produtoSelecionadoId) return;
    let indice = produtos.findIndex(p => p.id === produtoSelecionadoId);
    if (indice !== -1) {
        let produto = produtos[indice];
        listaCompras.push({
            id: Date.now(),
            nome: produto.nome,
            categoria: produto.categoria || 'Alimentos',
            comprado: true
        });
        produtos.splice(indice, 1);
        salvarDados();
        fecharModalAcao();
        renderDespensa();
    }
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
    let item = listaCompras.find(i => i.id === id);
    if (item) {
        item.comprado = true;
        salvarDados();
        renderListaCompras();
    }
}

function renderComprados() {
    let container = document.getElementById('lista-comprados-container');
    container.innerHTML = '';
    let comprados = listaCompras.filter(i => i.comprado);
    if (comprados.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#555; font-size:0.85rem; padding:15px;">Nenhum item recente marcado como comprado.</p>';
        return;
    }

    comprados.forEach(i => {
        let nomeSlug = i.nome.toLowerCase().replace(/\s+/g, '-');
        let opcoesQuantidade = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        let opcoesDuracao = ['1 dia', '2 dias', '3 dias', '4 dias', '5 dias', '6 dias', '1 semana', '2 semanas', '3 semanas', '1 mês', '2 meses', '3 meses', '4 meses', '5 meses', '6 meses', '7 meses', '8 meses', '9 meses', '10 meses', '11 meses', '1 ano'];
        let htmlOpcoesQtd = opcoesQuantidade.map(q => '<div class="caixa-suspensa-opcao" onclick="selecionarOpcao(' + i.id + ', \'qtd\', \'' + q + '\')">' + q + '</div>').join('');
        let htmlOpcoesDur = opcoesDuracao.map(d => '<div class="caixa-suspensa-opcao" onclick="selecionarOpcao(' + i.id + ', \'dur\', \'' + d + '\')">' + d + '</div>').join('');

        container.innerHTML += `
            <div class="comprado-item-row">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div class="despensa-circle-img">
                            <img src="imagens/${nomeSlug}.png" alt="${i.nome}">
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
                    <label>Prazo de validade: <input type="date" id="val-${i.id}"></label>
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
    let lista = document.getElementById(tipo + '-lista-' + id);
    if (lista) lista.classList.toggle('aberta');
}

function selecionarOpcao(id, tipo, valor) {
    document.getElementById(tipo + '-texto-' + id).innerText = valor;
    let inputOculto = document.getElementById(tipo + '-val-' + id);
    inputOculto.value = valor;
    document.getElementById(tipo + '-lista-' + id).classList.remove('aberta');
    verificarCamposObrigatorios(id);
}

function verificarCamposObrigatorios(id) {
    let unidade = document.getElementById('unidade-' + id).value;
    let quantidade = document.getElementById('qtd-val-' + id).value;
    let duracao = document.getElementById('dur-val-' + id).value;
    let botao = document.getElementById('botao-adicionar-' + id);
    if (!unidade || !quantidade || !duracao || !botao) return;
    if (unidade && quantidade && duracao) {
        botao.classList.add('pronto');
    } else {
        botao.classList.remove('pronto');
    }
}

window.addEventListener('click', function(evento) {
    if (!evento.target.closest('.caixa-suspensa')) {
        document.querySelectorAll('.caixa-suspensa-lista').forEach(l => l.classList.remove('aberta'));
    }
});

function reverterParaLista(id) {
    let item = listaCompras.find(i => i.id === id);
    if (item) {
        item.comprado = false;
        salvarDados();
        renderComprados();
    }
}

function enviarParaDespensa(id) {
    let item = listaCompras.find(i => i.id === id);
    let unidadeSelect = document.getElementById('unidade-' + id);
    let valorQuantidade = document.getElementById('qtd-val-' + id);
    let valorDuracao = document.getElementById('dur-val-' + id);
    let unidade = unidadeSelect ? unidadeSelect.value : '';
    let quantidade = valorQuantidade ? valorQuantidade.value : '';
    let duracao = valorDuracao ? valorDuracao.value : '';
    if (!unidade || !quantidade || !duracao) {
        return;
    }

    let hoje = new Date();
    let dia = String(hoje.getDate()).padStart(2, '0');
    let mes = String(hoje.getMonth() + 1).padStart(2, '0');
    let ano = hoje.getFullYear();
    let dataAtual = dia + '/' + mes + '/' + ano;

    if (item) {
        produtos.push({
            id: Date.now(),
            nome: item.nome,
            unidade: quantidade + 'x ' + unidade,
            categoria: item.categoria || 'Alimentos',
            status: 'estoque',
            duracao: duracao,
            atualizacao: dataAtual
        });
        listaCompras = listaCompras.filter(i => i.id !== id);
        salvarDados();
        renderComprados();
    }
}
