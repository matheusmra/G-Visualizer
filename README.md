# G-Visualizer

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![Cytoscape.js](https://img.shields.io/badge/Cytoscape.js-3-f79a25)
![License](https://img.shields.io/badge/license-MIT-green)

Uma ferramenta educacional interativa para visualizar algoritmos de grafos passo a passo.

> **Projeto em desenvolvimento ativo.** Contribuições são bem-vindas. Abra uma issue com sugestões ou bugs!

---

## Visão Geral

O G-Visualizer permite que estudantes **vejam cada passo de um algoritmo de grafos acontecendo** no canvas, com estruturas de dados e pseudocódigo sempre sincronizados.

A abordagem central é o **estado imutável por passo**: toda transição de estado é uma função pura, o que permite navegar para frente e para trás na execução como um depurador visual.

### Principais recursos

- Execução passo a passo com histórico navegável
- Estruturas de dados em tempo real (fila/pilha, visitados, ordem de visita)
- Pseudocódigo com linha ativa destacada
- Editor de grafos integrado
- Análise de conectividade: componentes conexos, pontes e pontos de articulação
- Representações matemáticas: Lista, Matriz de Adjacência e Matriz de Incidência
- Modo claro e escuro com persistência local

---

## Algoritmos Disponíveis

| Algoritmo | Arquivo | Complexidade |
|-----------|---------|--------------|
| Busca em Largura (BFS) | `src/algorithms/BFS.js` | O(V + E) |
| Busca em Profundidade (DFS) | `src/algorithms/DFS.js` | O(V + E) |
| Fecho Transitivo Direto (FTD) | `src/algorithms/FTC.js` | O(V + E) |
| Fecho Transitivo Indireto (FTI) | `src/algorithms/FTC.js` | O(V + E) |
| Conectividade (SCC / Pontes / APs) | `src/algorithms/connectivity.js` | O(V + E) |

→ [Documentação completa dos algoritmos](docs/algorithms.md)

---

## Início Rápido

**Pré-requisitos:** Node.js 18+ e npm 9+

```bash
git clone https://github.com/matheusmra/G-Visualizer.git
cd G-Visualizer
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

**Build para produção:**

```bash
npm run build
npm run preview
```

---

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [docs/algorithms.md](docs/algorithms.md) | Descrição detalhada de BFS, DFS, FTD, FTI e Conectividade; estrutura do estado |
| [docs/architecture.md](docs/architecture.md) | Estrutura do projeto, fluxo de execução, classes do canvas, rotas, sistema de temas |
| [docs/panels.md](docs/panels.md) | Os quatro painéis do visualizador: Estruturas, Pseudocódigo, Conectividade e Representações |
| [docs/contributing.md](docs/contributing.md) | Como adicionar algoritmos, presets e contribuir com o projeto |

---

## Stack

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19 | Interface e gerenciamento de estado |
| Vite | 5 | Build e servidor de desenvolvimento |
| TailwindCSS | 4 | Estilização |
| Cytoscape.js | 3 | Canvas e renderização do grafo |
| React Router | 7 | Roteamento entre páginas |

---

## Contato

- **Issues**: [GitHub Issues](https://github.com/matheusmra/G-Visualizer/issues)
- **GitHub**: [@matheusmra](https://github.com/matheusmra)

**Se este projeto foi útil, deixe uma estrela no repositório!**

---

*Feito por Matheus*