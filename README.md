# Avaliador de Expressões [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/leoaugustov/avaliador-expressoes/blob/master/LICENSE) [![Build Status](https://travis-ci.org/leoaugustov/avaliador-expressoes.svg?branch=master)](https://travis-ci.org/leoaugustov/avaliador-expressoes)

Um avaliador de expressões construído com Javascript durante a disciplina de Compiladores no curso de Engenharia de Computação.

## Convenções Léxicas
 - `not`: NÃO lógico;
 - `div`: divisão inteira;
 - `mod`: resto;
 - `<>`: desigualdade;
 - `=`: igualdade;
 - um operando pode ser apenas um número ou um identificador;
 - um identificador é formado por letras e dígitos. Deve começar com letra;
 - um identificador por assumir apenas valores booleano ou numérico.

## Precedência de Operadores
| Precedência | Associatividade | Operador |
|--|--|--|
| 6 | n/a | `( ... )` |
| 5 | direita para esquerda | `not` |
| 4 | esquerda para direita | `*`, `/`, `mod`, `div` |
| 3 | esquerda para direita | `+`, `-` |
| 2 | esquerda para direita | `>`, `<`, `>=`, `<=`, `=`, `<>` |
| 1 | esquerda para direita | `and` |
| 0 | esquerda para direita | `or` |

## Para instalar e rodar o projeto na sua máquina
### Clone o repositório
    $ git clone https://github.com/leoaugustov/avaliador-expressoes.git
    $ cd avaliador-expressoes

### Instale as dependências
    $ npm install

### Rode o projeto
    $ npm start

Em seu navegador acesse http://localhost:9000

## Construído com
- [Vue.js](https://br.vuejs.org/index.html)
- [Babel](https://babeljs.io/)
- [Webpack](https://webpack.js.org/)
- [Jest](https://jestjs.io/)
- [Travis CI](https://travis-ci.com/)