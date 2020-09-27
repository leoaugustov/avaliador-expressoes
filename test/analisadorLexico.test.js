import analisadorLexico from '../src/analisadorLexico';

const TIPO_RELOP = 'RELOP';
const TIPO_MULOP = 'MULOP';
const TIPO_ADDOP = 'ADDOP';
const TIPO_CONSTANTE = 'CONSTANTE';
const TIPO_IDENTIFICADOR = 'IDENTIFICADOR';
const TOKEN_DESCONHECIDA_LEXEMA_PONTO = {
    tipo: 'DESCONHECIDO',
    lexema: '.'
};
const TOKEN_ABERTURA_PARENTESES = {
    tipo: 'ABERTURA-PARENTESES',
    lexema: '('
};
const TOKEN_FECHAMENTO_PARENTESES = {
    tipo: 'FECHAMENTO-PARENTESES',
    lexema: ')'
};
const TOKEN_VIRGULA = {
    tipo: 'VIRGULA',
    lexema: ','
    };
const TOKEN_ADDOP_LEXEMA_SINAL_MENOS = {
    tipo: TIPO_ADDOP,
    lexema: '-'
};
const TOKEN_MULOP = {
    tipo: TIPO_MULOP,
    lexema: '*'
};
const TOKEN_RELOP = {
    tipo: TIPO_RELOP,
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
    testarQuandoDeveGerarUmaUnicaToken('=', TIPO_RELOP);
    testarQuandoDeveGerarUmaUnicaToken('<>', TIPO_RELOP);
    testarQuandoDeveGerarUmaUnicaToken('<', TIPO_RELOP);
    testarQuandoDeveGerarUmaUnicaToken('<=', TIPO_RELOP);
    testarQuandoDeveGerarUmaUnicaToken('>', TIPO_RELOP);
    testarQuandoDeveGerarUmaUnicaToken('>=', TIPO_RELOP);
});

describe('Reconhecimento de MULOPs', () => {
    testarQuandoDeveGerarUmaUnicaToken('*', TIPO_MULOP);
    testarQuandoDeveGerarUmaUnicaToken('/', TIPO_MULOP);
    testarQuandoDeveGerarUmaUnicaToken('div', TIPO_MULOP);
    testarQuandoDeveGerarUmaUnicaToken('mod', TIPO_MULOP);
    testarQuandoDeveGerarUmaUnicaToken('and', TIPO_MULOP);
});

describe('Reconhecimento de ADDOPs', () => {
    testarQuandoDeveGerarUmaUnicaToken('+', TIPO_ADDOP);
    testarQuandoDeveGerarUmaUnicaToken('-', TIPO_ADDOP);
    testarQuandoDeveGerarUmaUnicaToken('or', TIPO_ADDOP);
});

describe('Reconhecimento de Identificadores', () => {
    testarQuandoDeveGerarUmaUnicaToken('a', TIPO_IDENTIFICADOR);
    testarQuandoDeveGerarUmaUnicaToken('abc', TIPO_IDENTIFICADOR);
    testarQuandoDeveGerarUmaUnicaToken('ab12', TIPO_IDENTIFICADOR);
    testarQuandoDeveGerarUmaUnicaToken('AND', TIPO_IDENTIFICADOR);
});

describe('Reconhecimento de Constantes', () => {
    testarQuandoDeveGerarUmaUnicaToken('45', TIPO_CONSTANTE);
    testarQuandoDeveGerarUmaUnicaToken('+45', TIPO_CONSTANTE);
    testarQuandoDeveGerarUmaUnicaToken('-45', TIPO_CONSTANTE);
    testarQuandoDeveGerarUmaUnicaToken('45.3', TIPO_CONSTANTE);
    
    test('deve retornar CONSTANTE com lexema 45.35, DESCONHECIDO com lexema . e CONSTANTE com lexema 25', () => {
        const tokens = analisadorLexico.analisar('45.35.25');
    
        expect(tokens).toEqual([{
            lexema: '45.35',
            tipo: TIPO_CONSTANTE
        }, {
            ...TOKEN_DESCONHECIDA_LEXEMA_PONTO, 
        }, {
            lexema: '25',
            tipo: TIPO_CONSTANTE
        }]);
    });

    test('deve retornar DESCONHECIDO com lexema . e CONSTANTE com lexema 45', () => {
        const tokens = analisadorLexico.analisar('.45');
    
        expect(tokens).toEqual([{
            ...TOKEN_DESCONHECIDA_LEXEMA_PONTO
        }, {
            lexema: '45',
            tipo: TIPO_CONSTANTE
        }]);
    });

    test('deve retornar CONSTANTE com lexema 45 e DESCONHECIDO com lexema .', () => {
        const tokens = analisadorLexico.analisar('45.');
    
        expect(tokens).toEqual([{
            lexema: '45',
            tipo: TIPO_CONSTANTE
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
            tipo: TIPO_CONSTANTE
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
            tipo: TIPO_CONSTANTE
        }]);
    });

    test('deve retornar CONSTANTE com lexema 5, ADDOP com lexema - e CONSTANTE com lexema 45', () => {
        const tokens = analisadorLexico.analisar('5-45');
    
        expect(tokens).toEqual([{
            lexema: '5',
            tipo: TIPO_CONSTANTE
        }, {
            ...TOKEN_ADDOP_LEXEMA_SINAL_MENOS
        }, {
            lexema: '45',
            tipo: TIPO_CONSTANTE
        }]);
    });

    test('deve retornar IDENTIFICADOR com lexema a, ADDOP com lexema - e CONSTANTE com lexema 45', () => {
        const tokens = analisadorLexico.analisar('a-45');
    
        expect(tokens).toEqual([{
            lexema: 'a',
            tipo: TIPO_IDENTIFICADOR
        }, {
            ...TOKEN_ADDOP_LEXEMA_SINAL_MENOS
        }, {
            lexema: '45',
            tipo: TIPO_CONSTANTE
        }]);
    });

    test('deve retornar CONSTANTE com lexema 5, ADDOP com lexema - e CONSTANTE com lexema -5', () => {
        const tokens = analisadorLexico.analisar('5--5');
    
        expect(tokens).toEqual([{
            lexema: '5',
            tipo: TIPO_CONSTANTE
        }, {
            ...TOKEN_ADDOP_LEXEMA_SINAL_MENOS
        }, {
            lexema: '-5',
            tipo: TIPO_CONSTANTE
        }]);
    });

    test('deve retornar VIRGULA e CONSTANTE com lexema -45', () => {
        const tokens = analisadorLexico.analisar(',-45');
    
        expect(tokens).toEqual([{
            ...TOKEN_VIRGULA
        }, {
            lexema: '-45',
            tipo: TIPO_CONSTANTE
        }]);
    });

    test('deve retornar VIRGULA e CONSTANTE com lexema -45', () => {
        const tokens = analisadorLexico.analisar(',-45');
    
        expect(tokens).toEqual([{
            ...TOKEN_VIRGULA
        }, {
            lexema: '-45',
            tipo: TIPO_CONSTANTE
        }]);
    });

    test('deve retornar IDENTIFICADOR com lexema a, MULOP e CONSTANTE com lexema -45', () => {
        const tokens = analisadorLexico.analisar(`a ${TOKEN_MULOP.lexema} -45`);
    
        expect(tokens).toEqual([{
            lexema: 'a',
            tipo: TIPO_IDENTIFICADOR
        }, {
            ...TOKEN_MULOP
        }, {
            lexema: '-45',
            tipo: TIPO_CONSTANTE
        }]);
    });

    test('deve retornar IDENTIFICADOR com lexema a, RELOP e CONSTANTE com lexema -45', () => {
        const tokens = analisadorLexico.analisar(`a ${TOKEN_RELOP.lexema} -45`);
    
        expect(tokens).toEqual([{
            lexema: 'a',
            tipo: TIPO_IDENTIFICADOR
        }, {
            ...TOKEN_RELOP
        }, {
            lexema: '-45',
            tipo: TIPO_CONSTANTE
        }]);
    });
});