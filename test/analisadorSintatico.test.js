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

function criarAnalisadorSintatico(...tiposToken) {
    const analisadorLexico = mockarAnalisadorLexico(tiposToken);
    return new AnalisadorSintatico(analisadorLexico);
}

describe('Regra FACTOR', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando token é CONSTANTE', () => {
            const analisadorSintatico = criarAnalisadorSintatico(CONSTANTE);
            expect(analisadorSintatico.analisar()).toBe(true);
        });
    
        test('quando token é IDENTIFICADOR', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR);
            expect(analisadorSintatico.analisar()).toBe(true);
        });

        test('quando tokens são NEGACAO e IDENTIFICADOR', () => {
            const analisadorSintatico = criarAnalisadorSintatico(NEGACAO, IDENTIFICADOR);
            expect(analisadorSintatico.analisar()).toBe(true);
        });

        test('quando tokens são NEGACAO, NEGACAO e IDENTIFICADOR', () => {
            const analisadorSintatico = criarAnalisadorSintatico(NEGACAO, IDENTIFICADOR);
            expect(analisadorSintatico.analisar()).toBe(true);
        });

        test('quando tokens são NEGACAO, NEGACAO e IDENTIFICADOR', () => {
            const analisadorSintatico = criarAnalisadorSintatico(NEGACAO, IDENTIFICADOR);
            expect(analisadorSintatico.analisar()).toBe(true);
        });

        test('quando tokens são ABERTURA_PARENTESES, IDENTIFICADOR e FECHAMENTO_PARENTESES', () => {
            const analisadorSintatico = criarAnalisadorSintatico(ABERTURA_PARENTESES, IDENTIFICADOR, FECHAMENTO_PARENTESES);
            expect(analisadorSintatico.analisar()).toBe(true);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando token é NEGACAO', () => {
            const analisadorSintatico = criarAnalisadorSintatico(NEGACAO);
            expect(analisadorSintatico.analisar()).toBe(false);
        });
    
        test('quando tokenn são NEGACAO e NEGACAO', () => {
            const analisadorSintatico = criarAnalisadorSintatico(NEGACAO, NEGACAO);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando token é ABERTURA_PARENTESES', () => {
            const analisadorSintatico = criarAnalisadorSintatico(ABERTURA_PARENTESES);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando token é FECHAMENTO_PARENTESES', () => {
            const analisadorSintatico = criarAnalisadorSintatico(FECHAMENTO_PARENTESES);
            expect(analisadorSintatico.analisar()).toBe(false);
        });
    });
});

describe('Regra TERM', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando tokens são IDENTIFICADOR, MULOP e CONSTANTE', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, MULOP, CONSTANTE);
            expect(analisadorSintatico.analisar()).toBe(true);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando token é MULOP', () => {
            const analisadorSintatico = criarAnalisadorSintatico(MULOP);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são MULOP e IDENTIFICADOR', () => {
            const analisadorSintatico = criarAnalisadorSintatico(MULOP, IDENTIFICADOR);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são IDENTIFICADOR e MULOP', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, MULOP);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são IDENTIFICADOR, MULOP, MULOP e CONSTANTE', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, MULOP, MULOP, CONSTANTE);
            expect(analisadorSintatico.analisar()).toBe(false);
        });
    });
});

describe('Regra SIMPLE EXPRESSION', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando tokens são IDENTIFICADOR, ADDOP e CONSTANTE', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, ADDOP, CONSTANTE);
            expect(analisadorSintatico.analisar()).toBe(true);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando token é ADDOP', () => {
            const analisadorSintatico = criarAnalisadorSintatico(ADDOP);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são ADDOP e IDENTIFICADOR', () => {
            const analisadorSintatico = criarAnalisadorSintatico(ADDOP, IDENTIFICADOR);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são IDENTIFICADOR e ADDOP', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, ADDOP);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são IDENTIFICADOR, ADDOP, ADDOP e CONSTANTE', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, ADDOP, ADDOP, CONSTANTE);
            expect(analisadorSintatico.analisar()).toBe(false);
        });
    });
});

describe('Regra EXPRESSION', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando tokens são IDENTIFICADOR, RELOP e CONSTANTE', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, RELOP, CONSTANTE);
            expect(analisadorSintatico.analisar()).toBe(true);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando token é RELOP', () => {
            const analisadorSintatico = criarAnalisadorSintatico(RELOP);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são RELOP e IDENTIFICADOR', () => {
            const analisadorSintatico = criarAnalisadorSintatico(RELOP, IDENTIFICADOR);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são IDENTIFICADOR e RELOP', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, RELOP);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são IDENTIFICADOR, RELOP, RELOP e CONSTANTE', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, RELOP, RELOP, CONSTANTE);
            expect(analisadorSintatico.analisar()).toBe(false);
        });
    });
});

describe('Regra EXPRESSION LIST', () => {
    describe('Deve estar sintaticamente correto', () => {
        test('quando tokens são IDENTIFICADOR, VIRGULA e CONSTANTE', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, VIRGULA, CONSTANTE);
            expect(analisadorSintatico.analisar()).toBe(true);
        });
    });

    describe('Deve estar sintaticamente incorreto', () => {
        test('quando tokens são IDENTIFICADOR e CONSTANTE', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, CONSTANTE);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando token é VIRGULA', () => {
            const analisadorSintatico = criarAnalisadorSintatico(VIRGULA);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são VIRGULA e IDENTIFICADOR', () => {
            const analisadorSintatico = criarAnalisadorSintatico(VIRGULA, IDENTIFICADOR);
            expect(analisadorSintatico.analisar()).toBe(false);
        });

        test('quando tokens são  IDENTIFICADOR e VIRGULA', () => {
            const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, VIRGULA);
            expect(analisadorSintatico.analisar()).toBe(false);
        });
    });
});

describe('Com tokens desconhecidas', () => {
    test('quando token é DESCONHECIDO', () => {
        const analisadorSintatico = criarAnalisadorSintatico(DESCONHECIDO);
        expect(analisadorSintatico.analisar()).toBe(false);
    });

    test('quando tokens são IDENTIFICADOR e DESCONHECIDO', () => {
        const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, DESCONHECIDO);
        expect(analisadorSintatico.analisar()).toBe(false);
    });

    test('quando tokens são IDENTIFICADOR, VIRGULA e DESCONHECIDO', () => {
        const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, VIRGULA, DESCONHECIDO);
        expect(analisadorSintatico.analisar()).toBe(false);
    });

    test('quando tokens são IDENTIFICADOR, VIRGULA, IDENTIFICADOR e DESCONHECIDO', () => {
        const analisadorSintatico = criarAnalisadorSintatico(IDENTIFICADOR, VIRGULA, IDENTIFICADOR, DESCONHECIDO);
        expect(analisadorSintatico.analisar()).toBe(false);
    });

});