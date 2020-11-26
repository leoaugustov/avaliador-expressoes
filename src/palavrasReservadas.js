import { ADDOP, MULOP, NEGACAO } from './tiposTokens';

export const TOKEN_DIVISAO_INTEIRA = {
    tipo: MULOP,
    lexema: 'div'
};

export const TOKEN_RESTO_DIVISAO = {
    tipo: MULOP,
    lexema: 'mod'
};

export const TOKEN_NEGACAO = {
    tipo: NEGACAO,
    lexema: 'not'
};

export const TOKEN_E_LOGICO = {
    tipo: MULOP,
    lexema: 'and'
};

export const TOKEN_OU_LOGICO = {
    tipo: ADDOP,
    lexema: 'or'
};

export default [
    TOKEN_NEGACAO,
    TOKEN_E_LOGICO,
    TOKEN_OU_LOGICO,
    TOKEN_DIVISAO_INTEIRA,
    TOKEN_RESTO_DIVISAO
];