# Backend pre SkillSwap - aplikáciu na výmenu služieb 🛠️

Tento projekt predstavuje serverovú časť aplikácie, ktorá umožňuje študentom vymieňať rôzne služby (napr. doučovanie, jazykové kurzy a podobne). Backend je postavený na **Node.js**, používa **Express** ako webový framework a **PostgreSQL** databázu na uchovávanie údajov.

Aplikácia umožňuje študentom vytvárať, spravovať a vyhľadávať ponuky na výmenu služieb, ako je doučovanie matematiky za konverzáciu v angličtine. 🌍🎓

---

## Funkcie 🎯
- **CRUD Operácie**: Endpointy na vytváranie, čítanie, úpravu a vymazanie ponúk.
- **Validácia Dát**: Všetky vstupné údaje sú validované pomocou JSON Schema.
- **Čiastočné Aktualizácie**: Možnosť aktualizovať len vybrané polia bez nutnosti prepisovať celú ponuku.
- **Vyhľadávanie**: Filtrovanie ponúk na základe kritérií (napr. služby, lokalita).
- **PostgreSQL Databáza**: Spoľahlivé ukladanie údajov s jasne definovanou schémou.
- **Spracovanie Chýb**: Podrobné a zrozumiteľné chybové správy pre ľahšie ladenie.

---

## API Endpointy 📡

### 1. **Zoznam ponúk**
**GET** `/offers/list`  
- **Popis**: Vráti zoznam všetkých ponúk zoradených podľa dátumu vytvorenia.  
- **Odpoveď**: `200 OK`

---

### 2. **Vytvorenie ponuky**
**POST** `/offers/create`  
- **Popis**: Vytvorí novú ponuku.  
- **Povinné polia**: `name`, `surname`, `email`, `phone`, `offers`, `wants`, `location`.  
- **Odpoveď**: `201 Created`

---

### 3. **Načítanie konkrétnej ponuky**
**GET** `/offers/read`  
- **Popis**: Načíta konkrétnu ponuku podľa ID.  
- **Parameter**: `id` (ID ponuky).  
- **Odpoveď**: `200 OK` alebo `404 Not Found`

---

### 4. **Aktualizácia ponuky**
**PUT** `/offers/update`  
- **Popis**: Aktualizuje existujúcu ponuku.  
- **Parameter**: `id` (ID ponuky).  
- **Podporuje**: Čiastočné aktualizácie (možnosť zmeniť len vybrané polia).  
- **Odpoveď**: `200 OK` alebo `404 Not Found`

---

### 5. **Vymazanie ponuky**
**DELETE** `/offers/delete`  
- **Popis**: Vymaže ponuku podľa ID.  
- **Parameter**: `id` (ID ponuky).  
- **Odpoveď**: `200 OK` alebo `404 Not Found`

---

### 6. **Filtrovanie ponúk**
**GET** `/offers/search`  
- **Popis**: Filtrovanie ponúk podľa kritérií.  
- **Parametre**: `offers`, `wants`, `location`.  
- **Odpoveď**: `200 OK`

---

## Pravidlá Validácie 📝
- **Meno & Priezvisko**: 2–50 znakov, len písmená a medzery.
- **Email**: Platný email formát, max 100 znakov.
- **Telefón**: 9–15 číslic, môže začínať s `+`.
- **Ponúkam & Hľadám**: 5–200 znakov.
- **Lokalita**: 2–100 znakov, písmená, čísla, medzery a základná interpunkcia.

---

## Inštalácia 🚀

1. **Klonovanie repozitára**:
   ```bash
   git clone https://github.com/TomasIvan1/TWA_ivan.git
   ```

2. **Inštalácia závislostí**:
   ```bash
   cd TWA_ivan/server
   npm install
   ```

3. **Vytvorenie `.env` súboru**:
   V priečinku `server` vytvorte `.env` súbor a nastavte konfiguráciu PostgreSQL:
   ```env
   DB_USER=vase_meno
   DB_HOST=localhost
   DB_NAME=vasa_databaza
   DB_PASSWORD=vase_heslo
   DB_PORT=5432
   ```

4. **Spustenie servera**:
   ```bash
   node app.js
   ```

---

## Príklady Požiadaviek 💻

### 1. **Vytvorenie novej ponuky**
```json
POST /offers/create
{
  "name": "Ján",
  "surname": "Novák",
  "email": "novakj12@spse-po.sk",
  "phone": "+421123456789",
  "offers": "Doučovanie matematiky",
  "wants": "Konverzácia v angličtine",
  "location": "Bratislava"
}
```

---

### 2. **Aktualizácia vybraných polí**
```json
PUT /offers/update?id=id_ponuky
{
  "phone": "+421987654321",
  "location": "Košice"
}
```

---

## Spracovanie Chýb 🚨
API vracia príslušné HTTP stavové kódy a chybové správy vo formáte JSON:
```json
{
  "code": "typ_chyby",
  "message": "Zrozumiteľná chybová správa",
  "details": "Dodatočné detaily chyby (voliteľné)"
}
```

### Stavové kódy:
- `200 OK`: Úspech
- `201 Created`: Vytvorené
- `400 Bad Request`: Neplatná požiadavka
- `404 Not Found`: Nenájdené
- `500 Internal Server Error`: Interná chyba servera

---

## Kontakt ☎️
Ak niečo nie je jasné: **ivant@spse-po.sk**.
