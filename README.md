# Story Telling - Leitor animado

MVP local para leitura animada de "O Nome do Vento" com:
- texto aparecendo progressivamente
- mudanca de background por cena
- destaque de fala de personagens
- narracao por TTS em nuvem

## Requisitos
- Node.js 20+ (recomendado)
- npm

## Setup
1. Instale dependencias:

```bash
npm install
```

2. Configure variaveis de ambiente:

```bash
cp .env.example .env.local
```

3. Defina `OPENAI_API_KEY` em `.env.local`.

4. Rode o projeto:

```bash
npm run dev
```

## Testes

```bash
npm run lint
npm run test
```

E2E (Playwright):

```bash
npm run test:e2e
```

## Estrutura relevante
- `src/content/o-nome-do-vento/scenes.json`: cenas e falas
- `src/components/reader/*`: UI de leitura animada
- `src/app/api/tts/route.ts`: integracao TTS
- `src/lib/story/*`: tipos, schema e engine de leitura
- `docs/llm/*`: contexto para desenvolvimento orientado por LLM

## Observacoes
- Os textos atuais sao seed data para desenvolvimento do fluxo.
- Adicione imagens em `public/assets/backgrounds` e `public/assets/characters`.

## Git + PR + CI/CD (passo a passo)

### 1) Inicializar e publicar repositorio Git

```bash
git init
git add .
git commit -m "chore: inicializa repositorio com CI e deploy"
git branch -M main
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```

### 2) Forcar fluxo somente por PR (GitHub)

No GitHub, configure:
1. `Settings` -> `Branches` -> `Add branch protection rule`
2. Branch name pattern: `main`
3. Habilite `Require a pull request before merging`
4. Habilite `Require status checks to pass before merging`
5. Marque os checks:
   - `Lint, Unit Tests and Build`
   - `E2E Tests (Playwright)`
6. Habilite `Require branches to be up to date before merging`
7. (Opcional, recomendado) habilite `Include administrators`
8. (Opcional, recomendado) desabilite bypass de regras para o time

Com isso, ninguem faz push direto na `main`: toda mudanca entra por PR com checks obrigatorios.

### 3) Configurar deploy automatico no Vercel

Workflows criados:
- `.github/workflows/ci.yml`: roda lint, testes unitarios, build e E2E em PR
- `.github/workflows/vercel-deploy.yml`: deploy de producao no push para `main`

Para habilitar o deploy:
1. No Vercel, importe o repositorio.
2. Em `Project Settings` -> `General`, copie `Project ID`.
3. Em `Account Settings` (ou Team) copie `Org ID`.
4. Gere um token em `Vercel` -> `Settings` -> `Tokens`.
5. No GitHub, em `Settings` -> `Secrets and variables` -> `Actions`, crie os secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
6. Faca merge de um PR na `main` para disparar deploy automatico de producao.

### 4) Fluxo recomendado do dia a dia

```bash
git checkout -b feat/minha-mudanca
# codar...
npm run lint
npm run test
npm run test:e2e
git add .
git commit -m "feat: descreve a mudanca"
git push -u origin feat/minha-mudanca
```

Depois:
1. Abrir PR para `main`
2. Aguardar checks do GitHub Actions
3. Mergear PR
4. GitHub Actions faz deploy automatico no Vercel
