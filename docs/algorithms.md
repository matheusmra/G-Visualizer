# Algoritmos

O G-Visualizer implementa quatro algoritmos de grafos. Cada um vive em seu próprio arquivo em `src/algorithms/` e expõe funções puras `init*` e `step*`.

---

## Busca em Largura (BFS)

**Arquivo:** `src/algorithms/BFS.js`
**Exports:** `initBFS`, `stepBFS`, `buildAdjMap`

Explora o grafo nível por nível utilizando uma **fila**. Garante o menor caminho em grafos não-ponderados.

| Complexidade de Tempo | Complexidade de Espaço |
|-----------------------|------------------------|
| O(V + E)              | O(V)                   |

**Ideal para:** menor caminho, nível/distância, grafos não-ponderados.

### Como funciona

1. Enfileira o nó inicial e marca como na fronteira
2. A cada passo: desenfileira o nó atual, marca como visitado
3. Enfileira todos os vizinhos ainda não visitados e não na fronteira
4. Repete até a fila esvaziar

---

## Busca em Profundidade (DFS)

**Arquivo:** `src/algorithms/DFS.js`
**Exports:** `initDFS`, `stepDFS`

Mergulha o mais fundo possível antes de retroceder, utilizando uma **pilha** explícita.

| Complexidade de Tempo | Complexidade de Espaço |
|-----------------------|------------------------|
| O(V + E)              | O(V)                   |

**Ideal para:** detecção de ciclos, ordenação topológica, labirintos.

### Como funciona

1. Empilha o nó inicial e marca como na fronteira
2. A cada passo: desempilha o nó atual, marca como visitado
3. Empilha os vizinhos não visitados (em ordem reversa para manter ordem alfabética)
4. Repete até a pilha esvaziar

---

## Fecho Transitivo Direto (FTD)

**Arquivo:** `src/algorithms/FTC.js`
**Exports:** `initFTD`, `stepFTD`, `buildDirectedAdjMap`

Encontra todos os nós alcançáveis a partir de uma origem seguindo as **arestas de saída** do grafo dirigido. Internamente reutiliza `stepBFS` de `BFS.js`.

| Complexidade de Tempo | Complexidade de Espaço |
|-----------------------|------------------------|
| O(V + E)              | O(V)                   |

**Ideal para:** alcançabilidade, dependências, grafos dirigidos.

---

## Fecho Transitivo Indireto (FTI)

**Arquivo:** `src/algorithms/FTC.js`
**Exports:** `initFTI`, `stepFTI`, `buildReverseAdjMap`

Encontra todos os **predecessores** de uma origem executando BFS no grafo com as arestas invertidas.

| Complexidade de Tempo | Complexidade de Espaço |
|-----------------------|------------------------|
| O(V + E)              | O(V)                   |

**Ideal para:** predecessores, análise de impacto reverso, grafos dirigidos.

---

## Análise de Conectividade

**Arquivo:** `src/algorithms/connectivity.js`
**Exports:** `findSCC`, `findConnectedComponents`, `findBridgesAndAPs`, `COMPONENT_COLORS`

Não é um algoritmo de travessia interativa — é executado de forma estática sobre o grafo atual.

| Função                    | Algoritmo       | Grafo         |
|---------------------------|-----------------|---------------|
| `findSCC`                 | Kosaraju        | Dirigido      |
| `findConnectedComponents` | DFS simples     | Não-dirigido  |
| `findBridgesAndAPs`       | Tarjan          | Não-dirigido  |

### Estado do Algoritmo (campos comuns)

Cada `step*` retorna um novo objeto imutável com:

| Campo              | Tipo      | Descrição                                           |
|--------------------|-----------|-----------------------------------------------------|
| `queue` / `stack`  | `Array`   | Estrutura de dados principal                        |
| `visited`          | `Set`     | Nós já visitados                                    |
| `inFrontier`       | `Set`     | Nós na fronteira (fila/pilha)                       |
| `current`          | `string`  | Nó sendo processado no passo atual                  |
| `order`            | `Array`   | Sequência de visitas acumulada                      |
| `done`             | `boolean` | Se o algoritmo terminou                             |
| `pseudoLines`      | `Array`   | Índices das linhas ativas no pseudocódigo           |
| `eventType`        | `string`  | `step`, `step_skip`, `done`, `done_unreachable`     |
| `stepCount`        | `number`  | Contador incremental para efeitos reativos          |

---

← [Voltar ao README](../README.md)