let page = 1;  // Nastavení počáteční stránky na 1

// Funkce pro získání celkového počtu blogů
async function getCount() {
    try {
        const response = await fetch('/getBlogscount');  // Požadavek na server pro získání počtu blogů
        return await response.json();  // Vrátí počet blogů
    } catch (error) {
        console.log(error);  // Vypíše chybu do konzole, pokud nějaká nastane
    }
}

// Funkce pro získání blogů v daném rozsahu
async function fetchBlogsRange(start, end) {
    try {
        const response = await fetch(`/getBlogs?start=${start}&end=${end}`);  // Požadavek na server pro získání blogů v rozsahu
        const data = await response.json();  // Získaná data
        return data;  // Vrátí získaná data
    } catch (error) {
        console.log(error);  // Vypíše chybu do konzole, pokud nějaká nastane
    }
}

// Funkce pro získání blogů podle aktuální stránky
async function fetchBlogsByPage(page, pageSize) {
    const start = (page - 1) * pageSize;  // Výpočet začátku rozsahu
    const end = start + pageSize - 1;  // Výpočet konce rozsahu
    return await fetchBlogsRange(start, end);  // Vrátí blogy v daném rozsahu
}

// Funkce pro načtení další stránky blogů
async function NextPage() {
    if (page >= await getCount() / 5) {  // Kontrola, zda je aktuální stránka poslední
        page = Math.ceil(await getCount() / 5);  // Nastavení na poslední stránku
        generateBlogs(page);  // Generování blogů pro aktuální stránku
        return;
    }
    page++;  // Zvýšení čísla stránky
    generateBlogs(page);  // Generování blogů pro aktuální stránku
}

// Funkce pro načtení předchozí stránky blogů
function PreviousPage() {
    if (page <= 1) {  // Kontrola, zda je aktuální stránka první
        page = 1;  // Nastavení na první stránku
        generateBlogs(1);  // Generování blogů pro první stránku
        return;
    }
    page--;  // Snížení čísla stránky
    generateBlogs(page);  // Generování blogů pro aktuální stránku
}

// Funkce pro generování blogů na stránce
async function generateBlogs(page, countOnRow = 3, countOnPage = 5) {
    const blogy = document.getElementById('blogs');
    blogy.innerHTML = '';  // Vyprázdnění obsahu blogů
    blogy.innerHTML += `<div class="row" id="row"></div>`;  // Přidání nového řádku pro blogy
    let data = await fetchBlogsByPage(page, countOnPage);  // Získání blogů pro aktuální stránku
    let blogs = document.getElementById('row');
    let modals = document.getElementById('modals');
    blogs.innerHTML = '';  // Vyprázdnění blogů
    modals.innerHTML = '';  // Vyprázdnění modálních oken

    // Generování blogů a modálních oken
    for (let i = 0; i < data.length; i++) {
        let user = data[i]['user'];  // Uživatelské jméno
        let content = data[i]['content'];  // Obsah blogu
        let created_at = data[i]['created_at'];  // Datum vytvoření
        let id_blog = data[i]['id_blog'];  // ID blogu
        let title = data[i]['title'];  // Název blogu
        let modalTarget = `blogModal${id_blog}`;  // ID modálního okna

        if (i % countOnRow == 0) {  // Přidání nového řádku po každých 3 blogech
            blogy.innerHTML += `<div class="row" id="row${i}"></div>`;
            blogs = document.getElementById(`row${i}`);
        }

        blogs.innerHTML += 
        `
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-body">
                        <h1>${user}</h1>
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${content.substring(0, 50)}</p>
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#${modalTarget}" style="margin-bottom: 20px">Číst víc</button>
                        <div class="card-footer text-muted">
                            ${created_at}
                        </div>
                    </div>
                </div>
            </div>`;
        
        modals.innerHTML += 
        `<div class="modal fade" id="${modalTarget}" tabindex="-1" role="dialog" aria-labelledby="blogModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="blogModalLabel">${title} ${user}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>${content}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Zavřít</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    console.log(data);  // Vypíše získaná data do konzole
}

// Funkce pro přidání nového blogu
async function addblog() {
    await Clerk.load();  // Načtení služby Clerk (ověřování uživatelů)
    alert("i am here");
    console.log("name : " + Clerk.user.username);
    const name = Clerk.user.username;  // Uživatelské jméno
    const title = document.getElementById('title').value;  // Název blogu
    const content = document.getElementById('content').value;  // Obsah blogu

    const response = await fetch('/createblog', {
        method: 'POST',  // Metoda POST pro vytvoření nového blogu
        headers: {
            'Content-Type': 'application/json'  // Nastavení hlaviček požadavku
        },
        body: JSON.stringify({ title, content, name })  // Data odeslaná v těle požadavku
    });

    if (response.ok) {
        console.log("Blog created successfully");  // Vypíše úspěch do konzole
    } else {
        console.log("Error creating blog");  // Vypíše chybu do konzole, pokud nastane
    }
}
