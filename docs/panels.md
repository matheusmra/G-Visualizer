# Painéis do Visualizador

O visualizador possui quatro abas na barra lateral direita.

---

## Estruturas de Dados

Exibe o estado interno do algoritmo em tempo real:

- **Fila** (BFS / FTD / FTI) ou **Pilha** (DFS) com os nós atualmente enfileirados/empilhados
- **Visitados** — conjunto de nós processados
- **Ordem de Visita** — sequência completa acumulada de visitas

---

## Pseudocódigo

Pseudocódigo do algoritmo selecionado. A linha correspondente ao passo atual é destacada em índigo. Útil para correlacionar visualmente o que acontece no grafo com o código teórico.

---

## Conectividade (Aula 09)

Análise estática do grafo atual. Acione "Analisar" para calcular e destacar os resultados no canvas.

### Grafos Não-Dirigidos

| Análise               | Algoritmo | Resultado no Canvas                          |
|-----------------------|-----------|----------------------------------------------|
| Componentes Conexos   | DFS       | Cada componente recebe uma cor única         |
| Pontes                | Tarjan    | Arestas ponte ficam vermelhas                |
| Pontos de Articulação | Tarjan    | Nós articulação ganham borda laranja grossa  |

### Grafos Dirigidos

| Análise                     | Algoritmo | Resultado no Canvas                    |
|-----------------------------|-----------|----------------------------------------|
| Componentes Conexos (SCCs)  | Kosaraju  | Cada SCC recebe uma cor única          |

> Pontes e Pontos de Articulação são conceitos de grafos não-dirigidos e não são calculados para grafos dirigidos.

---

## Grafo - Representações Matemáticas (Aula 04)

Alterne entre três representações do grafo desenhado. Atualiza automaticamente conforme o grafo é editado.

### Lista de Adjacência

Cada nó lista seus vizinhos (não-dirigido) ou sucessores diretos (dirigido). Nós sem conexões exibem `∅`.

```
A — B, C
B — A, D
C — A
D — B
```

### Matriz de Adjacência

Matriz n×n onde o valor `1` indica que existe aresta da linha para a coluna. Em grafos não-dirigidos a matriz é simétrica.

```
  A B C D
A 0 1 1 0
B 1 0 0 1
C 1 0 0 0
D 0 1 0 0
```

### Matriz de Incidência

Matriz n×m (nós × arestas). Em grafos não-dirigidos cada célula é `1` se o nó é incidente à aresta. Em grafos dirigidos: `+1` para saída, `−1` para entrada.

```
   e0 e1 e2
A   1  1  0
B   1  0  1
C   0  1  0
D   0  0  1
```

---

← [Voltar ao README](../README.md)