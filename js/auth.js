// https://localhost:7087/api/Account
// Configuração da URL da API (depois de publicado entra o domínio de produção backend: https://www.dominio.com.br/api/Account)
// Também poderiamos utilizar um endereço ip https://89.36.235.74:6095/api/Account

const API_URL = "https://localhost:7087/api/Account"

// Função para auxiliar as mensagens na tela
function showMessage(text , isError = true) {
    const msgDiv = document.getElementById('statusMgs');
    if(!msgDiv) return;

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
    if(msgDiv) msgDiv.className.add('d-none');

    if(isRecovery) {
        // Modo recuperar Senha
        if (passGroup) passGroup.classList.add('d-none'); // esconde o campo senha

        // Alterar os nomes dos elementos html
        authTitle.innerHTML = "Recuperar Senha <br> Games Tito";
        authSubtitle.innerText = "Informe seu email para receber o token."
        mainBnt.innerHTML = "Recuperar Senha";
        mainBnt.onclick = solicitarRecuperacao; // Altera a função do click
        linkToggle.innerHTML = "Voltar para o Login";
        linkToggle.onclick = () => toggleRecoveryMode(false);

        if(linkRegister) linkRegister.classList.add('d-none');
    } else {}

}