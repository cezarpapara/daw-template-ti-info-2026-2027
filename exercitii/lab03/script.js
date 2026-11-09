// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');
const btnReset = document.querySelector('#btn-reset');

const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

// 2. Click: comutare temă întunecată / luminoasă
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});

// 3. Tastare: afișăm în timp real ce scrie utilizatorul
inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
});

// 4. Trimitere formular + Validare extinsă (Exercițiul 2: fără cifre, min 3 caractere)
formular.addEventListener('submit', (event) => {
    event.preventDefault(); // oprim reîncărcarea paginii
    const nume = inputNume.value.trim();

    if (nume.length < 3) {
        eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }

    // Exercițiul 2: Verificăm dacă conține cifre
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

// Exercițiul 1: Butonul Resetează care readuce titlul la forma inițială și golește lista vremii
btnReset.addEventListener('click', () => {
    titlu.textContent = 'Laboratorul 03';
    eroareNume.textContent = '';
    previzualizare.textContent = '...';
    formular.reset();
    listaVreme.innerHTML = '';
    stare.textContent = '';
});

// 5. Partea de Vreme (API Open-Meteo)
const URL_VREME = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=46.57&longitude=26.91&current=temperature_2m,wind_speed_10m';

function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

async function incarcaVremea() {
    stare.textContent = 'Se încarcă...';
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

        const temp = acum.temperature_2m;
        
        // Exercițiul 3: Evaluare textuală a temperaturii (rece, plăcut, cald)
        let evaluareTemp = '';
        if (temp < 10) {
            evaluareTemp = 'rece';
        } else if (temp >= 10 && temp <= 25) {
            evaluareTemp = 'plăcut';
        } else {
            evaluareTemp = 'cald';
        }

        adaugaRand(`Temperatură: ${temp} ${u.temperature_2m} (${evaluareTemp})`);
        adaugaRand(`Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
        adaugaRand(`Ora măsurătorii (GMT): ${acum.time}`);
        
        stare.textContent = '';
    } catch (eroare) {
        console.error(eroare);
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    } finally {
        btnVreme.disabled = false;
    }
}

btnVreme.addEventListener('click', incarcaVremea);