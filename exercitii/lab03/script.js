// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReseteaza = document.querySelector('#btn-reseteaza');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

const selectOras = document.querySelector('#oras');
const btnVreme = document.querySelector('#btn-vreme');
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

// Exercițiul 1: Butonul Resetează
btnReseteaza.addEventListener('click', () => {
    titlu.textContent = 'Laboratorul 03';
    listaVreme.innerHTML = '';
    stare.textContent = '';
    formular.reset();
    eroareNume.textContent = '';
    previzualizare.textContent = '...';
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

    // Exercițiul 2: Numele nu poate conține cifre
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

// Funcție ajutătoare pentru adăugare rând în listă
function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

// 5. Funcția asincronă care cere datele, le afișează și tratează erorile
async function incarcaVremea() {
    stare.textContent = 'Se încarcă...';
    listaVreme.innerHTML = '';
    btnVreme.disabled = true;

    try {
        // Exercițiul 4: Preluăm latitudinea și longitudinea din valoarea opțiunii alese
        const [lat, lon] = selectOras.value.split(',');

        // Exercițiul 5: Adăugăm &timezone=auto în URL
        const URL_VREME = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&timezone=auto`;

        const raspuns = await fetch(URL_VREME);
        if (!raspuns.ok) {
            throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
        }

        const date = await raspuns.json();
        const acum = date.current;
        const u = date.current_units;
        const temp = acum.temperature_2m;

        // Exercițiul 3: Cuvânt de tipul „rece”, „plăcut” sau „cald”
        let tipTemp = '';
        if (temp < 10) {
            tipTemp = 'rece';
        } else if (temp <= 25) {
            tipTemp = 'plăcut';
        } else {
            tipTemp = 'cald';
        }

        // Afișarea în listă
        adaugaRand(`Temperatura: ${temp} ${u.temperature_2m} (${tipTemp})`);
        adaugaRand(`Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
        
        // Exercițiul 5: Ora măsurătorii (ora locală)
        adaugaRand(`Ora măsurătorii (ora locală): ${acum.time}`);

        stare.textContent = '';
    } catch (eroare) {
        console.error(eroare);
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    } finally {
        btnVreme.disabled = false;
    }
}

btnVreme.addEventListener('click', incarcaVremea);