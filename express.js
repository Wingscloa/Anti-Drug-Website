// Načítání konfigurace z .env souboru (např. pro přístupové klíče)
require('dotenv').config();

// Importování potřebných knihoven
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const express = require('express');
const path = require('path');

// Vytvoření instance aplikace Express
const app = express();
const port = 3000;  // Nastavení portu, na kterém bude aplikace běžet

// Vytvoření klienta pro připojení k Supabase (databáze)
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Asynchronní funkce pro získání dat z databáze (tabulky 'blogs')
async function fetchData() {
    const { data, error } = await supabase.from('blogs').select('*');
    if (error) {
        console.log(error);  // Pokud nastane chyba, vypíše ji do konzole
    }
    console.log('Fetched data : ' + data);  // Vypíše získaná data
}

// Definice cest k HTML souborům pro jednotlivé stránky
const routers = {
    '/': path.join(__dirname, 'src/pages/home/index.html'),
    '/signup': path.join(__dirname, 'src/pages/signup/index.html'),
    '/signin': path.join(__dirname, 'src/pages/signin/index.html'),
    '/blogs': path.join(__dirname, 'src/pages/blogs/index.html'),
    '/addblogs': path.join(__dirname, 'src/pages/addblog/index.html')
}

// Nastavení serveru tak, aby sloužil statické soubory z adresáře "public"
app.use(express.static(path.join(__dirname)));
app.use(express.json());  // Middleware pro parsování JSON požadavků

// Middleware pro ověřování uživatelů a přesměrování na domovskou stránku při chybě
const requireAuthWithRedirect = ClerkExpressRequireAuth({
    onError: (req, res) => {
        res.redirect('/');
    }
});

// Endpoint pro vytvoření nového blogu
app.post('/createblog', async (req, res) => {
    const { title, content, name } = req.body;
    try {
        const { data, error } = await supabase
            .from('blogs')
            .insert([{ title, content, name }])
            .select();

        if (error) {
            console.log("Create Blog Error: " + error.message);
            return res.status(500).send("Error creating blog");
        }

        res.send('Blog created successfully');  // Odpověď, pokud se blog úspěšně vytvoří
    } catch (error) {
        console.error("Unexpected Error: ", error);
        res.status(500).send("Unexpected error occurred");
    }
});

// Endpoint pro zobrazení stránky s blogy, pouze pro ověřené uživatele
app.get('/blogs', requireAuthWithRedirect, (req, res) => {
    res.sendFile(routers['/blogs']);
});

// Endpoint pro získání blogů z databáze
app.get('/getBlogs', async (req, res) => {
    const { start, end } = req.query;
    const { data } = await supabase.from('blogs').select('*');

    if (start && end) {
        console.log('Fetching blogs from ' + start + ' to ' + end);
        const { data } = await supabase.from('blogs').select('*').range(start, end - 1);
        return res.json(data);  // Vrátí vybraná data z databáze
    } else {
        console.log('Fetching all blogs');
    }

    return res.json(data);  // Vrátí všechna data z databáze
});

// Endpoint pro získání počtu blogů
app.get('/getBlogsCount', async (req, res) => {
    const { data, error } = await supabase.from('blogs').select('id_blog');
    if (error) {
        console.log(error);
    }
    return res.json(data.length);  // Vrátí počet blogů
});

// Chráněný endpoint, přístupný pouze pro ověřené uživatele
app.get('/protected-endpoint', requireAuthWithRedirect, (req, res) => {
    res.json({ message: 'You are authenticated!' });
});

// Záchytná cesta pro obsluhu všech ostatních požadavků, které nesplňují předchozí cesty
app.get('*', (req, res) => {
    console.log(process.env.CLERK_FRONTEND_API_KEY);
    if (req.path in routers) {  // Kontrola, zda požadovaná cesta existuje v definovaných cestách
        res.sendFile(routers[req.path]);
    } else {
        res.sendFile(path.join(__dirname, 'src/pages/error/index.html'));  // Pokud neexistuje, vrátí stránku s chybou
    }
});

// Spuštění serveru na definovaném portu
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
