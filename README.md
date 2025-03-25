# TwitterBooster

TwitterBooster è un'applicazione web che utilizza l'intelligenza artificiale per aiutare gli utenti a creare, automatizzare e ottimizzare i loro contenuti su Twitter.

## Caratteristiche principali

- 🤖 **Generazione di contenuti AI**: Crea tweet, thread e risposte utilizzando modelli AI avanzati
- 📊 **Analytics avanzate**: Monitora la crescita del tuo account e l'engagement dei tuoi contenuti
- ⚡ **Automazione**: Programma post, risposte automatiche e interazioni
- 🔍 **Analisi tendenze**: Scopri gli argomenti di tendenza nel tuo settore
- 🌐 **Integrazione Web3**: Connetti wallet e crea contenuti tokenizzati

## Tecnologie utilizzate

- 💻 **Frontend**: React, TypeScript, TailwindCSS, Framer Motion
- 🛠️ **Backend**: Express.js, Node.js
- 🧠 **AI**: Hugging Face API
- 🔄 **Integrazione**: Twitter API (X)
- 🛢️ **Database**: PostgreSQL (via Neon serverless)

## Requisiti di sistema

- Node.js 18 o superiore
- PostgreSQL 14 o superiore (opzionale se si usa Docker)
- Docker e Docker Compose (opzionale)

## Installazione

### Locale

1. Clona il repository:
   ```bash
   git clone https://github.com/tuouser/twitterbooster.git
   cd twitterbooster
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Configura le variabili d'ambiente:
   ```bash
   cp .env-config .env
   ```
   Modifica il file `.env` con le tue credenziali.

4. Avvia l'applicazione in modalità sviluppo:
   ```bash
   npm run dev
   ```

5. Compila e avvia in produzione:
   ```bash
   npm run build
   npm run start
   ```

### Docker

1. Clona il repository:
   ```bash
   git clone https://github.com/tuouser/twitterbooster.git
   cd twitterbooster
   ```

2. Avvia con Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Per fermare l'applicazione:
   ```bash
   docker-compose down
   ```

## Deploy in produzione

### Utilizzo degli script di deploy

L'applicazione include uno script di deploy per facilitare il processo:

- Su macOS/Linux:
  ```bash
  chmod +x deploy.sh
  ./deploy.sh
  ```

- Su Windows:
  ```bash
  npm run deploy:docker
  ```

### Deploy manuale

1. Compila il frontend e il backend:
   ```bash
   npm run build
   ```

2. Avvia il server di produzione:
   ```bash
   NODE_ENV=production npm run start
   ```

## Accesso all'applicazione

- **URL**: http://localhost:5000
- **Credenziali di default**:
  - Username: admin
  - Password: twitterbooster

## Configurazione Twitter API

Per utilizzare le funzionalità di integrazione con Twitter, è necessario configurare le API di Twitter:

1. Crea un'applicazione su [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Ottieni le chiavi API e i token
3. Aggiungile al file `.env`

## Supporto

Per supporto, contattare [supporto@twitterbooster.com](mailto:supporto@twitterbooster.com) 