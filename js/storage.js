

const CHAVE_PRODUTOS = 'minhas_compras_produtos';
const CHAVE_LISTA = 'minhas_compras_lista';

// Dados iniciais padrão caso o LocalStorage esteja vazio
const PRODUTOS_INICIAIS = [
    { id: 1, nome: 'Arroz', unidade: '1x 1kg', categoria: 'Alimentos', status: 'falta', duracao: '1 semana', atualizacao: '10/10/2026', validade: '' },
    { id: 2, nome: 'Feijão', unidade: '1x 1kg', categoria: 'Alimentos', status: 'falta', duracao: '2 semanas', atualizacao: '01/10/2026', validade: '' },
    { id: 3, nome: 'Peito de frango', unidade: '1x 2kg', categoria: 'Alimentos', status: 'estoque', duracao: '3 semanas', atualizacao: '11/10/2026', validade: '' },
    { id: 4, nome: 'Farinha de Trigo', unidade: '1x 1kg', categoria: 'Alimentos', status: 'finalizando', duracao: '1 mês', atualizacao: '20/09/2026', validade: '' },
    { id: 5, nome: 'Ovos', unidade: '1x 1 caixa c/10', categoria: 'Alimentos', status: 'estoque', duracao: '3 semanas', atualizacao: '12/10/2026', validade: '' }
];

const LISTA_INICIAL = [
    { id: 1, nome: 'Arroz', categoria: 'Alimentos', selecionado: false, comprado: false, dataCompra: '' },
    { id: 2, nome: 'Feijão', categoria: 'Alimentos', selecionado: false, comprado: false, dataCompra: '' },
    { id: 3, nome: 'Farinha de aveia', categoria: 'Alimentos', selecionado: false, comprado: false, dataCompra: '' },
    { id: 4, nome: 'Batata', categoria: 'Alimentos', selecionado: false, comprado: false, dataCompra: '' },
    { id: 5, nome: 'Laranja', categoria: 'Alimentos', selecionado: false, comprado: false, dataCompra: '' },
    { id: 6, nome: 'Leite', categoria: 'Alimentos', selecionado: false, comprado: false, dataCompra: '' },
    { id: 7, nome: 'Desodorante', categoria: 'Higiene', selecionado: false, comprado: false, dataCompra: '' },
    { id: 8, nome: 'Sabonete', categoria: 'Higiene', selecionado: false, comprado: false, dataCompra: '' },
    { id: 9, nome: 'Pasta de dente', categoria: 'Higiene', selecionado: false, comprado: false, dataCompra: '' },
    { id: 10, nome: 'Shampoo', categoria: 'Higiene', selecionado: false, comprado: false, dataCompra: '' },
    { id: 11, nome: 'Condicionador', categoria: 'Higiene', selecionado: false, comprado: false, dataCompra: '' },
    { id: 12, nome: 'Detergente', categoria: 'Limpeza', selecionado: false, comprado: false, dataCompra: '' },
    { id: 13, nome: 'Amaciante', categoria: 'Limpeza', selecionado: false, comprado: false, dataCompra: '' },
    { id: 14, nome: 'Sabão em pó', categoria: 'Limpeza', selecionado: false, comprado: false, dataCompra: '' },
    { id: 15, nome: 'Desinfetante', categoria: 'Limpeza', selecionado: false, comprado: false, dataCompra: '' }
];


function obterProdutos() {
    const dados = localStorage.getItem(CHAVE_PRODUTOS);
    if (!dados) {
        localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(PRODUTOS_INICIAIS));
        return [...PRODUTOS_INICIAIS];
    }
    try {
        return JSON.parse(dados);
    } catch (e) {
        console.error('Erro ao obter produtos do LocalStorage:', e);
        return [];
    }
}

/**
 * Adiciona um novo produto ao LocalStorage.
 * @param {Object} produto - Objeto com dados do produto.
 */
function salvarProduto(produto) {
    const produtos = obterProdutos();
    if (!produto.id) {
        produto.id = Date.now();
    }
    produtos.push(produto);
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
    return produto;
}

function atualizarProduto(id, novosDados) {
    const produtos = obterProdutos();
    const index = produtos.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
        produtos[index] = { ...produtos[index], ...novosDados };
        localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
        return produtos[index];
    }
    return null;
}


function removerProduto(id) {
    let produtos = obterProdutos();
    produtos = produtos.filter(p => String(p.id) !== String(id));
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
    return produtos;
}


function obterListaCompras() {
    const dados = localStorage.getItem(CHAVE_LISTA);
    if (!dados) {
        localStorage.setItem(CHAVE_LISTA, JSON.stringify(LISTA_INICIAL));
        return [...LISTA_INICIAL];
    }
    try {
        return JSON.parse(dados);
    } catch (e) {
        console.error('Erro ao obter lista do LocalStorage:', e);
        return [];
    }
}


function salvarListaComprasCompleta(lista) {
    localStorage.setItem(CHAVE_LISTA, JSON.stringify(lista));
}


function salvarItemLista(item) {
    const lista = obterListaCompras();
    if (!item.id) item.id = Date.now();
    lista.push(item);
    salvarListaComprasCompleta(lista);
    return item;
}


function removerItemLista(id) {
    let lista = obterListaCompras();
    lista = lista.filter(i => String(i.id) !== String(id));
    salvarListaComprasCompleta(lista);
    return lista;
}

