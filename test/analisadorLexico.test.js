import analisadorLexico from '../src/analisadorLexico';
import { RELOP, ADDOP, MULOP, CONSTANTE, IDENTIFICADOR, DESCONHECIDO } from '../src/tiposTokens';
import { TOKEN_VIRGULA, TOKEN_ABERTURA_PARENTESES, TOKEN_FECHAMENTO_PARENTESES } from '../src/simbolosValidos';

const TOKEN_DESCONHECIDA_LEXEMA_PONTO = {
    tipo: DESCONHECIDO,
    lexema: '.'
};
const TOKEN_ADDOP_LEXEMA_SINAL_MENOS = {
    tipo: ADDOP,
    lexema: '-'
};
const TOKEN_MULOP = {
    tipo: MULOP,
    lexema: '*'
};
const TOKEN_RELOP = {
    tipo: RELOP,
    lexema: '='
};

function testarQuandoDeveGerarUmaUnicaToken(lexema, tipo) {
    test(`deve retornar ${tipo} com lexema ${lexema}`, () => {
        const tokens = analisadorLexico.analisar(lexema);

        expect(tokens).toEqual([{
            lexema,
            tipo
        }]);
    });
}

describe('Reconhecimento de RELOPs', () => {
    testarQuandoDeveGerarUmaUnicaToken('=', RELOP);
    testarQuandoDeveGerarUmaUnicaToken('<>', RELOP);
    testarQuandoDeveGerarUmaUnicaToken('<', RELOP);
    testarQuandoDeveGerarUmaUnicaToken('<=', RELOP);
    testarQuandoDeveGerarUmaUnicaToken('>', RELOP);
    testarQuandoDeveGerarUmaUnicaToken('>=', RELOP);
});

describe('Reconhecimento de MULOPs', () => {
    testarQuandoDeveGerarUmaUnicaToken('*', MULOP);
    testarQuandoDeveGerarUmaUnicaToken('/', MULOP);
    testarQuandoDeveGerarUmaUnicaToken('div', MULOP);
    testarQuandoDeveGerarUmaUnicaToken('mod', MULOP);
    testarQuandoDeveGerarUmaUnicaToken('and', MULOP);
});

describe('Reconhecimento de ADDOPs', () => {
    testarQuandoDeveGerarUmaUnicaToken('+', ADDOP);
    testarQuandoDeveGerarUmaUnicaToken('-', ADDOP);
    testarQuandoDeveGerarUmaUnicaToken('or', ADDOP);
});

describe('Reconhecimento de Identificadores', () => {
    testarQuandoDeveGerarUmaUnicaToken('a', IDENTIFICADOR);
    testarQuandoDeveGerarUmaUnicaToken('abc', IDENTIFICADOR);
    testarQuandoDeveGerarUmaUnicaToken('ab12', IDENTIFICADOR);
    testarQuandoDeveGerarUmaUnicaToken('AND', IDENTIFICADOR);
});

describe('Reconhecimento de Constantes', () => {
    testarQuandoDeveGerarUmaUnicaToken('45', CONSTANTE);
    testarQuandoDeveGerarUmaUnicaToken('+45', CONSTANTE);
    testarQuandoDeveGerarUmaUnicaToken('-45', CONSTANTE);
    testarQuandoDeveGerarUmaUnicaToken('45.3', CONSTANTE);
    
    test('deve retornar CONSTANTE com lexema 45.35, DESCONHECIDO com lexema . e CONSTANTE com lexema 25', () => {
        const tokens = analisadorLexico.analisar('45.35.25');
    
        expect(tokens).toEqual([{
            lexema: '45.35',
            tipo: CONSTANTE
        }, {
            ...TOKEN_DESCONHECIDA_LEXEMA_PONTO, 
        }, {
            lexema: '25',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar DESCONHECIDO com lexema . e CONSTANTE com lexema 45', () => {
        const tokens = analisadorLexico.analisar('.45');
    
        expect(tokens).toEqual([{
            ...TOKEN_DESCONHECIDA_LEXEMA_PONTO
        }, {
            lexema: '45',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar CONSTANTE com lexema 45 e DESCONHECIDO com lexema .', () => {
        const tokens = analisadorLexico.analisar('45.');
    
        expect(tokens).toEqual([{
            lexema: '45',
            tipo: CONSTANTE
        }, {
            ...TOKEN_DESCONHECIDA_LEXEMA_PONTO
        }]);
    });

    test('deve retornar ABERTURA-PARENTESES e CONSTANTE com lexema -45', () => {
        const tokens = analisadorLexico.analisar('(-45');
    
        expect(tokens).toEqual([{
            ...TOKEN_ABERTURA_PARENTESES
        }, {
            lexema: '-45',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar FECHAMENTO-PARENTESES, ADDOP com lexema - e CONSTANTE com lexema 45', () => {
        const tokens = analisadorLexico.analisar(')-45');
    
        expect(tokens).toEqual([{
            ...TOKEN_FECHAMENTO_PARENTESES
        }, {
            ...TOKEN_ADDOP_LEXEMA_SINAL_MENOS
        }, {
            lexema: '45',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar CONSTANTE com lexema 5, ADDOP com lexema - e CONSTANTE com lexema 45', () => {
        const tokens = analisadorLexico.analisar('5-45');
    
        expect(tokens).toEqual([{
            lexema: '5',
            tipo: CONSTANTE
        }, {
            ...TOKEN_ADDOP_LEXEMA_SINAL_MENOS
        }, {
            lexema: '45',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar IDENTIFICADOR com lexema a, ADDOP com lexema - e CONSTANTE com lexema 45', () => {
        const tokens = analisadorLexico.analisar('a-45');
    
        expect(tokens).toEqual([{
            lexema: 'a',
            tipo: IDENTIFICADOR
        }, {
            ...TOKEN_ADDOP_LEXEMA_SINAL_MENOS
        }, {
            lexema: '45',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar CONSTANTE com lexema 5, ADDOP com lexema - e CONSTANTE com lexema -5', () => {
        const tokens = analisadorLexico.analisar('5--5');
    
        expect(tokens).toEqual([{
            lexema: '5',
            tipo: CONSTANTE
        }, {
            ...TOKEN_ADDOP_LEXEMA_SINAL_MENOS
        }, {
            lexema: '-5',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar VIRGULA e CONSTANTE com lexema -45', () => {
        const tokens = analisadorLexico.analisar(',-45');
    
        expect(tokens).toEqual([{
            ...TOKEN_VIRGULA
        }, {
            lexema: '-45',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar VIRGULA e CONSTANTE com lexema -45', () => {
        const tokens = analisadorLexico.analisar(',-45');
    
        expect(tokens).toEqual([{
            ...TOKEN_VIRGULA
        }, {
            lexema: '-45',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar IDENTIFICADOR com lexema a, MULOP e CONSTANTE com lexema -45', () => {
        const tokens = analisadorLexico.analisar(`a ${TOKEN_MULOP.lexema} -45`);
    
        expect(tokens).toEqual([{
            lexema: 'a',
            tipo: IDENTIFICADOR
        }, {
            ...TOKEN_MULOP
        }, {
            lexema: '-45',
            tipo: CONSTANTE
        }]);
    });

    test('deve retornar IDENTIFICADOR com lexema a, RELOP e CONSTANTE com lexema -45', () => {
        const tokens = analisadorLexico.analisar(`a ${TOKEN_RELOP.lexema} -45`);
    
        expect(tokens).toEqual([{
            lexema: 'a',
            tipo: IDENTIFICADOR
        }, {
            ...TOKEN_RELOP
        }, {
            lexema: '-45',
            tipo: CONSTANTE
        }]);
    });
});