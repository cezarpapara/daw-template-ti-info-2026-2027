
// 1. Selectăm elementele HTML
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

// 2. Schimbarea temei la apăsarea butonului
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});

// 3. Previzualizarea numelui în timp real
inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
});


// 4. Validarea formularului
formular.addEventListener('submit', (event) => {
    event.preventDefault();

    const nume = inputNume.value.trim();

    if (nume.length < 3) {
        eroareNume.textContent =
            'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }

    if (/[0-9]/.test(nume)) {
        eroareNume.textContent =
            'Numele nu poate conține cifre.';
        inputNume.focus();
        return;
    }

    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;

    formular.reset();
});


// 5. Adresa API-ului meteo pentru Bacău
const URL_VREME = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=46.57&longitude=26.91&current=temperature_2m,wind_speed_10m';

const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

// 6. Funcție care adaugă un element în listă
function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

// 7. Funcția care încarcă vremea
async function incarcaVremea() {
    stare.textContent = 'Se încarcă…';
    listaVreme.innerHTML = '';
    btnVreme.disabled = true;

    try {
        const raspuns = await fetch(URL_VREME);

        if (!raspuns.ok) {
            throw new Error(
                'Serverul a răspuns cu codul ' + raspuns.status
            );
        }

        const date = await raspuns.json();

        const acum = date.current;
        const u = date.current_units;

        let descriere;

if (acum.temperature_2m < 10) {
    descriere = 'rece';
} else if (acum.temperature_2m <= 25) {
    descriere = 'plăcut';
} else {
    descriere = 'cald';
}

adaugaRand(
    `Temperatura: ${acum.temperature_2m} ${u.temperature_2m} - ${descriere}`
);

        adaugaRand(
            `Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`
        );

        adaugaRand(
            `Ora măsurătorii (GMT): ${acum.time}`
        );

        stare.textContent = '';

    } catch (eroare) {
        console.error(eroare);

        stare.textContent =
            'Nu am putut încărca vremea. Încercați din nou.';

    } finally {
        btnVreme.disabled = false;
    }
}

// 8. Apelăm funcția la apăsarea butonului
btnVreme.addEventListener('click', incarcaVremea);

const btnReset = document.querySelector('#btn-reset');

btnReset.addEventListener('click', () => {
    titlu.textContent = 'Laboratorul 03';
    listaVreme.innerHTML = '';
    stare.textContent = '';
});
