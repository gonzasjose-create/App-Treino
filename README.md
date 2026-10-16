# Treino — acompanhamento de clientes

App para personal trainer planear, acompanhar e comunicar a progressão dos clientes
(força como núcleo, resistência como módulo opcional por cliente).

- **Funciona offline** e sem servidor: é uma app web instalável (PWA).
- **Os dados ficam só no dispositivo** (SQLite dentro do browser). Nada é enviado para a internet.
- Interface em português europeu, pensada para iPhone no ginásio.

---

## 1. Usar no portátil (Windows)

1. Faz duplo clique em **`iniciar.bat`**.
2. Abre-se o browser em `http://localhost:8080`. Mantém a janela preta aberta enquanto usas a app.
3. Para testar: **Clientes → Carregar 3 clientes de exemplo**.

Não é preciso instalar nada (usa o PowerShell do Windows).

> Os dados do portátil e os do iPhone são **independentes**. Para passar dados de um para o
> outro usa **Definições → Exportar backup** num e **Importar backup** no outro.

## 2. Publicar no GitHub Pages (para instalar no iPhone)

Só o **código** vai para o GitHub. Os dados dos clientes nunca saem do iPhone.

1. Cria uma conta em <https://github.com> (se ainda não tiveres).
2. **New repository** → nome, por exemplo, `treino` → *Public* → **Create repository**.
3. Na página do repositório: **Add file → Upload files** e arrasta **todo o conteúdo desta pasta**
   (`index.html`, `sw.js`, `manifest.webmanifest`, e as pastas `css`, `js`, `vendor`, `icons`).
   Não é preciso enviar `iniciar.bat`, `servidor.ps1` nem `.claude`. → **Commit changes**.
4. **Settings → Pages** → *Source*: **Deploy from a branch** → *Branch*: `main` / `(root)` → **Save**.
5. Ao fim de 1–2 minutos a app fica em `https://<o-teu-utilizador>.github.io/treino/`.

**Atualizar a app** (novas fases): repete o passo 3 com os ficheiros novos. O número `VERSAO`
em `sw.js` muda em cada versão, para o iPhone carregar a versão nova. Fecha e volta a abrir a app
duas vezes para a atualização entrar.

## 3. Instalar no iPhone

1. Abre o endereço do GitHub Pages no **Safari**.
2. Botão **Partilhar** → **Adicionar ao ecrã principal**.
3. Usa **sempre** a app a partir desse ícone. No iPhone, o Safari e a app instalada guardam
   dados em sítios diferentes.

## 4. Backup (importante)

- Os dados existem apenas no dispositivo. Se perderes o iPhone ou apagares o ícone da app, **perdes os dados**.
- **Definições → Exportar backup (.sqlite)** gera um único ficheiro com tudo. Guarda-o no portátil
  (AirDrop, cabo ou app Ficheiros).
- **Importar backup** substitui todos os dados do dispositivo (pede confirmação).
- Na Fase 7 o backup passa a ser encriptado com palavra-passe e a incluir as fotografias.

## 5. RGPD — resumo prático

- Dados de saúde, lesões e fotografias corporais são **categorias especiais** (art. 9.º): exigem
  **consentimento explícito**, idealmente escrito e assinado. A app regista data, forma e versão
  do texto, e **não deixa registar avaliações sem consentimento de dados de saúde**.
- Guarda os consentimentos assinados (papel ou PDF) fora da app.
- **Direito de acesso/portabilidade**: exportação por cliente (Fase 7).
- **Direito ao apagamento**: ficha do cliente → **Apagar cliente** remove todos os dados dele.
  Atenção: os backups antigos continuam a ter esses dados. Apaga-os ou deixa-os expirar.
- Usa código de bloqueio no iPhone (ativa a encriptação do dispositivo).
- Se guardares backups no iCloud ou noutra cloud, os dados passam a estar num serviço de terceiros.
  Prefere o portátil (e, na Fase 7, o backup encriptado).
- Define um prazo de conservação para os dados de ex-clientes (por exemplo, 2 anos após o fim do acompanhamento).

## 6. Fórmulas usadas

| Cálculo | Fórmula |
|---|---|
| 1RM estimado | **Epley**: carga × (1 + reps ÷ 30); reps = 1 → a própria carga; > 10 reps = baixa fiabilidade |
| Força relativa | 1RM estimado ÷ peso corporal (2 casas), só agachamento, RDL, supino e remada com carga |
| Assimetria | (lado forte − lado fraco) ÷ lado forte × 100; limiares editáveis (10% / 15%) |
| FC máxima | **Tanaka**: 208 − 0,7 × idade (estimada). Sugere atualizar se a FC pico observada for superior |
| Zonas de FC | Reserva de FC (Karvonen): FCrep + % × (FCmáx − FCrep); % editáveis |
| Recuperação | FC pico − FC 1 min após o teste |

Os valores calculados **não são guardados**: calculam-se sempre a partir dos dados brutos, para
serem sempre comparáveis. Comparações entre variantes diferentes de um teste são bloqueadas e assinaladas.

## 7. Estrutura do código

```
index.html            página única da app
sw.js                 service worker (offline)
manifest.webmanifest  instalação no ecrã principal
css/app.css           estilos; cores centralizadas em variáveis (:root)
vendor/               sql.js (SQLite em WebAssembly), copiado localmente
js/
  app.js              arranque, tema e router (#/rota)
  db.js               SQLite + gravação no IndexedDB, backup
  schema.js           tabelas (migrações sequenciais)
  repo.js             acesso a dados e regras (consentimentos, contraindicações, resultados)
  calc.js             fórmulas puras
  catalogos.js        testes, variantes e valores por defeito
  seed.js             biblioteca inicial de exercícios e clientes de exemplo
  util.js             formatação pt-PT, validação, escape de HTML
  views/              ecrãs (painel, clientes, ficha, avaliações, definições)
iniciar.bat / servidor.ps1   servidor local para o portátil
```

## 8. Estado das fases

- [x] **Fase 1**: estrutura de dados, ficha de cliente, consentimentos, baseline (força, potência,
  composição, perímetros, resistência), lesões e contraindicações, definições, backup simples.
- [ ] Fase 2: biblioteca de exercícios + planeamento de blocos
- [ ] Fase 3: registo de sessões + pacotes e pagamentos
- [ ] Fase 4: análise, highlights, gráficos + zonas e ritmos
- [ ] Fase 5: reavaliações + agenda + metas, streaks e check-in
- [ ] Fase 6: relatórios, resumo para WhatsApp, fotos, modo cliente + painel completo
- [ ] Fase 7: polimento, backup encriptado, exportação por cliente, PIN, documentação
