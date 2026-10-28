const incarcaTaskuriInitiale = async () => {
    const listaTaskuri = document.querySelector('#active-tasks-list');
    const mesajLoading = document.querySelector('#loading-msg');

    if (mesajLoading) {
        mesajLoading.style.display = 'block';
    }

    try {
        const raspuns = await fetch(
            'https://jsonplaceholder.typicode.com/todos?_limit=5'
        );

        if (!raspuns.ok) {
            throw new Error('Eroare de server!');
        }

        const taskuriDeLaServer = await raspuns.json();

        for (let i = 0; i < taskuriDeLaServer.length; i++) {
            const liNou = document.createElement('li');
            liNou.textContent = taskuriDeLaServer[i].title;
            listaTaskuri.appendChild(liNou);
        }

    } catch (eroare) {
        console.error('A apărut o eroare:', eroare);

        listaTaskuri.innerHTML =
            '<li style="color: red; font-weight: bold;">Eroare critică de rețea. Nu am putut încărca datele.</li>';

    } finally {
        if (mesajLoading) {
            mesajLoading.style.display = 'none';
        }
    }
};

incarcaTaskuriInitiale();

