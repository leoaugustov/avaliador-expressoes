import Vue from 'vue';
import AnalisadorLexico from './analisadorLexico';
import AnalisadorSintatico from './analisadorSintatico';
import AvaliadorExpressoes from './avaliadorExpressoes';
import { CONSTANTE, IDENTIFICADOR } from './tiposTokens';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowCircleLeft, faArrowCircleRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowCircleLeft, faArrowCircleRight, faCheckCircle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

const IDENTIFICADOR_TIPO_NUMERICO = "NUMERICO";
const formatadorNumero = new Intl.NumberFormat('pt-BR', { useGrouping: false });
const estadoGlobal = {};

function formatarValor(valor) {
    if(typeof valor === 'boolean') {
        if(valor) {
            return "verdadeiro";
        }else {
            return "falso";
        }
    }
    return formatadorNumero.format(valor);
}

function criarRelacaoIdentificadorValor(identificadores) {
    const conjuntoChaveValor = identificadores
        .map(({ lexema, valor }) => {
            if(typeof valor === 'string') {
                return [lexema, Boolean(valor)];
            }
            return [lexema, valor];
        });
    return new Map(conjuntoChaveValor);
}

function filtrarIdentificadoresDistintos(tokens) {
    return tokens
        .filter(token => token.tipo === IDENTIFICADOR)
        .map(token => token.lexema)
        .filter((lexema, indice, lexemas) => lexemas.indexOf(lexema) === indice);
}

function avaliarExpressoes(tokens, relacaoIdentificadorValor) {
    const tokensParaAvaliacao = tokens.map(token => {
        if(token.tipo === IDENTIFICADOR) {
            return {
                ...token,
                valor: relacaoIdentificadorValor.get(token.lexema)
            };
        }else if(token.tipo === CONSTANTE) {
            return {
                ...token,
                valor: parseFloat(token.lexema)
            }
        }
        return token;
    });
    return new AvaliadorExpressoes().avaliar(tokensParaAvaliacao)
        .map(avaliacao => ({
            ...avaliacao,
            resultado: formatarValor(avaliacao.resultado)
        }));
}

const app = new Vue({
    el: '#app',
    data: {
        entrada: "",
        realizouAnaliseSintatica: false,
        sintaticamenteCorreto: false,
        identificadores: [],
        indiceIdentificador: 0,
        tipoIdentificador: IDENTIFICADOR_TIPO_NUMERICO,
        avaliacoes: []
    },
    computed: {
        tipoIdentificadorEhNumerico() {
            return this.tipoIdentificador === IDENTIFICADOR_TIPO_NUMERICO;
        },
        mensagemProgresso() {
            return `${this.indiceIdentificador + 1}º identificador de ${this.identificadores.length}`;
        },
        ehPrimeiroIdentificador() {
            return this.indiceIdentificador === 0;
        },
        ehUltimoIdentificador() {
            return this.indiceIdentificador === this.identificadores.length - 1;
        },
        deveMostrarConfiguracaoIdentificadores() {
            return this.sintaticamenteCorreto && this.identificadores.length > 0 && this.avaliacoes.length === 0;
        },
        deveMostrarExpressoesAvaliadas() {
            return this.sintaticamenteCorreto && this.avaliacoes.length > 0;
        }
    },
    watch: {
        tipoIdentificadorEhNumerico: function(ehNumerico) {
            if(ehNumerico) {
                this.identificadores[this.indiceIdentificador].valor = undefined;
            }else {
                this.identificadores[this.indiceIdentificador].valor = true;
            }
        }
    },
    methods: {
        analisar() {
            const analisadorSintatico = new AnalisadorSintatico(new AnalisadorLexico(this.entrada));
            const { sintaticamenteCorreto, tokens } = analisadorSintatico.analisar();
            this.realizouAnaliseSintatica = true;
            this.sintaticamenteCorreto = sintaticamenteCorreto;

            if(sintaticamenteCorreto) {
                this.identificadores = filtrarIdentificadoresDistintos(tokens)
                    .map(lexema => ({
                        lexema,
                        valor: undefined
                    }));

                if(this.identificadores.length > 0) {
                    this.tipoIdentificador = IDENTIFICADOR_TIPO_NUMERICO;
                    this.indiceIdentificador = 0;
                    this.avaliacoes = [];
                    estadoGlobal.tokens = tokens;
                }else {
                    const relacaoIdentificadorValor = criarRelacaoIdentificadorValor(this.identificadores);
                    this.avaliacoes = avaliarExpressoes(tokens, relacaoIdentificadorValor);
                }
            }
        },
        voltarIdentificadorAnterior() {
            this.indiceIdentificador--;
        },
        proximoIdentificador() {
            if(this.ehUltimoIdentificador) {
                const relacaoIdentificadorValor = criarRelacaoIdentificadorValor(this.identificadores);
                this.avaliacoes = avaliarExpressoes(estadoGlobal.tokens, relacaoIdentificadorValor);

                this.identificadores = this.identificadores.map(({lexema, valor}) => ({
                    lexema,
                    valor: formatarValor(valor)
                }));
            }else {
                this.indiceIdentificador++;
                this.tipoIdentificador = IDENTIFICADOR_TIPO_NUMERICO;
            }
        }
    }
});