import analisadorLexico from './analisadorLexico';

const secaoTokenEncontradas = document.getElementById('secao-token-encontradas');
secaoTokenEncontradas.style.display = 'none';

document.querySelector('form').onsubmit = e => {
    e.preventDefault();
    const formulario = e.target;
    const entrada = new FormData(formulario).get('entrada');
    const tokens = analisadorLexico.analisar(entrada);
    
    const containerTokens = document.querySelector('#container-tokens ul');
    containerTokens.innerHTML = '';
    for(let token of tokens) {
        const li = document.createElement('li');
        li.classList.add('animate__animated', 'animate__fadeIn', 'mt-1');
        li.innerHTML = `${token.lexema} <div class="badge badge-primary">
                            ${token.tipo}
                        </div>`;
        
        containerTokens.appendChild(li);
    }

    secaoTokenEncontradas.style.display = 'block';
}