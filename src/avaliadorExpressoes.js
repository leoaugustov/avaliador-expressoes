import {
    TOKEN_VIRGULA,
    TOKEN_ABERTURA_PARENTESES,
    TOKEN_FECHAMENTO_PARENTESES
} from './simbolosValidos';
import {
    TOKEN_RESTO_DIVISAO,
    TOKEN_DIVISAO_INTEIRA,
    TOKEN_E_LOGICO,
    TOKEN_OU_LOGICO,
    TOKEN_NEGACAO
} from './palavrasReservadas';
import { ARITMETICA, LOGICA, RELACIONAL } from './tiposOperacoes';
import operadores from './operadores';

export default function AvaliadorExpressoes() {
    function encontrarProximaSubexpressao(tokensExpressao) {
        if(tokensExpressao.length === 1) {
            return {
                tokens: [tokensExpressao[0]].flat(),
                indiceInicio: 0,
                indiceFinal: 0
            };
        }

        const proximoOperador = { precedencia: -1 };
        for(const [indice, token] of tokensExpressao.entries()) {
            if(Array.isArray(token)) {
                return {
                    tokens: token.flat(),
                    indiceInicio: indice,
                    indiceFinal: indice
                };
            }
            if(operadores.has(token.lexema)) {
                const operador = operadores.get(token.lexema);

                if(operador.precedencia > proximoOperador.precedencia) {
                    proximoOperador.indice = indice;
                    proximoOperador.precedencia = operador.precedencia;
                }
            }
        };

        const indiceFinal = proximoOperador.indice + 1;

        let indiceInicio = proximoOperador.indice -1;
        if(tokensExpressao[proximoOperador.indice].lexema === TOKEN_NEGACAO.lexema) {
            indiceInicio = proximoOperador.indice;
        }

        return {
            tokens: tokensExpressao.slice(indiceInicio, indiceFinal + 1),
            indiceInicio,
            indiceFinal
        };
    }

    function montarExpressaoParaCalculo(tokensExpressao) {
        const expressao = tokensExpressao
            .map(token => {
                if(token.valor !== undefined) {
                    return token.valor.toString();
                }else if(token.lexema === TOKEN_RESTO_DIVISAO.lexema) {
                    return '%';
                }else if(token.lexema === '=') {
                    return '===';
                }else if(token.lexema === '<>') {
                    return '!==';
                }else if(token.lexema === TOKEN_E_LOGICO.lexema) {
                    return '&&';
                }else if(token.lexema === TOKEN_OU_LOGICO.lexema) {
                    return '||';
                }else if(token.lexema === TOKEN_NEGACAO.lexema) {
                    return '!';
                }
                return token.lexema;
            }).join(' ');

            const operadorDivisaoInteira = ' ' +TOKEN_DIVISAO_INTEIRA.lexema + ' ';
            if(expressao.includes(operadorDivisaoInteira)) {
                const operandos = expressao.split(operadorDivisaoInteira);
                return `Math.floor(${operandos[0]} / ${operandos[1]})`;
            }
            return expressao;
    }

    function prepararTokensParaAvaliacao(tokensExpressao) {
        const tokensParaAvaliacao = [];

        let tokensSubExpressao = [];
        for(let token of tokensExpressao) {
            if(token.lexema === TOKEN_ABERTURA_PARENTESES.lexema) {
                tokensSubExpressao.forEach(token => tokensParaAvaliacao.push(token));
                tokensSubExpressao = [];
            }else if(token.lexema === TOKEN_FECHAMENTO_PARENTESES.lexema) {
                tokensParaAvaliacao.push(tokensSubExpressao);
                tokensSubExpressao = [];
            }else {
                tokensSubExpressao.push(token);
            }
        }
        tokensSubExpressao.forEach(token => tokensParaAvaliacao.push(token));

        return tokensParaAvaliacao;
    }

    function tiposSaoCompativeis(tokensExpressao) {
        if(tokensExpressao.length === 2) { // negação lógica (not)
            return typeof tokensExpressao[1].valor === 'boolean';
        }

        const operador = operadores.get(tokensExpressao[1].lexema);

        const ehOperacaoAritmeticaComNumeros = operador.tipoOperacao === ARITMETICA 
            && typeof tokensExpressao[0].valor === 'number' && typeof tokensExpressao[2].valor === 'number';

        const naoEhDivisaoPorZero = ! (['/', 'div'].includes(operador.lexema) && tokensExpressao[2].valor === 0);
        
        const ehOperacaoLogicaComBooleanos = operador.tipoOperacao === LOGICA 
            && typeof tokensExpressao[0].valor === 'boolean' && typeof tokensExpressao[2].valor === 'boolean';

        const ehOperacaoRelacionalComNumeros = operador.tipoOperacao === RELACIONAL 
            && typeof tokensExpressao[0].valor === 'number' && typeof tokensExpressao[2].valor === 'number';

        const ehOperacaoRelacionalComBooleanos = ['=', '<>'].includes(operador.lexema) 
            && typeof tokensExpressao[0].valor === 'boolean' && typeof tokensExpressao[2].valor === 'boolean';

        return (ehOperacaoAritmeticaComNumeros && naoEhDivisaoPorZero) || ehOperacaoLogicaComBooleanos 
            || ehOperacaoRelacionalComNumeros || ehOperacaoRelacionalComBooleanos;
    }

    function calcularValor(tokensExpressao) {
        const subexpressao = encontrarProximaSubexpressao(tokensExpressao);
        const quantidadeTokensSubexpressao = subexpressao.tokens.length;

        if(quantidadeTokensSubexpressao === 1) {
            return {
                valor: eval(subexpressao.tokens[0].lexema)
            };
        }else if(quantidadeTokensSubexpressao === 2 || quantidadeTokensSubexpressao === 3) {
            if(tiposSaoCompativeis(subexpressao.tokens)) {
                const valorCalculado = eval(montarExpressaoParaCalculo(subexpressao.tokens));
                tokensExpressao.splice(subexpressao.indiceInicio, subexpressao.indiceFinal + 1, {
                    lexema: valorCalculado.toString(),
                    valor: valorCalculado
                });
        
                return calcularValor(tokensExpressao);
            }

            return {
                erro: true,
                mensagem: "Tipos incompatíveis!"
            };
        }
        return calcularValor(subexpressao.tokens);
    }

    function avaliarExpressao(tokensExpressao) {
        const tokensParaCalculo = prepararTokensParaAvaliacao(tokensExpressao);
        const resultado = calcularValor(tokensParaCalculo);
        
        const expressao = tokensExpressao.map(token => token.lexema).join(' ')
        if(resultado.erro) {
            return {
                expressao,
                erroAvaliacao: resultado.erro,
                mensagem: resultado.mensagem
            }
        }
        return {
            expressao,
            resultado: resultado.valor
        }
    }

    this.avaliar = tokens => {
        const expressoes = [];

        let expressao = [];
        for(let token of tokens) {
            if(token.lexema === TOKEN_VIRGULA.lexema) {
                expressoes.push(expressao);
                expressao = [];
            }else {
                expressao.push(token);
            }
        }
        expressoes.push(expressao);
        return expressoes.map(avaliarExpressao);
    }
}