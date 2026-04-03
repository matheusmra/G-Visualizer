# Contribuindo

Contribuições são bem-vindas! Seja corrigindo um bug, adicionando um algoritmo ou melhorando a interface.

---

## Configuração do Ambiente

```bash
git clone https://github.com/matheusmra/G-Visualizer.git
cd G-Visualizer
npm install
npm run dev
```

---

## Como Adicionar um Novo Algoritmo

1. Crie um arquivo em `src/algorithms/MeuAlgo.js`
2. Exporte as funções `initMeuAlgo(startNode)` e `stepMeuAlgo(state, adjMap)`
3. O estado retornado deve seguir a estrutura padrão (ver [docs/algorithms.md](algorithms.md#estado-do-algoritmo-campos-comuns))
4. Adicione a entrada em `ControlDeck.jsx` (array `TRAVERSAL_ALGOS` ou `CLOSURE_ALGOS`)
5. Registre o `init*` e `step*` em `VisualizerPage.jsx` nos switches `handleStart` e `advanceOne`
6. Adicione o pseudocódigo em `PseudocodePanel.jsx`

---

## Como Adicionar um Novo Preset

Edite `src/data/presets.js` e adicione uma nova entrada no objeto `PRESETS`:

```js
meuGrafo: {
  name: 'Nome do Grafo',
  description: 'Descrição breve.',
  directed: false, // ou true
  elements: {
    nodes: [
      { data: { id: 'A', label: 'A' } },
      // ...
    ],
    edges: [
      { data: { source: 'A', target: 'B' } },
      // ...
    ],
  },
  layout: { name: 'cose' }, // qualquer layout do Cytoscape.js
},
```

O preset aparecerá automaticamente na biblioteca da homepage e no visualizador.

---

## Estrutura de Commits

Use mensagens de commit claras:

```
feat: adicionando algoritmo de Dijkstra
fix: corrigi ordenação dos vizinhos no DFS
docs: atualizando README com novos painéis
style: troquei a cor de um botão
```

---

## Issues e Pull Requests

- Abra uma [issue](https://github.com/matheusmra/G-Visualizer/issues) para reportar bugs ou propor funcionalidades
- Fork o repositório, crie uma branch descritiva e abra um Pull Request

---

← [Voltar ao README](../README.md)