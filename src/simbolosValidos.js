import { VIRGULA, ABERTURA_PARENTESES, FECHAMENTO_PARENTESES } from './tiposTokens';

export const TOKEN_VIRGULA = {
    tipo: VIRGULA,
    lexema: ','
};

export const TOKEN_ABERTURA_PARENTESES = {
    tipo: ABERTURA_PARENTESES,
    lexema: '('
};

export const TOKEN_FECHAMENTO_PARENTESES = {
    tipo: FECHAMENTO_PARENTESES,
    lexema: ')'
};

export default { TOKEN_VIRGULA, TOKEN_ABERTURA_PARENTESES, TOKEN_FECHAMENTO_PARENTESES };