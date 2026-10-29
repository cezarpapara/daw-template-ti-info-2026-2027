// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset'); // Ex. 1
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

// 2. Click: punem sau scoatem clasa „intunecat”
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});

// 3. Tastare: afișăm în timp real ce scrie utilizatorul
inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
});

// 4. Trimitere: validăm înainte de a folosi datele
formular.addEventListener('submit', (event) => {
    event.preventDefault(); // oprim reîncărcarea paginii
    const nume = inputNume.value.trim();

    if (nume.length < 3) {
        eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }

    // Ex. 2: numele nu poate conține cifre
    if (/[0-9]/.test(nume)) {
        eroareNume.textContent = 'Numele nu poate conține cifre.';
        inputNume.focus();
        return;
    }

    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;
    formular.reset();
    previzualizare.textContent = '...';
});

// 5. Vremea de la Open-Meteo
const BAZA_URL = 'https://api.open-meteo.com/v1/forecast';
const btnVreme = document.querySelector('#btn-vreme');
const selectOras = document.querySelector('#oras'); // Ex. 4
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

// Ex. 3: cuvânt descriptiv pentru temperatură
function descriereTemperatura(t) {
    if (t < 10) return 'rece';
    if (t <= 25) return 'plăcut';
    return 'cald';
}

async function incarcaVremea() {
    stare.textContent = 'Se încarcă…';
    listaVreme.innerHTML = '';
    btnVreme.disabled = true;

    // Ex. 4: construim adresa din orașul ales
    const [lat, lon] = selectOras.value.split(',');
    const url = `${BAZA_URL}?latitude=${lat}&longitude=${lon}`
        + '&current=temperature_2m,wind_speed_10m'
        + '&timezone=auto'; // Ex. 5

    try {
        const raspuns = await fetch(url);
        if (!raspuns.ok) {
            throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
        }
        const date = await raspuns.json();
        const acum = date.current;
        const u = date.current_units;
        const oras = selectOras.options[selectOras.selectedIndex].text;

        adaugaRand(`Orașul: ${oras}`);
        adaugaRand(`Temperatura: ${acum.temperature_2m} ${u.temperature_2m} (${descriereTemperatura(acum.temperature_2m)})`);
        adaugaRand(`Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
        adaugaRand(`Ora măsurătorii (ora locală, ${date.timezone}): ${acum.time}`); // Ex. 5
        stare.textContent = '';
    } catch (eroare) {
        console.error(eroare);
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    } finally {
        btnVreme.disabled = false;
    }
}

btnVreme.addEventListener('click', incarcaVremea);

// Ex. 1: Resetează — titlul revine, lista vremii se golește
btnReset.addEventListener('click', () => {
    titlu.textContent = 'Laboratorul 03';
    listaVreme.innerHTML = '';
    stare.textContent = '';
    eroareNume.textContent = '';
    formular.reset();
    previzualizare.textContent = '...';
});