import { RELOP, ADDOP, MULOP, CONSTANTE, IDENTIFICADOR, DESCONHECIDO, FECHAMENTO_PARENTESES } from '../src/tiposTokens';
import palavrasReservadas from './palavrasReservadas';
import simbolosValidos from './simbolosValidos';

export default function AnalisadorLexico(entrada) {
    const marcoFinalEntrada = '\0';

    const caracteres = entrada.split('');
    caracteres.push(marcoFinalEntrada);

    let c = 0;
    let ultimaToken = null;
    let proximaToken = null;

    function ultimaTokenNaoEh(...tipos) {
        if(ultimaToken) {
            return tipos.some(tipoToken => tipoToken == ultimaToken.tipo) == false;
        }
        return true;
    }

    function salvarToken(token) {
        ultimaToken = { ...token };
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

    this.encontrarProximaToken = () => {
        if(proximaToken) {
            try {
                return proximaToken;
            }finally {
                proximaToken = null;
            }
        }

        let estado = 0;
        let lexema = '';

        function montarESalvarToken(tipo) {
            const token = { lexema, tipo };
            salvarToken(token);
            return token;
        }

        while(c < caracteres.length) {
            try {
                const caracter = caracteres[c];

                switch(estado) {
                    case 0:
                        if(caracter == ' ' || ehCaracterNovaLinha(caracter)) {
                            estado = 0;
                        }else if(caracter == '<') {
                            estado = 1;
                            lexema += caracter;
                        } else if(caracter == '=') {
                            lexema += caracter;
                            return montarESalvarToken(RELOP);
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
                        return montarESalvarToken(RELOP);

                    case 6:
                        if(caracter == '=') {
                            lexema += caracter;
                        }else {
                            if(caracter != marcoFinalEntrada) {
                                c--;
                            }
                        }
                        return montarESalvarToken(RELOP);

                    case 9:
                        if(caracter == '*' || caracter == '/') {
                            lexema += caracter;
                            return montarESalvarToken(MULOP);
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
                            return montarESalvarToken(ADDOP);
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
                            return montarESalvarToken(CONSTANTE);
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
                            const tokenConstante = montarESalvarToken(CONSTANTE);

                            lexema = '.';
                            proximaToken = montarESalvarToken(DESCONHECIDO);

                            return tokenConstante;
                        }
                        break;
                    
                    case 19:
                        if(ehDigito(caracter)) {
                            lexema += caracter;
                        }else {
                            if(caracter != marcoFinalEntrada) {
                                c--;
                            }
                            return montarESalvarToken(CONSTANTE);
                        }
                        break;

                    case 21:
                        if(ehLetra(caracter)) {
                            estado = 22;
                            lexema += caracter;
                        }else if(caracter != marcoFinalEntrada) {
                            lexema += caracter;

                            const tokenSimboloValido = encontrarSimboloValidoPeloLexema(caracter);
                            if(tokenSimboloValido) {
                                salvarToken(tokenSimboloValido);
                                return tokenSimboloValido;
                            }else {
                                return montarESalvarToken(DESCONHECIDO);
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

                            const tokenReservada = encontrarPalavraReservadaPeloLexema(lexema);
                            if(tokenReservada) {
                                salvarToken(tokenReservada);
                                return tokenReservada;
                            }else {
                                return montarESalvarToken(IDENTIFICADOR);
                            }
                        }
                        break;
                }
            }finally {
                c++;
            }
        }
    };
}