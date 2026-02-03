// Dashboard Financeiro
let transacoes = [];
let usuarioAtual = null;

// Verificar login ao carregar
document.addEventListener('DOMContentLoaded', function() {
    usuarioAtual = verificarLogin();
    if (usuarioAtual) {
        carregarDadosUsuario();
        carregarTransacoes();
        atualizarResumo();
        
        // Definir data atual como padrão
        document.getElementById('dataTransacao').value = new Date().toISOString().split('T')[0];
    }
});

function verificarLogin() {
    // Simular verificação de login - adapte conforme necessário
    return { id: 1, nome: 'Usuário Teste', foto: '' };
}

function carregarDadosUsuario() {
    document.getElementById('navUserNome').textContent = usuarioAtual.nome;
    
    const fotoNav = document.getElementById('navUserFoto');
    if (usuarioAtual.foto) {
        fotoNav.src = usuarioAtual.foto;
        fotoNav.style.display = 'inline-block';
    }
}

function carregarTransacoes() {
    const chave = `financeiro_transacoes_${usuarioAtual.id}`;
    transacoes = JSON.parse(localStorage.getItem(chave)) || [];
    exibirTransacoes();
}

function salvarTransacoes() {
    const chave = `financeiro_transacoes_${usuarioAtual.id}`;
    localStorage.setItem(chave, JSON.stringify(transacoes));
}

function adicionarTransacao() {
    const tipo = document.getElementById('tipoTransacao').value;
    const descricao = document.getElementById('descricaoTransacao').value.trim();
    const valor = parseFloat(document.getElementById('valorTransacao').value);
    const data = document.getElementById('dataTransacao').value;
    
    if (!tipo || !descricao || !valor || !data) {
        alert('Preencha todos os campos!');
        return;
    }
    
    if (valor <= 0) {
        alert('O valor deve ser maior que zero!');
        return;
    }
    
    const novaTransacao = {
        id: Date.now(),
        tipo,
        descricao,
        valor,
        data,
        dataRegistro: new Date().toISOString()
    };
    
    transacoes.unshift(novaTransacao);
    salvarTransacoes();
    exibirTransacoes();
    atualizarResumo();
    
    // Limpar formulário
    document.getElementById('formTransacao').reset();
    document.getElementById('dataTransacao').value = new Date().toISOString().split('T')[0];
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('transacaoModal'));
    modal.hide();
}

function exibirTransacoes() {
    const lista = document.getElementById('listaTransacoes');
    
    if (transacoes.length === 0) {
        lista.innerHTML = '<p class="text-muted text-center">Nenhuma transação encontrada. Adicione sua primeira transação!</p>';
        return;
    }
    
    let html = '<div class="table-responsive"><table class="table table-hover"><thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor</th><th>Ações</th></tr></thead><tbody>';
    
    transacoes.forEach(transacao => {
        const valorFormatado = formatarMoeda(transacao.valor);
        const dataFormatada = formatarData(transacao.data);
        const tipoClass = transacao.tipo === 'receita' ? 'text-success' : 'text-danger';
        const tipoIcon = transacao.tipo === 'receita' ? 'bi-arrow-up-circle' : 'bi-arrow-down-circle';
        
        html += `
            <tr>
                <td>${dataFormatada}</td>
                <td>${transacao.descricao}</td>
                <td class="${tipoClass}">
                    <i class="bi ${tipoIcon} me-1"></i>
                    ${transacao.tipo.charAt(0).toUpperCase() + transacao.tipo.slice(1)}
                </td>
                <td class="${tipoClass} fw-bold">${valorFormatado}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirTransacao(${transacao.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    lista.innerHTML = html;
}

function excluirTransacao(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        transacoes = transacoes.filter(t => t.id !== id);
        salvarTransacoes();
        exibirTransacoes();
        atualizarResumo();
    }
}

function atualizarResumo() {
    let totalReceitas = 0;
    let totalDespesas = 0;
    
    transacoes.forEach(transacao => {
        if (transacao.tipo === 'receita') {
            totalReceitas += transacao.valor;
        } else {
            totalDespesas += transacao.valor;
        }
    });
    
    const saldo = totalReceitas - totalDespesas;
    
    document.getElementById('totalReceitas').textContent = formatarMoeda(totalReceitas);
    document.getElementById('totalDespesas').textContent = formatarMoeda(totalDespesas);
    document.getElementById('saldoTotal').textContent = formatarMoeda(saldo);
    
    // Alterar cor do saldo baseado no valor
    const saldoElement = document.getElementById('saldoTotal').parentElement.parentElement.parentElement;
    saldoElement.className = saldo >= 0 ? 'card text-white bg-primary' : 'card text-white bg-warning';
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(data) {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        window.location.href = 'auth.html';
    }
}

// Responsividade
window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        document.querySelectorAll('.table-responsive').forEach(table => {
            table.style.fontSize = '0.9rem';
        });
    }
});
