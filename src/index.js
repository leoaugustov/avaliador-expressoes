import AnalisadorLexico from './analisadorLexico';
import AnalisadorSintatico from './analisadorSintatico';

document.querySelector('form').onsubmit = e => {
    e.preventDefault();
    const formulario = e.target;
    const entrada = new FormData(formulario).get('entrada');
    const analisadorSintatico = new AnalisadorSintatico(new AnalisadorLexico(entrada));

    const sintaticamenteCorreto = analisadorSintatico.analisar();

    document.getElementById("secao-resultado-analise-sintatica").innerHTML = `
    <div class="alert alert-${sintaticamenteCorreto ? 'success': 'danger'} animate__animated animate__zoomIn" role="alert">
        As expressões informadas estão <strong>sintaticamente ${sintaticamenteCorreto ? 'corretas': 'incorretas'}</strong>
    </div>
    `;
}