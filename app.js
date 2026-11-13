// 1. SELECTOARE (Prindem elementele din HTML)
const form = document.querySelector('#add-task-form');
const inputNode = document.querySelector('#task-name');
const submitBtn = document.querySelector('#submit-task-btn');
const errorMsg = document.querySelector('#error-msg');
const taskList = document.querySelector('#task-list');
const spinner = document.querySelector('#loading-spinner');

// API-ul nostru public pentru testare
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// 2. FUNCȚIE REUTILIZABILĂ: Desenarea unui rând HTML în pagină
const deseneazaTaskInDOM = (id, titlu) => {
    // Creăm un element <li> în memorie
    const li = document.createElement('li');
    li.className = 'task-item';

    // Injectăm HTML-ul intern (inclusiv atributele de testare pentru Playwright!)
    li.innerHTML = `
        <span class="task-title">${titlu}</span><button class="btn-delete" data-testid="delete-btn-${id}">Șterge</button>
    `;

    // Îl lipim fizic în lista <ul> de pe ecran
    taskList.appendChild(li);
};
// 3. GET: Aducerea datelor inițiale de la Server
const incarcaDateServer = async () => {
    try {
        // Cerem primele 5 task-uri de la API (Așteptăm "Chelnerul")
        const response = await fetch(`${API_URL}?_limit=5`);

        if (!response.ok) throw new Error("A picat serverul!");

        // Despachetăm datele JSON
        const data = await response.json();

        // Odată ce avem datele, ascundem spinner-ul
        spinner.style.display = 'none';

        // Parcurgem lista și desenăm fiecare task
        data.forEach(task => {
            deseneazaTaskInDOM(task.id, task.title);
        });

    } catch (error) {
        spinner.textContent = "Eroare la aducerea datelor!";
        spinner.style.backgroundColor = "#f8d7da";
        spinner.style.color = "#721c24";
        console.error(error);
    }
};

// Pornim funcția imediat ce scriptul se execută
incarcaDateServer();
// 4. POST: Adăugarea unui task nou pe rețea
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Foarte important: Oprește refresh-ul paginii!

    const taskTitle = inputNode.value.trim();

    // UX Feedback: Blocăm butonul și îi schimbăm textul cât timp așteptăm rețeaua
    submitBtn.textContent = "Se salvează...";
    submitBtn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: taskTitle,
                completed: false,
                userId: 1
            })
        });

        if (response.status === 201) {
            const newTask = await response.json();
            const uniqueId = Date.now()

            // Serverul ne-a dat înapoi ID-ul nou generat (ex: 201). Desenăm task-ul!
            deseneazaTaskInDOM(uniqueId, newTask.title);

            // Curățăm formularul
            inputNode.value = '';
        }
    } catch (error) {
        alert("Eroare la salvarea pe rețea!");
    } finally {
        // Restaurăm butonul la starea inițială, indiferent dacă a fost succes sau eroare
        submitBtn.textContent = "Salvează";
        submitBtn.disabled = true; // Îl lăsăm dezactivat pentru că input-ul e acum gol
    }
});
// 5. EVENIMENTE: Validare "Live" la fiecare apăsare de tastă
inputNode.addEventListener('input', () => {
    // Verificăm dacă există măcar o literă scrisă
    if (inputNode.value.trim().length > 0) {
        submitBtn.disabled = false;
        errorMsg.style.display = 'none';
    } else {
        // Dacă e gol, blocăm butonul și arătăm eroarea
        submitBtn.disabled = true;
        errorMsg.style.display = 'block';
    }
});
// 6. DELETE: Ștergerea unui task pe rețea și din DOM
taskList.addEventListener('click', async (e) => {
    // Verificăm dacă elementul pe care am dat click are clasa 'btn-delete'
    if (e.target.classList.contains('btn-delete')) {
        const deleteBtn = e.target;
        const randTask = deleteBtn.closest('.task-item');

        // Extragem ID-ul task-ului din atributul de testare (ex: "delete-btn-1" -> "1")
        const testId = deleteBtn.getAttribute('data-testid');
        const taskId = testId.split('-')[2];

        // UX (Feedback vizual): Blocăm butonul și arătăm că se procesează
        deleteBtn.textContent = 'Se șterge...';
        deleteBtn.disabled = true;
        randTask.style.opacity = '0.6'; // Facem rândul "fantomă"

        try {
            // Trimitem cererea de ștergere către Server
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Dacă serverul a confirmat ștergerea (HTTP 200/204), distrugem fizic elementul din DOM
                randTask.remove();
            } else {
                throw new Error("Serverul a refuzat ștergerea!");
            }
        } catch (error) {
            // Dacă rețeaua pică, restaurăm elementul la starea inițială!
            alert("Eroare de rețea la ștergere!");
            deleteBtn.textContent = 'Șterge';
            deleteBtn.disabled = false;
            randTask.style.opacity = '1';
        }
    }
    if (e.target.classList.contains('task-title')) {
        // e.target reprezintă exact textul <span> pe care s-a dat click
        // .toggle() adaugă clasa dacă nu există, și o scoate dacă există!
        e.target.classList.toggle('completed');

        console.log("Statusul task-ului a fost modificat vizual.");
    }

});
// 7. BONUS: Modul Chaos - Pop-up aleatoriu care interceptează testele UI!
const initChaosMode = () => {
    // Calculăm un timp aleatoriu de așteptare între 2000ms și 6000ms
    const randomDelay = Math.floor(Math.random() * 4000) + 2000;

    setTimeout(() => {
        // Creăm elementul container (Overlay-ul)
        const modal = document.createElement('div');
        modal.className = 'overlay-modal';
        modal.setAttribute('data-testid', 'promo-overlay');

        // Injectăm cutia promoțională și butonul de închidere
        modal.innerHTML = `
            <div class="promo-box">
                <h3>Ofertă Specială! 🚀</h3>
                <p>Fă upgrade la versiunea Premium pentru a adăuga task-uri nelimitate!</p>
                <button class="btn-close-promo" data-testid="close-promo-btn">Nu, mulțumesc</button>
            </div>
        `;

        // Atașăm evenimentul de închidere
        const closeBtn = modal.querySelector('.btn-close-promo');
        closeBtn.addEventListener('click', () => {
            modal.remove(); // Distrugem modalul când utilizatorul dă click
        });

        // "Aruncăm" modalul fizic în pagină (la finalul tag-ului <body>)
        document.body.appendChild(modal);

        console.warn(`[Chaos Mode] Promo modal a apărut după ${randomDelay}ms!`);
    }, randomDelay);
};

// Pornim modul Chaos!
initChaosMode();

