

// Atualização contínua do relógio estilo iOS
function atualizarRelogio() {
    const elementoRelogio = document.getElementById('relogio-ao-vivo');
    if (elementoRelogio) {
        const agora = new Date();
        const horas = String(agora.getHours()).padStart(2, '0');
        const minutos = String(agora.getMinutes()).padStart(2, '0');
        elementoRelogio.innerText = `${horas}:${minutos}`;
    }
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

/**
 * Alterna entre as telas da aplicação (SPA) e sincroniza URLs e botões da barra inferior
 * @param {string} idAba - 'inicio' | 'despensa' | 'lista' | 'comprados'
 */
function mudarTela(idAba) {
    // 1. Alterna visualização das telas
    document.querySelectorAll('.app-tela').forEach(el => el.classList.remove('ativo'));
    const telaDestino = document.getElementById('tela-' + idAba);
    if (telaDestino) {
        telaDestino.classList.add('ativo');
    }

    // 2. Atualiza a barra de endereço simulada
    const enderecos = {
        'inicio': 'minhascompras.com.br',
        'despensa': 'minhascompras.com.br/Despensa',
        'lista': 'minhascompras.com.br/ListaDeMercado',
        'comprados': 'minhascompras.com.br/Comprados'
    };
    const urlNavegador = document.getElementById('url-navegador');
    if (urlNavegador) {
        urlNavegador.innerText = enderecos[idAba] || 'minhascompras.com.br';
    }

    // 3. Atualiza estado e tema da barra inferior
    const barraInferior = document.getElementById('barra-inferior');
    if (barraInferior) {
        if (idAba === 'comprados') {
            barraInferior.className = 'barra-abas-inferior fundo-barra-branco';
        } else {
            barraInferior.className = 'barra-abas-inferior fundo-barra-verde';
        }
    }

    document.querySelectorAll('.botao-navegacao-aba').forEach(botao => {
        const attrOnClick = botao.getAttribute('onclick') || '';
        if (attrOnClick.includes(`'${idAba}'`)) {
            botao.classList.add('ativo');
        } else {
            botao.classList.remove('ativo');
        }
    });

    // 4. Dispara a renderização dos dados da tela selecionada
    if (idAba === 'despensa' && typeof renderDespensa === 'function') renderDespensa();
    if (idAba === 'lista' && typeof renderListaCompras === 'function') renderListaCompras();
    if (idAba === 'comprados' && typeof renderComprados === 'function') renderComprados();
    if (typeof atualizarAlertasComprados === 'function') atualizarAlertasComprados();
}

