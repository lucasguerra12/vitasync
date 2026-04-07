# 🧠 VitaSync

> Aplicativo mobile inteligente de saúde e bem-estar que integra nutrição, fitness, saúde mental e interação social em uma única plataforma.

---

## 📌 Visão Geral

O **VitaSync** é um aplicativo mobile desenvolvido com foco em **monitoramento completo da saúde do usuário**, combinando dados de múltiplas fontes para gerar **insights personalizados e correlações inteligentes**.

Diferente de apps tradicionais, o VitaSync não apenas registra dados — ele **relaciona informações como alimentação, sono, humor, clima e atividade física** para oferecer uma visão holística da saúde.

---

## 🚀 Principais Diferenciais

- 📊 Score de saúde diário (0–100)
- 🧠 Motor de correlação inteligente entre dados
- 📷 Reconhecimento alimentar com câmera + base offline (TACO)
- ❤️ Medição de frequência cardíaca via câmera
- 🛰️ Uso de sensores reais (GPS, acelerômetro, luz, biometria)
- 📡 Arquitetura offline-first
- 👥 Sistema social com grupos e desafios
- 📄 Exportação de dados em PDF e CSV

---

## 🧩 Módulos do Sistema

### 🏠 Home (Dashboard)
- Score diário de saúde
- Resumo geral (calorias, passos, água, sono, etc.)
- Mensagens motivacionais

### 🥗 NutriLens (Nutrição)
- Diário alimentar com foto ou busca manual
- Base de dados TACO offline
- Controle de calorias (Harris-Benedict)
- Micronutrientes (20 nutrientes)
- Controle de água
- IMC + histórico
- Sugestão de receitas

### 💪 FitTrack (Fitness)
- Contador de passos (acelerômetro)
- Rastreamento de corrida (GPS)
- Frequência cardíaca via câmera
- Histórico de treinos
- Exercícios guiados
- Mapa de parques próximos
- Compartilhamento de conquistas

### 🧘 MindZen (Saúde Mental)
- Diário de humor
- Registro de sono
- Meditação guiada
- PainMap (mapa de dor corporal)
- Correlação entre dados
- Alarmes de medicamentos
- Relatórios completos de saúde

### 👥 HealthPact (Social)
- Grupos de accountability
- Check-in diário
- Feed social
- Desafios semanais
- Sistema de badges

---

## 📱 Sensores Utilizados

| Sensor        | Uso |
|--------------|-----|
| Acelerômetro | Contagem de passos |
| GPS          | Corridas + clima + localização |
| Câmera       | Alimentação + batimentos |
| Flash        | Medição cardíaca |
| Biometria    | Login e segurança |
| Sensor de luz| Modo escuro automático |

---

## 🏗️ Arquitetura

O projeto segue princípios de Clean Architecture, dividido em:

```
📦 src
 ┣ 📂 presentation   → UI / telas
 ┣ 📂 application    → regras de negócio
 ┣ 📂 domain         → entidades
 ┗ 📂 infrastructure → banco, APIs, sensores
```

### Padrões utilizados:
- Repository Pattern
- Strategy Pattern
- Observer (sensores)
- Factory (relatórios)

---

## ⚙️ Stack Tecnológica

### 📱 Mobile

- React Native + TypeScript
- Expo (EAS Build)
- Redux Toolkit + RTK Query
- React Navigation
- WatermelonDB (offline-first)
- Victory Native (gráficos)

### 🌐 Backend

- Node.js + Fastify
- PostgreSQL
- Prisma ORM
- Supabase Auth
- Redis (Upstash)

### 🔌 APIs externas

- OpenWeatherMap (clima)
- Google Places (mapas)
- Google Fit (integração)
- OpenAI (insights inteligentes)

---

## 🔄 Fluxo Inteligente de Dados

O diferencial do VitaSync está aqui:

```
Alimentação → Energia
Sono → Humor
Exercício → Performance
Clima → Dor
↓
📊 Motor de Correlação
↓
🧠 Insights personalizados
```

---

## 📊 Score de Saúde

O score diário é calculado com base em:

- Nutrição: 35%
- Sono: 25%
- Movimento: 20%
- Hidratação: 10%
- Humor: 10%

---

## 📴 Offline First

O app funciona mesmo sem internet:

- Dados armazenados localmente (WatermelonDB)
- Sincronização posterior com backend
- Base nutricional offline (TACO)

---

## 🔒 Segurança

- Autenticação via Supabase (JWT)
- Biometria para acesso
- Dados sensíveis protegidos
- Nenhuma imagem armazenada (ex: batimentos)

---

## 🧪 Testes

- Jest (unitários)
- Detox (integração)
- Cobertura mínima: 70%

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js
- Expo CLI
- Android Studio (ou dispositivo físico)

### Instalação

```bash
git clone https://github.com/lucasguerra12/vitasync
cd vitasync
npm install
```

### Rodar o app

```bash
npx expo start
```

### Build APK

```bash
npx expo run:android
```

---

## 🔑 Variáveis de Ambiente

Crie um `.env`:

```env
API_URL=
SUPABASE_URL=
SUPABASE_KEY=
OPENAI_KEY=
WEATHER_API_KEY=
```

---

## 📦 Estrutura do Projeto

```
src/
 ├── components/
 ├── screens/
 ├── store/
 ├── services/
 ├── database/
 ├── hooks/
 └── utils/
```

---

## 🗺️ Roadmap

- [x] Estrutura base
- [x] Nutrição offline
- [x] Fitness com sensores
- [x] Saúde mental
- [ ] IA avançada de insights
- [ ] Deploy completo
- [ ] Versão iOS

---

## 📄 Licença

Projeto acadêmico — uso educacional.

---

## 👨‍💻 Autor

Lucas Fernando Guerra

---

## 💡 Considerações Finais

O VitaSync representa uma abordagem moderna de aplicativos de saúde:

- Integração total de dados
- Uso inteligente de sensores
- Experiência centrada no usuário
- Capacidade de gerar valor real através de insights
