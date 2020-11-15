import { 
    CONSTANTE,
    IDENTIFICADOR,
    MULOP,
    ADDOP,
    RELOP,
    NEGACAO,
    ABERTURA_PARENTESES,
    FECHAMENTO_PARENTESES,
    VIRGULA,
    DESCONHECIDO
} from '../src/tiposTokens';
import AnalisadorSintatico from '../src/analisadorSintatico';

function mockarAnalisadorLexico(tiposToken) {
    const encontrarProximaToken = jest.fn();
    tiposToken.forEach(tipoToken => {
        encontrarProximaToken.mockReturnValueOnce({ tipo: tipoToken });
    });

    return { encontrarProximaToken };
}

function criarAnalisadorSintatico(tiposToken) {
    const analisadorLexico = mockarAnalisadorLexico(tiposToken);
    return new AnalisadorSintatico(analisadorLexico);
}

function realizarTeste(sintaticamenteCorreto, ...tiposToken) {
    const analisadorSintatico = criarAnalisadorSintatico(tiposToken);
    const resultado = analisadorSintatico.analisar();
    
    expect(resultado.sintaticamenteCorreto).toBe(sintaticamenteCorreto);
    if(sintaticamenteCorreto) {
        expect(resultado.tokens.map(token => token.tipo)).toEqual(tiposToken);
    }
}

describe('Regra FACTOR', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando token é CONSTANTE', () => {
            realizarTeste(true, CONSTANTE);
        });
    
        test('quando token é IDENTIFICADOR', () => {
            realizarTeste(true, IDENTIFICADOR);
        });

        test('quando tokens são NEGACAO e IDENTIFICADOR', () => {
            realizarTeste(true, NEGACAO, IDENTIFICADOR);
        });

        test('quando tokens são NEGACAO, NEGACAO e IDENTIFICADOR', () => {
            realizarTeste(true, NEGACAO, NEGACAO, IDENTIFICADOR);
        });

        test('quando tokens são ABERTURA_PARENTESES, IDENTIFICADOR e FECHAMENTO_PARENTESES', () => {
            realizarTeste(true, ABERTURA_PARENTESES, IDENTIFICADOR, FECHAMENTO_PARENTESES);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando token é NEGACAO', () => {
            realizarTeste(false, NEGACAO);
        });
    
        test('quando tokenn são NEGACAO e NEGACAO', () => {
            realizarTeste(false, NEGACAO, NEGACAO);
        });

        test('quando token é ABERTURA_PARENTESES', () => {
            realizarTeste(false, ABERTURA_PARENTESES);
        });

        test('quando token é FECHAMENTO_PARENTESES', () => {
            realizarTeste(false, FECHAMENTO_PARENTESES);
        });
    });
});

describe('Regra TERM', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando tokens são IDENTIFICADOR, MULOP e CONSTANTE', () => {
            realizarTeste(true, IDENTIFICADOR, MULOP, CONSTANTE);
        });

        test('quando tokens são IDENTIFICADOR, MULOP, CONSTANTE, MULOP e IDENTIFICADOR', () => {
            realizarTeste(true, IDENTIFICADOR, MULOP, CONSTANTE, MULOP, IDENTIFICADOR);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando token é MULOP', () => {
            realizarTeste(false, MULOP);
        });

        test('quando tokens são MULOP e IDENTIFICADOR', () => {
            realizarTeste(false, MULOP, IDENTIFICADOR);
        });

        test('quando tokens são IDENTIFICADOR e MULOP', () => {
            realizarTeste(false, IDENTIFICADOR, MULOP);
        });

        test('quando tokens são IDENTIFICADOR, MULOP, MULOP e CONSTANTE', () => {
            realizarTeste(false, IDENTIFICADOR, MULOP, MULOP, CONSTANTE);
        });
    });
});

describe('Regra SIMPLE EXPRESSION', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando tokens são IDENTIFICADOR, ADDOP e CONSTANTE', () => {
            realizarTeste(true, IDENTIFICADOR, ADDOP, CONSTANTE);
        });

        test('quando tokens são IDENTIFICADOR, ADDOP, CONSTANTE, ADDOP e IDENTIFICADOR', () => {
            realizarTeste(true, IDENTIFICADOR, ADDOP, CONSTANTE, ADDOP, IDENTIFICADOR);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando token é ADDOP', () => {
            realizarTeste(false, ADDOP);
        });

        test('quando tokens são ADDOP e IDENTIFICADOR', () => {
            realizarTeste(false, ADDOP, IDENTIFICADOR);
        });

        test('quando tokens são IDENTIFICADOR e ADDOP', () => {
            realizarTeste(false, IDENTIFICADOR, ADDOP);
        });

        test('quando tokens são IDENTIFICADOR, ADDOP, ADDOP e CONSTANTE', () => {
            realizarTeste(false, IDENTIFICADOR, ADDOP, ADDOP, CONSTANTE);
        });
    });
});

describe('Regra EXPRESSION', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando tokens são IDENTIFICADOR, RELOP e CONSTANTE', () => {
            realizarTeste(true, IDENTIFICADOR, RELOP, CONSTANTE);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando token é RELOP', () => {
            realizarTeste(false, RELOP);
        });

        test('quando tokens são RELOP e IDENTIFICADOR', () => {
            realizarTeste(false, RELOP, IDENTIFICADOR);
        });

        test('quando tokens são IDENTIFICADOR e RELOP', () => {
            realizarTeste(false, IDENTIFICADOR, RELOP);
        });

        test('quando tokens são IDENTIFICADOR, RELOP, RELOP e CONSTANTE', () => {
            realizarTeste(false, IDENTIFICADOR, RELOP, RELOP, CONSTANTE);
        });
    });
});

describe('Regra EXPRESSION LIST', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando tokens são IDENTIFICADOR, VIRGULA e CONSTANTE', () => {
            realizarTeste(true, IDENTIFICADOR, VIRGULA, CONSTANTE);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando tokens são IDENTIFICADOR e CONSTANTE', () => {
            realizarTeste(false, IDENTIFICADOR, CONSTANTE);
        });

        test('quando token é VIRGULA', () => {
            realizarTeste(false, VIRGULA);
        });

        test('quando tokens são VIRGULA e IDENTIFICADOR', () => {
            realizarTeste(false, VIRGULA, IDENTIFICADOR);
        });

        test('quando tokens são  IDENTIFICADOR e VIRGULA', () => {
            realizarTeste(false, IDENTIFICADOR, VIRGULA);
        });
    });
});

describe('Com tokens desconhecidas', () => {
    test('quando token é DESCONHECIDO', () => {
        realizarTeste(false, DESCONHECIDO);
    });

    test('quando tokens são IDENTIFICADOR e DESCONHECIDO', () => {
        realizarTeste(false, IDENTIFICADOR, DESCONHECIDO);
    });

    test('quando tokens são IDENTIFICADOR, VIRGULA e DESCONHECIDO', () => {
        realizarTeste(false, IDENTIFICADOR, VIRGULA, DESCONHECIDO);
    });

    test('quando tokens são IDENTIFICADOR, VIRGULA, IDENTIFICADOR e DESCONHECIDO', () => {
        realizarTeste(false, IDENTIFICADOR, VIRGULA, IDENTIFICADOR, DESCONHECIDO);
    });

});