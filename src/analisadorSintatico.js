import { 
    IDENTIFICADOR,
    CONSTANTE,
    ADDOP,
    MULOP,
    RELOP,
    NEGACAO,
    VIRGULA,
    ABERTURA_PARENTESES,
    FECHAMENTO_PARENTESES
} from './tiposTokens';

export default function AnalisadorSintatico(analisadorLexico) {
    let tokens = [];
    let tokenPendente;

    function pegarProximaToken() {
        if(tokenPendente) {
            try{
                return tokenPendente;
            }finally {
                tokenPendente = null;
            }
        }

        const token = analisadorLexico.encontrarProximaToken();
        if(token) {
            tokens.push(token);
        }
        return token;
    }

    function reconhecerExpressionList() {
        if(reconhecerExpression()) {
            let token = pegarProximaToken();

            if(token) {
                if(token.tipo == VIRGULA) {
                    return reconhecerExpressionList();
                }else {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    function reconhecerExpression() {
        if(reconhecerSimpleExpression()) {
            let token = pegarProximaToken();

            if(token && token.tipo == RELOP) {
                return reconhecerSimpleExpression();
            }else {
                tokenPendente = token;
                return true;
            }
        }
        return false;
    }

    function reconhecerSimpleExpression() {
        if(reconhecerTerm()) {
            let token = pegarProximaToken();

            if(token && token.tipo == ADDOP) {
                return reconhecerSimpleExpression();
            }else {
                tokenPendente = token;
                return true;
            }
        }
        return false;
    }

    function reconhecerTerm() {
        if(reconhecerFactor()) {
            let token = pegarProximaToken();

            if(token && token.tipo == MULOP) {
                return reconhecerTerm();
            }else {
                tokenPendente = token;
                return true;
            }
        }
        return false;
    }

    function reconhecerFactor() {
        let token = pegarProximaToken();

        if(token) {
            if(token.tipo == IDENTIFICADOR || token.tipo == CONSTANTE) {
                return true;
            }
    
            if(token.tipo == NEGACAO && reconhecerFactor()) {
                return true;
            }
    
            if(token.tipo == ABERTURA_PARENTESES && reconhecerExpression()) {
                token = pegarProximaToken();
                if(token && token.tipo == FECHAMENTO_PARENTESES) {
                    return true;
                }
            }
        }
        return false;
    }
    
    this.analisar = () => {
        const sintaticamenteCorreto = reconhecerExpressionList();
        if(sintaticamenteCorreto) {
            return { sintaticamenteCorreto, tokens };
        }
        return { sintaticamenteCorreto };
    }
}