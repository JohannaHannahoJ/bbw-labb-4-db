# Laboration 4 – Databas (DT207G Backend-baserad webbutveckling)

**Genomförd av: joha2102**

## Projektbeskrivning

Detta projekt är del 1 av Laboration 4 i kursen *Backend-baserad webbutveckling*.

Syftet är att skapa en webbtjänst som hanterar användarregistrering och inloggning med autentisering via JWT.

Jag har valt att bygga en enkel digital dagbok där användare kan skapa och läsa sina egna inlägg bakom inloggning.

Del 2 av uppgiften är en frontend-applikation som finns här:  
**länk kommer**

## Installation

Initiera npm-projekt:
```
npm init -y
```

Installera paket:
```
npm install express cors dotenv jsonwebtoken bcrypt pg
```

Installera nodemon:
npm install nodemon --save-dev

Kör projektet:
```
npm run serve
```
## Databas
Databasen är skapad via Renders PostgreSQL-tjänst. 

Projektet har en `.env`-fil för känsliga uppgifter. Se `.env.sample` för aktuella variabler.

### Basrelationer
User (id (PK), Username, Password, Account_created)
Entries (id (PK), User_id (FK), Content, Created_at)
