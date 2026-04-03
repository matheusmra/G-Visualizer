# Arquitetura

O G-Visualizer usa uma arquitetura baseada em **estado imutável por passo**. Toda transição é uma função pura, o que torna o histórico de execução trivialmente implementável.

---

## Estrutura do Projeto

```
src/
├── algorithms/
│   ├── BFS.js                # initBFS, stepBFS, buildAdjMap
│   ├── DFS.js                # initDFS, stepDFS
│   ├── FTC.js                # initFTD, stepFTD, initFTI, stepFTI
│   ├── connectivity.js       # findSCC, findConnectedComponents, findBridgesAndAPs
│   └── traversal.js          # re-export barrel (compatibilidade retroativa)
│
├── components/
│   ├── GraphCanvas.jsx               # Canvas Cytoscape.js
│   ├── ControlDeck.jsx               # Seletor de algoritmo e controles de execução
│   ├── DataPanel.jsx                 # Fila/Pilha, visitados, ordem de visita
│   ├── PseudocodePanel.jsx           # Pseudocódigo com linha ativa destacada
│   ├── ConnectivityPanel.jsx         # Análise de conectividade
│   ├── GraphRepresentationPanel.jsx  # Lista/Matriz de Adjacência/Incidência
│   ├── GraphBuilder.jsx              # Editor de grafos
│   └── ToastNotification.jsx         # Toasts contextuais
│
├── pages/
│   ├── HomePage.jsx       # Landing page
│   └── VisualizerPage.jsx # Visualizador principal
│
├── context/
│   └── ThemeContext.jsx   # Tema claro/escuro (localStorage)
│
└── data/
    └── presets.js         # 7 grafos pré-construídos
```

---

## Fluxo de Execução

```
Grafo (preset ou customizado)
        ↓
  Nó inicial selecionado
        ↓
  Estado inicial criado  (initBFS / initDFS / initFTD / initFTI)
        ↓
  ┌─────────────────────┐
  │   Passo executado   │  ←── usuário clica "Passo" ou "Play"
  │  stepBFS / stepDFS  │
  │  stepFTD / stepFTI  │
  └─────────────────────┘
        ↓
  Estado imutável salvo no histórico (Array de snapshots)
        ↓
  Canvas atualizado (Cytoscape.js classes)
  DataPanel re-renderizado
  PseudocodePanel realça linha ativa
  Toast emitido (se eventType relevante)
```

A navegação retroativa ("Voltar") funciona simplesmente restaurando o último snapshot do array `history`.

---

## Classes Visuais no Canvas (Cytoscape.js)

| Classe CSS   | Cor      | Significado               |
|--------------|----------|---------------------------|
| *(padrão)*   | Cinza    | Não visitado              |
| `.frontier`  | Âmbar    | Na fila/pilha (fronteira) |
| `.current`   | Violeta  | Sendo processado agora    |
| `.visited`   | Verde    | Já visitado               |
| `.comp-0..7` | Variadas | Componentes conexos       |
| `.ap`        | Laranja  | Ponto de articulação      |
| `.bridge`    | Vermelho | Aresta ponte              |

As classes de algoritmo (`.frontier`, `.current`, `.visited`) e de conectividade (`.comp-*`, `.ap`, `.bridge`) são aplicadas em efeitos React separados, garantindo que não interfiram entre si.

---

## Rotas

| Rota                    | Componente        | Descrição                            |
|-------------------------|-------------------|--------------------------------------|
| `/`                     | `HomePage`        | Landing page                         |
| `/visualizar/:algorithm`| `VisualizerPage`  | Visualizador (`BFS`, `DFS`, `FTD`, `FTI`) |
| `/visualizar`           | Redirect → `/visualizar/BFS` | |
| `*`                     | Redirect → `/`   |                                      |

O parâmetro `?preset=<key>` define o grafo inicial. `?preset=custom` ativa o editor.

---

## Sistema de Temas

`ThemeContext` gerencia o tema via `useState` com persistência em `localStorage('gv-theme')`. A classe `dark` é aplicada em `document.documentElement` e o TailwindCSS v4 usa `@custom-variant dark (&:where(.dark, .dark *))` para os seletores `dark:`.

---

← [Voltar ao README](../README.md)