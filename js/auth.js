// https://localhost:7087/api/Account
// Configuração da URL da API (depois de publicado entra o domínio de produção backend: https://www.dominio.com.br/api/Account)
// Também poderiamos utilizar um endereço ip https://89.36.235.74:6095/api/Account

const API_URL = "https://localhost:7079/api/Account"

// Função para auxiliar as mensagens na tela
function showMessage(text, isError = true) {
    const msgDiv = document.getElementById('statusMgs');
    if (!msgDiv) return;

    msgDiv.innerText = text;
    msgDiv.classList.remove('d-none', 'msg-success', 'msg-error');
    msgDiv.classList.add(isError ? 'msg-error' : 'msg-success')
}

// Alterna a interface entre o modo 'Login' e 'Recuperar Senha'

/**
 * @param {boolean} isRecovery -- Se verdadeiro, entra no modo "recuperar senha"
 */

function toggleRecoveryMode(isRecovery) {
    const passGroup = document.getElementById('passwordGroup');
    const mainBnt = document.getElementById('mainBtn');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const linkToggle = document.getElementById("linkToggle");
    const linkRegister = document.getElementById('linkRegister');
    const msgDiv = document.getElementById('msgDiv');

    // Limpa a mensagem anterior  ao trocar de modo 
    if (msgDiv) msgDiv.classList.add('d-none');

    if (isRecovery) {
        // -- MODO recuperar Senha
        if (passGroup) passGroup.classList.add('d-none'); // esconde o campo senha

        // Alterar os nomes dos elementos html
        authTitle.innerHTML = "Recuperar Senha <br> Games Tito";
        authSubtitle.innerText = "Informe seu email para receber o token."
        mainBnt.innerHTML = "Recuperar Senha";
        mainBnt.onclick = solicitarRecuperacao; // Altera a função do click
        linkToggle.innerHTML = "Voltar para o Login";
        linkToggle.onclick = () => toggleRecoveryMode(false);

        if (linkRegister) linkRegister.classList.add('d-none');
    } else {
        // --- MODO Login
        // Mostra o campo de senha
        if (passGroup) passGroup.classList.remove('d-none');
        authTitle.innerHTML = "Games Tito";
        authSubtitle.innerText = "Acesse sua conta e curta os GAMES! :D"
        mainBnt.innerHTML = "Entrar";
        mainBnt.onclick = handleLogin; // Altera a função do click
        linkToggle.innerHTML = "Esqueci minha senha?";
        linkToggle.onclick = () => toggleRecoveryMode(true);
        if (linkRegister) linkRegister.classList.remove('d-none');





    }

}

/**
 * Lógica de solicitação de recuperação de senha
 * (Atualiza o campo de tela)
 */

async function solicitarRecuperacao() {
    const email = document.getElementById('loginEmail').value;
    // caso não tenha o email informar ao  usuário que ele precisa digitar o email

    if (!email) {
        showMessage("Digite seu email no campo para recuperar a senha!");
        email.focus();
        return;
    }

    try {
        showMessage("Processando à solicitação... ", false);

        // forgot-password
        const response = await fetch(`${API_URL}/forget-password`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email: email })
        }
        ); // Precisa ser com apóstrofos

        const result = await response.json();

        if (response.ok) {
            showMessage(result.message, false);
            // Opcional: volta para o modo login após 4 segundos
            setTimeout(() => toggleRecoveryMode(false), 4000)
        } else {
            showMessage("Erro ao processar: " + result.message);
        }
    } catch (error) {

        showMessage("Não foi possivel se conectar ao servidor. Tente novamente mais tarde.");
    }


}

/**
 *  Login no sistema
 */

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;

    const password = document.getElementById('loginPass').value;

    if (!email || !password) {
        showMessage("Por favor, preencha email e senha!");
        email.focus();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                passWordHash: password
            })
        });

        const result = await response.json()

        if (response.ok) {
            showMessage("Login realizado! Redirecionando...", false);
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 2000);
        } else {
            showMessage(result.message || "Usuário ou senha inválidos.");
        }
    } catch (error) {
        showMessage("Não foi possivel se conectar ao servidor tente mais tarde.");
    }
}

/**
 * Registrar o novo usuário
 */

async function handleRegister() {
    const nome = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;

    if (!nome || !email || !password) {
        showMessage("Por favor, preencha todos os campos!");
        nome.focus();
        return
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nomeCompleto: nome,
                email: email,
                passWordHash: password
            })
        });

        const result = await response.json();

        if (response.ok) {
            showMessage("Conta criada com sucesso. Redirecionando para o login...", false);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000)
        } else {
            showMessage("Falha no cadastro " + result.message);
        }
    } catch (error) {
        showMessage("Não foi possivel se conectar ao servidor tente mais tarde.");
    }
}

// Tem que ser um documento público pois irá ficar na máquina do cliente e se o cliente quisert ver o javascript da página poderá ver, mas se você quiser pode deixar privada na hospedagem