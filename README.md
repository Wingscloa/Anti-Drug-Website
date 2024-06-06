# Odboj Drog

## Úvod
Odboj Drog je webová aplikace určená k správě a zobrazování blogových příspěvků souvisejících s uživateli drog, poskytující platformu pro sdílení informací a zdrojů. Pro autentizaci využívá Clerk a jako backendovou databázovou službu Supabase.

## Obsah
1. [Úvod](#úvod)
2. [Obsah](#obsah)
3. [Instalace](#instalace)
4. [Použití](#použití)
5. [Funkce](#funkce)
6. [Závislosti](#závislosti)
7. [Konfigurace](#konfigurace)
8. [Dokumentace](#dokumentace)
9. [Příklady](#příklady)
10. [Řešení problémů](#řešení-problémů)
11. [Přispěvatelé](#přispěvatelé)
12. [Licence](#licence)

## Instalace
Pro nastavení projektu lokálně postupujte podle těchto kroků:

1. Naklonujte repozitář:
    ```bash
    git clone <repository-url>
    cd Odboj_Drog
    ```

2. Nainstalujte závislosti:
    ```bash
    npm install
    ```

3. Vytvořte soubor `.env` v kořenovém adresáři a přidejte následující proměnné prostředí:
    ```env
    CLERK_SECRET_KEY=your_clerk_secret_key
    CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

## Použití
Pro spuštění aplikace zadejte:
```bash
node express.js
```
Aplikace bude dostupná na `http://localhost:3000`.

## Funkce
- Uživatelská autentizace pomocí Clerk
- Interakce s databází pomocí Supabase
- CRUD operace pro blogové příspěvky související s uživateli drog

## Závislosti
Projekt závisí na následujících balíčcích:
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [@clerk/clerk-sdk-node](https://www.npmjs.com/package/@clerk/clerk-sdk-node)
- [@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js)

## Konfigurace
Konfigurace je řízena pomocí proměnných prostředí. Ujistěte se, že soubor `.env` je správně nastaven s potřebnými API klíči a URL adresami.

## Dokumentace
Další dokumentace je dostupná v adresáři `docs`. Zahrnuje podrobné informace o API koncových bodech, schématu databáze a další.

## Příklady
Zde je základní příklad získávání dat ze Supabase:

```javascript
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function fetchData() {
  const { data, error } = await supabase.from('blogs').select('*');
  
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
}

fetchData();
```

## Řešení problémů
- **Proměnné prostředí**: Ujistěte se, že všechny proměnné prostředí jsou správně nastaveny v souboru `.env`.
- **Závislosti**: Ověřte, že všechny závislosti jsou nainstalovány pomocí `npm install`.
- **Problémy se serverem**: Zkontrolujte konzoli pro jakékoliv chybové zprávy při spuštění aplikace pomocí `node express.js`.

## Přispěvatelé
- [Filip Éder](https://github.com/Wingscloa)