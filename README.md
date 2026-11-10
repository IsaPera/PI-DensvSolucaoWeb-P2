# 🛒 Minhas Compras

Aplicação web desenvolvida para auxiliar na organização e controle doméstico, permitindo gerenciar o estoque da **Despensa**, planejar a **Lista de Compras** com checklist por categorias e registrar os itens **Comprados** com prazos de validade e durações estimadas.

---

## 🚀 Como Executar a Aplicação

Por ser uma aplicação baseada em tecnologias nativas (HTML5, CSS3 e JavaScript puro), **não é necessária instalação de dependências ou servidores complexos**.

### Opção 1: Diretamente pelo Navegador
1. Baixe ou clone este repositório no seu computador.
2. Navegue até a pasta raiz do projeto.
3. Dê um duplo clique no arquivo [`index.html`](index.html) para abri-lo diretamente em qualquer navegador moderno (Google Chrome, Microsoft Edge, Firefox, Safari).

### Opção 2: Via VS Code (Live Server)
1. Abra a pasta do projeto no **Visual Studio Code**.
2. Com a extensão **Live Server** instalada, clique com o botão direito no arquivo [`index.html`](index.html).
3. Selecione **"Open with Live Server"**.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5**: Estrutura semântica para Single Page Application (SPA), simulando uma experiência móvel fluida.
* **CSS3**: Estilização customizada, tema verde visualmente agradável, tipografia moderna e responsividade para dispositivos móveis (`@media`).
* **JavaScript (ES6+)**: Lógica da aplicação, manipulação do DOM e persistência de dados.
* **LocalStorage API**: Armazenamento local no navegador para manter os dados da despensa e da lista salvos.
* **Google Fonts**: Tipografia utilizando a fonte [*Itim*](https://fonts.google.com/specimen/Itim).

---

## 📂 Estrutura de Pastas e Arquivos

O projeto está estruturado de forma modular, dividindo as responsabilidades de armazenamento, regras de negócio e interface:

```text
/
├── css/
│   └── style.css          # Estilização global, temas, moldura responsiva e componentes.
├── js/
│   ├── storage.js         # Camada central de persistência e CRUD no LocalStorage.
│   ├── inicio.js          # Navegação entre telas (SPA) e controle do relógio em tempo real.
│   ├── despensa.js        # Controle de estoque, filtros (todos/estoque/finalizando/falta) e busca.
│   ├── lista.js           # Checklist por categorias, adição e fluxo de finalização de compras.
│   └── comprados.js       # Formulário de entrada para novos itens comprados e integração à despensa.
├── imagens/               # Ícones da interface e ilustrações dos produtos.
│   ├── cesta.png
│   ├── cesta.ico
│   ├── despensa.png
│   ├── lista.png
│   ├── comprados.png
│   └── ... (fotos dos produtos)
├── index.html             # Estrutura principal da SPA contendo todas as visualizações integradas.
└── README.md              # Documentação oficial do projeto.
```

---

## 👥 Divisão de Responsabilidades da Equipe

* **Integrante 1 (Início & Documentação):**
  * Estruturação da tela inicial com logo, slogan e cards de acesso rápido.
  * Barra de navegação inferior permanente (Bottom Bar).
  * Redirecionamentos e eventos em `js/inicio.js`.
  * Elaboração e manutenção do `README.md`.

* **Integrante 2 (Despensa & Filtros):**
  * Interface e busca dinâmica por texto ("Buscar produto...").
  * Botões de filtro de status (*Todos*, *Em estoque*, *Finalizando*, *Em falta*).
  * Lógica de cálculo de urgência e atualização de estoque em `js/despensa.js`.

* **Integrante 3 (Lista de Compras & Checklist):**
  * Organização dos produtos em categorias sanfonadas (*Alimentos*, *Higiene*, *Limpeza*).
  * Seleção de itens via checklist com persistência.
  * Ação de "Finalizar Compra" para encaminhar itens selecionados para a tela de Comprados em `js/lista.js`.

* **Integrante 4 (Comprados, Armazenamento & CSS):**
  * Camada central de persistência `js/storage.js` com funções limpas de CRUD.
  * Formulário de entrada de produtos (unidade, quantidade, validade, duração e data de compra) em `js/comprados.js`.
  * Estilização visual no padrão dos wireframes e layout responsivo em `css/style.css`.
