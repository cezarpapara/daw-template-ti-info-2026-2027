
// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

const btnVreme = document.querySelector('#btn-vreme');
const btnReset = document.querySelector('#btn-reset');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

// 2. Click: punem sau scoatem clasa „intunecat”
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});

// 3. Tastare: afișăm în timp real ce scrie utilizatorul
inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
});

// 4. Trimitere: validăm numele
formular.addEventListener('submit', (event) => {
    event.preventDefault();

    const nume = inputNume.value.trim();

    // Verificăm dacă numele este gol
    if (nume.length === 0) {
        eroareNume.textContent = 'Trebuie să introduceți un nume.';
        inputNume.focus();
        return;
    }

    // Verificăm dacă numele conține cifre
    if (/[0-9]/.test(nume)) {
        eroareNume.textContent = 'Numele nu poate conține cifre.';
        inputNume.focus();
        return;
    }

    // Verificăm lungimea numelui
    if (nume.length < 3) {
        eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }

    // Dacă toate condițiile sunt îndeplinite
    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;

    formular.reset();
    previzualizare.textContent = '...';
});

// 5. Adresa API pentru vremea din Bacău
const URL_VREME = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=46.57&longitude=26.91&current=temperature_2m,wind_speed_10m';

// 6. Funcție pentru adăugarea unui rând în listă
function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

// 7. Funcție pentru clasificarea temperaturii
function descriereTemperatura(temperatura) {
    if (temperatura < 10) {
        return 'rece';
    } else if (temperatura <= 25) {
        return 'plăcut';
    } else {
        return 'cald';
    }
}

// 8. Funcția care încarcă informațiile meteorologice
async function incarcaVremea() {
    stare.textContent = 'Se încarcă…';
    listaVreme.innerHTML = '';
    btnVreme.disabled = true;

    try {
        const raspuns = await fetch(URL_VREME);

        if (!raspuns.ok) {
            throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
        }

        const date = await raspuns.json();
        const acum = date.current;
        const u = date.current_units;

        // Determinăm descrierea temperaturii
        const temperatura = acum.temperature_2m;
        const descriere = descriereTemperatura(temperatura);

        // Afișăm temperatura și descrierea ei
        adaugaRand(
            `Temperatura: ${temperatura} ${u.temperature_2m} - ${descriere}`
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
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';

    } finally {
        btnVreme.disabled = false;
    }
}

// 9. Apăsarea butonului Afișează vremea
btnVreme.addEventListener('click', incarcaVremea);

// 10. Butonul Resetează
btnReset.addEventListener('click', () => {
    titlu.textContent = 'Laboratorul 03';

    listaVreme.innerHTML = '';
    stare.textContent = '';

    formular.reset();
    inputNume.value = '';
    previzualizare.textContent = '...';
    eroareNume.textContent = '';
});