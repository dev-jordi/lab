let bancoUsuarios = []; 
let usuarioLogado = null; 
let emailEmRecuperacao = ""; 

// NAVEGAÇÃO ENTRE TELAS
function alternarTelas(idAlvo) {
    const telas = ['secaoCadastro', 'secaoLogin', 'secaoEsqueci', 'secaoNovaSenha', 'areaLogada', 'secaoEdicao'];
    telas.forEach(tela => document.getElementById(tela).classList.add('hidden'));
    document.getElementById(idAlvo).classList.remove('hidden');
    document.getElementById('feedback').innerHTML = "";
}

// RF01: REGISTRO COM FOTO OPCIONAL
function registrar() {
    const nome = document.getElementById('regNome').value;
    const email = document.getElementById('regEmail').value;
    const senha = document.getElementById('regSenha').value;
    const conf = document.getElementById('regConfSenha').value;
    const fotoFile = document.getElementById('regFoto').files[0];

    if (!nome || !email || !senha) return exibirFeedback("Campos obrigatórios vazios!", "error");
    if (bancoUsuarios.find(u => u.email === email)) return exibirFeedback("E-mail já cadastrado!", "error");
    if (senha !== conf) return exibirFeedback("As senhas não coincidem!", "error");
    
    // Regra de senha: 6+ chars, letras e números
    const regexSenha = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!regexSenha.test(senha)) {
        return exibirFeedback("Senha deve ter 6+ caracteres, com letras e números.", "error");
    }

    let fotoUrl = fotoFile ? URL.createObjectURL(fotoFile) : "";

    bancoUsuarios.push({ nome, email, senha, foto: fotoUrl });
    exibirFeedback("Conta criada com sucesso!", "success");
    setTimeout(() => alternarTelas('secaoLogin'), 1200);
}

// RF02: LOGIN
function fazerLogin() {
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;
    usuarioLogado = bancoUsuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioLogado) {
        document.getElementById('userNome').innerText = usuarioLogado.nome;
        const img = document.getElementById('userFotoExibicao');
        if (usuarioLogado.foto) {
            img.src = usuarioLogado.foto;
            img.style.display = "block";
        } else {
            img.style.display = "none";
        }
        alternarTelas('areaLogada');
    } else {
        exibirFeedback("E-mail ou senha incorretos!", "error");
    }
}

function fazerLogout() {
    usuarioLogado = null;
    alternarTelas('secaoLogin');
}

// RF03: RECUPERAÇÃO
function solicitarLink() {
    const email = document.getElementById('recupEmailInput').value;
    if (bancoUsuarios.find(u => u.email === email)) {
        emailEmRecuperacao = email;
        exibirFeedback("Link de recuperação gerado!", "success");
        setTimeout(() => alternarTelas('secaoNovaSenha'), 1200);
    } else {
        exibirFeedback("E-mail não encontrado.", "error");
    }
}

function atualizarSenha() {
    const nova = document.getElementById('novaSenha').value;
    const conf = document.getElementById('confNovaSenha').value;
    const regexSenha = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (nova === conf && regexSenha.test(nova)) {
        const u = bancoUsuarios.find(user => user.email === emailEmRecuperacao);
        u.senha = nova;
        exibirFeedback("Senha atualizada com sucesso!", "success");
        setTimeout(() => alternarTelas('secaoLogin'), 1200);
    } else {
        exibirFeedback("Senha inválida ou não coincidente.", "error");
    }
}

// RF04: EDIÇÃO DE PERFIL
function abrirEdicao() {
    document.getElementById('editNome').value = usuarioLogado.nome;
    document.getElementById('editEmail').value = usuarioLogado.email;
    alternarTelas('secaoEdicao');
}

function salvarEdicao() {
    const novoNome = document.getElementById('editNome').value;
    const novoEmail = document.getElementById('editEmail').value;
    const novaSenha = document.getElementById('editSenha').value;
    const novaFoto = document.getElementById('editFoto').files[0];

    // Verificar e-mail duplicado em outros perfis
    if (bancoUsuarios.find(u => u.email === novoEmail && u !== usuarioLogado)) {
        return exibirFeedback("E-mail já está em uso por outro usuário.", "error");
    }

    usuarioLogado.nome = novoNome;
    usuarioLogado.email = novoEmail;
    
    if (novaFoto) {
        usuarioLogado.foto = URL.createObjectURL(novaFoto);
        document.getElementById('userFotoExibicao').src = usuarioLogado.foto;
        document.getElementById('userFotoExibicao').style.display = "block";
    }

    if (novaSenha) {
        const regexSenha = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (regexSenha.test(novaSenha) && novaSenha === document.getElementById('editConfSenha').value) {
            usuarioLogado.senha = novaSenha;
        } else {
            return exibirFeedback("Nova senha inválida ou confirmação errada.", "error");
        }
    }

    document.getElementById('userNome').innerText = usuarioLogado.nome;
    exibirFeedback("Perfil atualizado!", "success");
    setTimeout(() => alternarTelas('areaLogada'), 1200);
}

function exibirFeedback(msg, tipo) {
    document.getElementById('feedback').innerHTML = `<div class="${tipo}">${msg}</div>`;
}