import { ADDOP, MULOP, NEGACAO } from './tiposTokens';

const palavrasReservadas = [{
    tipo: NEGACAO,
    lexema: 'not'
}, {
    tipo: MULOP,
    lexema: 'div'
}, {
    tipo: MULOP,
    lexema: 'mod'
}, {
    tipo: MULOP,
    lexema: 'and'
}, {
    tipo: ADDOP,
    lexema: 'or'
}];

export default palavrasReservadas;