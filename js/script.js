const mensagemLogin = document.getElementById('mensagem-login');

function enterSite() {
    let name = document.getElementById('nameInput').value.toLowerCase();
    if (name == 'veri' || name == 'veridiana' || name == 'veridiana maria fuck' || name == 'veridiana maria') {
       // alert(`Bem-vinda(o), ${name}! Vamos começar a nossa aventura!`);
        window.location.href = `telas/menuInformacoes.html?name=${encodeURIComponent(name)}`;
    } else {
        let mensagemErro =  `<p style="color: red; font-size: 18px; margin-bottom: 15px; font-style: italic;"> Este site não foi feito para você! Uma Pena! </p>`;
        mensagemLogin.innerHTML = mensagemErro;
    
        setTimeout(() => {
            location.reload();
        }, 5000);
    }
}
