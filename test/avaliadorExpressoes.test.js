import { TOKEN_VIRGULA, TOKEN_ABERTURA_PARENTESES } from '../src/simbolosValidos';
import AvaliadorExpressoes from '../src/avaliadorExpressoes';

import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({ toBeDeepCloseTo });

function criarTokens(...itens) {
    return itens.map(item => {
        if(Array.isArray(item)) {
            return {
                lexema: item[0],
                valor: item[1]
            };
        }else if(typeof item === 'number') {
            return {
                lexema: item.toString(),
                valor: item
            }
        }
        return { lexema: item }
    });
}

function realizarAssercaoExpressaoInvalida(tokens, avaliacoesEsperadas) {
    expect(new AvaliadorExpressoes().avaliar(tokens)).toMatchObject(avaliacoesEsperadas);
}

function realizarAssercaoExpressaoValida(tokens, avaliacoesEsperadas) {
    const avaliacoesEfetivas = new AvaliadorExpressoes().avaliar(tokens);

    const expressoesEfetivas = avaliacoesEfetivas.map(avaliacao => avaliacao.expressao);
    const expressoesEsperadas = avaliacoesEsperadas.map(avaliacao => avaliacao.expressao);
    expect(expressoesEfetivas).toEqual(expressoesEsperadas);

    const resultadosEfetivas = avaliacoesEfetivas.map(avaliacao => avaliacao.resultado);
    const resultadosEsperadas = avaliacoesEsperadas.map(avaliacao => avaliacao.resultado);

    expect(resultadosEfetivas).toBeDeepCloseTo(resultadosEsperadas, 4);
}

describe('Operadores Aritméticos e Múltiplas Expressões', () => {
    test('deve calcular 5 quando "5"', () => {
        realizarAssercaoExpressaoValida(criarTokens(5), [{
            expressao: '5',
            resultado: 5
        }]);
    });

    test('deve calcular 5 quando "(5)"', () => {
        realizarAssercaoExpressaoValida(criarTokens('(', 5, ')'), [{
            expressao: '( 5 )',
            resultado: 5
        }]);
    });

    test('deve calcular 5 e 6 quando "5, 6"', () => {
        realizarAssercaoExpressaoValida(criarTokens(5, ',', 6), [{
            expressao: '5',
            resultado: 5
        }, {
            expressao: '6',
            resultado: 6
        }]);
    });

    test('deve calcular 5 quando "2 + 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(2, '+', 3), [{
            expressao: '2 + 3',
            resultado: 5
        }]);
    });

    test('deve calcular 5 quando "(2 + 3)"', () => {
        realizarAssercaoExpressaoValida(criarTokens('(', 2, '+', 3, ')'), [{
            expressao: '( 2 + 3 )',
            resultado: 5
        }]);
    });

    test('deve calcular 8.2137 quando "20.123456 / 2.45"', () => {
        realizarAssercaoExpressaoValida(criarTokens(20.123456, '/', 2.45), [{
            expressao: '20.123456 / 2.45',
            resultado: 8.2137
        }]);
    });

    test('deve calcular 1 quando "10 mod 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(10, 'mod', 3), [{
            expressao: '10 mod 3',
            resultado: 1
        }]);
    });

    test('deve calcular 3 quando "10 div 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(10, 'div', 3), [{
            expressao: '10 div 3',
            resultado: 3
        }]);
    });

    test('deve calcular 6 quando "10 div 4 * 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(10, 'div', 4, '*', 3), [{
            expressao: '10 div 4 * 3',
            resultado: 6
        }]);
    });

    test('deve calcular 11 quando "2 + 3 * 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(2, '+', 3, '*', 3), [{
            expressao: '2 + 3 * 3',
            resultado: 11
        }]);
    });

    test('deve calcular 15 quando "(2 + 3) * 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens('(', 2, '+', 3, ')', '*', 3), [{
            expressao: '( 2 + 3 ) * 3',
            resultado: 15
        }]);
    });

    test('deve haver erro na avaliação quando "3 / 0"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens(3, '/', 0), [{
            expressao: '3 / 0',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });

    test('deve haver erro na avaliação quando "3 * 2 div (2 - 2)"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens(3, '*', 2, 'div', '(',  2, '-', 2, ')'), [{
            expressao: '3 * 2 div ( 2 - 2 )',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });

    test('deve haver erro na avaliação quando "3 div 0"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens(3, 'div', 0), [{
            expressao: '3 div 0',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });
});

describe('Operadores relacionais', () => {
    test('deve calcular falso quando "2 = 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(2, '=', 3), [{
            expressao: '2 = 3',
            resultado: false
        }]);
    });

    test('deve calcular true quando "3 = 3.0"', () => {
        realizarAssercaoExpressaoValida(criarTokens(3, '=', 3.0), [{
            expressao: '3 = 3',
            resultado: true
        }]);
    });

    test('deve calcular verdadeiro quando "2 <> 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(2, '<>', 3), [{
            expressao: '2 <> 3',
            resultado: true
        }]);
    });

    test('deve calcular falso quando "2 > 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(2, '>', 3), [{
            expressao: '2 > 3',
            resultado: false
        }]);
    });

    test('deve calcular verdadeiro quando "2 < 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(2, '<', 3), [{
            expressao: '2 < 3',
            resultado: true
        }]);
    });

    test('deve calcular falso quando "2 >= 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(2, '>=', 3), [{
            expressao: '2 >= 3',
            resultado: false
        }]);
    });

    test('deve calcular verdadeiro quando "2 <= 3"', () => {
        realizarAssercaoExpressaoValida(criarTokens(2, '<=', 3), [{
            expressao: '2 <= 3',
            resultado: true
        }]);
    });
});

describe('Operações com Identificadores', () => {
    test('deve calcular 5 quando "a + b"', () => {
        realizarAssercaoExpressaoValida(criarTokens(['a', 3], '+', ['b', 2]), [{
            expressao: 'a + b',
            resultado: 5
        }]);
    });

    test('deve calcular true quando "a = b"', () => {
        realizarAssercaoExpressaoValida(criarTokens(['a', true], '=', ['b', true]), [{
            expressao: 'a = b',
            resultado: true
        }]);
    });

    test('deve calcular true quando "a <> b"', () => {
        realizarAssercaoExpressaoValida(criarTokens(['a', true], '<>', ['b', true]), [{
            expressao: 'a <> b',
            resultado: false
        }]);
    });

    test('deve haver erro na avaliação quando "a + b"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens(['a', true], '+', ['b', 2]), [{
            expressao: 'a + b',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });

    test('deve calcular true quando "a = b"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens(['a', true], '=', ['b', 2]), [{
            expressao: 'a = b',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });

    test('deve haver erro na avaliação quando "a > b"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens(['a', true], '>', ['b', false]), [{
            expressao: 'a > b',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });

    test('deve haver erro na avaliação quando "a > (b = c)"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens(['a', 2], '>', '(', ['b', true], '=', ['c', true], ')'), [{
            expressao: 'a > ( b = c )',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });

    test('deve calcular verdadeiro quando "a and b"', () => {
        realizarAssercaoExpressaoValida(criarTokens(['a', true], 'and', ['b', true]), [{
            expressao: 'a and b',
            resultado: true
        }]);
    });

    test('deve calcular verdadeiro quando "a or b"', () => {
        realizarAssercaoExpressaoValida(criarTokens(['a', false], 'or', ['b', true]), [{
            expressao: 'a or b',
            resultado: true
        }]);
    });

    test('deve calcular verdadeiro quando "not a"', () => {
        realizarAssercaoExpressaoValida(criarTokens('not', ['a', false]), [{
            expressao: 'not a',
            resultado: true
        }]);
    });

    test('deve calcular verdadeiro quando "not a and b"', () => {
        realizarAssercaoExpressaoValida(criarTokens('not', ['a', false], 'and', ['b', true]), [{
            expressao: 'not a and b',
            resultado: true
        }]);
    });
});

describe('Operadores lógicos', () => {
    test('deve haver erro na avaliação quando "5 and 3"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens(5, 'and', 3), [{
            expressao: '5 and 3',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });

    test('deve haver erro na avaliação quando "not 3"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens('not', 3), [{
            expressao: 'not 3',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });

    test('deve calcular falso quando "not (3 > 2)"', () => {
        realizarAssercaoExpressaoValida(criarTokens('not', '(', 3, '>', 2, ')'), [{
            expressao: 'not ( 3 > 2 )',
            resultado: false
        }]);
    });

    test('deve haver erro na avaliação quando "not 3 + 2"', () => {
        realizarAssercaoExpressaoInvalida(criarTokens('not', 3, '+', 2), [{
            expressao: 'not 3 + 2',
            erroAvaliacao: true,
            mensagem: expect.anything()
        }]);
    });
});