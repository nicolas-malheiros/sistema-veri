window.onload = function() {
    const mensagemInteracao = document.querySelector('.mensagem-engracada');

    // Verifica se o elemento foi encontrado
    if (mensagemInteracao) {
        // Altera o conteúdo após 5 segundos
        setTimeout(() => {
            mensagemInteracao.textContent = 'Bom, já que está bonitinho, e você concordou, escolha uma Opção:';
        }, 5000);
    } else {
        console.error('Elemento .mensagem-engracada não encontrado!');
    }
};