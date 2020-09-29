import { RELOP, ADDOP, MULOP, CONSTANTE, IDENTIFICADOR, DESCONHECIDO, FECHAMENTO_PARENTESES } from '../src/tiposTokens';
import palavrasReservadas from './palavrasReservadas';
import simbolosValidos from './simbolosValidos';

const marcoFinalEntrada = '\0';
let tokens = [];
let lexema = '';

function ultimaTokenNaoEh(...tipos) {
    let ultimaToken = tokens.slice(-1).pop();

    if(ultimaToken) {
        return tipos.some(tipoToken => tipoToken == ultimaToken.tipo) == false;
    }
    return true;
}

function salvarToken(tipo) {
    tokens.push({
        lexema,
        tipo
    });

    lexema = '';
}

function ehCaracterNovaLinha(str) {
    return /\r?\n|\r/.test(str);
}

function ehDigito(str) {
    return /^\d+$/.test(str);
}

function ehLetra(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function encontrarPalavraReservadaPeloLexema(lexema) {
    return Object.values(palavrasReservadas).find(token => token.lexema === lexema);
}

function encontrarSimboloValidoPeloLexema(lexema) {
    return Object.values(simbolosValidos).find(token => token.lexema === lexema);
}

function analisar(codigo) {
    tokens = [];
    const caracteres = codigo.split('');
    caracteres.push(marcoFinalEntrada);
    let estado = 0;

    let c = 0;
    while(c < caracteres.length) {
        const caracter = caracteres[c];

        switch(estado) {
            case 0:
                if(caracter == ' ' || ehCaracterNovaLinha(caracter)) {
                    estado = 0;
                }else if(caracter == '<') {
                    estado = 1;
                    lexema += caracter;
                } else if(caracter == '=') {
                    estado = 0;
                    lexema += caracter;
                    salvarToken(RELOP);
                } else if(caracter == '>') {
                    estado = 6;
                    lexema += caracter;
                }else {
                    estado = 9;
                    c--;
                }
                break;

            case 1:
                if(caracter == '>' || caracter == '=') {
                    lexema += caracter;
                }else {
                    if(caracter != marcoFinalEntrada) {
                        c--;
                    }
                }
                estado = 0;
                salvarToken(RELOP);
                break;

            case 6:
                if(caracter == '=') {
                    lexema += caracter;
                }else {
                    if(caracter != marcoFinalEntrada) {
                        c--;
                    }
                }
                estado = 0;
                salvarToken(RELOP);
                break;

            case 9:
                if(caracter == '*' || caracter == '/') {
                    estado = 0;
                    lexema += caracter;
                    salvarToken(MULOP);
                }else {
                    estado = 11;
                    c--;
                }
                break;

            case 11:
                if(caracter == '+' || caracter == '-') {
                    estado = 12;
                    lexema += caracter;
                }else {
                    estado = 15;
                    c--;
                }
                break;

            case 12:
                if(ultimaTokenNaoEh(CONSTANTE, IDENTIFICADOR, FECHAMENTO_PARENTESES) && ehDigito(caracter)) {
                    estado = 15;
                    c--;
                }else {
                    if(caracter != marcoFinalEntrada) {
                        c--;
                    }
                    estado = 0;
                    salvarToken(ADDOP);
                }
                break;

            case 15:
                if(ehDigito(caracter)) {
                    estado = 16;
                    lexema += caracter;
                }else {
                    estado = 21;
                    c--;
                }
                break;

            case 16:
                if(ehDigito(caracter)) {
                    lexema += caracter;
                }else if(caracter == '.') {
                    estado = 17;
                }else {
                    if(caracter != marcoFinalEntrada) {
                        c--;
                    }
                    estado = 0;
                    salvarToken(CONSTANTE);
                }
                break;

            case 17:
                if(ehDigito(caracter)) {
                    estado = 19;
                    lexema += '.' + caracter;
                }else {
                    if(caracter != marcoFinalEntrada) {
                        c--;
                    }
                    estado = 0;
                    salvarToken(CONSTANTE);

                    lexema += '.';
                    salvarToken(DESCONHECIDO);
                }
                break;
            
            case 19:
                if(ehDigito(caracter)) {
                    lexema += caracter;
                }else {
                    if(caracter != marcoFinalEntrada) {
                        c--;
                    }
                    estado = 0;
                    salvarToken(CONSTANTE);
                }
                break;

            case 21:
                if(ehLetra(caracter)) {
                    estado = 22;
                    lexema += caracter;
                }else if(caracter != marcoFinalEntrada) {
                    estado = 0;
                    lexema += caracter;

                    const tokenSimboloValido = encontrarSimboloValidoPeloLexema(caracter);
                    if(tokenSimboloValido) {
                        lexema = '';
                        tokens.push(tokenSimboloValido);
                    }else {
                        salvarToken(DESCONHECIDO);
                    }
                }
                break;

            case 22:
                if(ehLetra(caracter) || ehDigito(caracter)) {
                    lexema += caracter;
                }else {
                    if(caracter != marcoFinalEntrada) {
                        c--;
                    }
                    estado = 0;

                    const tokenReservada = encontrarPalavraReservadaPeloLexema(lexema);
                    if(tokenReservada) {
                        tokens.push(tokenReservada);
                        lexema = '';
                    }else {
                        salvarToken(IDENTIFICADOR);
                    }
                }
                break;
        }

        c++;
    }

    return tokens;
}

export default { analisar };