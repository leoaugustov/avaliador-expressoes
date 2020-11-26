import { ADDOP, MULOP, RELOP } from './tiposTokens';
import { ARITMETICA, LOGICA, RELACIONAL } from './tiposOperacoes';

import {
    TOKEN_NEGACAO,
    TOKEN_E_LOGICO,
    TOKEN_OU_LOGICO,
    TOKEN_DIVISAO_INTEIRA,
    TOKEN_RESTO_DIVISAO
} from './palavrasReservadas';

const relacaoLexemaOperador = [
    [
        TOKEN_NEGACAO.lexema, {
            ...TOKEN_NEGACAO,
            precedencia: 5,
            tipoOperacao: LOGICA
        }
    ], [
        TOKEN_DIVISAO_INTEIRA.lexema, {
            ...TOKEN_DIVISAO_INTEIRA,
            precedencia: 4,
            tipoOperacao: ARITMETICA
        }
    ], [
        TOKEN_RESTO_DIVISAO.lexema, {
            ...TOKEN_RESTO_DIVISAO,
            precedencia: 4,
            tipoOperacao: ARITMETICA
        }
    ], [
        '*', {
            tipo: MULOP,
            lexema: '*',
            precedencia: 4,
            tipoOperacao: ARITMETICA
        }
    ], [
        '/', {
            tipo: MULOP,
            lexema: '/',
            precedencia: 4,
            tipoOperacao: ARITMETICA
        }
    ], [
        '+', {
            tipo: ADDOP,
            lexema: '+',
            precedencia: 3,
            tipoOperacao: ARITMETICA
        }
    ], [
        '-', {
            tipo: ADDOP,
            lexema: '-',
            precedencia: 3,
            tipoOperacao: ARITMETICA
        }
    ], [
        '=', {
            tipo: RELOP,
            lexema: '=',
            precedencia: 2,
            tipoOperacao: RELACIONAL
        }
    ], [
        '<>', {
            tipo: RELOP,
            lexema: '<>',
            precedencia: 2,
            tipoOperacao: RELACIONAL
        }
    ], [
        '>', {
            tipo: RELOP,
            lexema: '>',
            precedencia: 2,
            tipoOperacao: RELACIONAL
        }
    ], [
        '>=', {
            tipo: RELOP,
            lexema: '>=',
            precedencia: 2,
            tipoOperacao: RELACIONAL
        }
    ], [
        '<', {
            tipo: RELOP,
            lexema: '<',
            precedencia: 2,
            tipoOperacao: RELACIONAL
        }
    ], [
        '<=', {
            tipo: RELOP,
            lexema: '<=',
            precedencia: 2,
            tipoOperacao: RELACIONAL
        }
    ], [
        TOKEN_E_LOGICO.lexema, {
            ...TOKEN_E_LOGICO,
            precedencia: 1,
            tipoOperacao: LOGICA
        }
    ], [
        TOKEN_OU_LOGICO.lexema, {
            ...TOKEN_OU_LOGICO,
            precedencia: 0,
            tipoOperacao: LOGICA
        }
    ]
];

const mapaOperadores = new Map(relacaoLexemaOperador);
export default mapaOperadores;