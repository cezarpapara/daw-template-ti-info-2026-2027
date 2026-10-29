// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

const selectOras = document.querySelector('#oras');
const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

// 2. Click: punem sau scoatem clasa "intunecat"
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});

// Exercițiul 1: Butonul Resetează
btnReset.addEventListener('click', () => {
    titlu.textContent = 'Laboratorul 03';
    listaVreme.innerHTML = '';
    stare.textContent = '';
    formular.reset();
    previzualizare.textContent = '...';
    eroareNume.textContent = '';
});

// 3. Tastare: afișăm în timp real ce scrie utilizatorul
inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
});

// 4. Trimitere formular + Exercițiul 2 (validare fără cifre)
formular.addEventListener('submit', (event) => {
    event.preventDefault(); // oprim reîncărcarea paginii
    const nume = inputNume.value.trim();

    if (nume.length < 3) {
        eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }

    // Exercițiu 2: Verificăm dacă conține cifre
    if (/[0-9]/.test(nume)) {
        eroareNume.textContent = 'Numele nu poate conține cifre.';
        inputNume.focus();
        return;
    }

    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;
    formular.reset();
});

// 5. Funcție ajutătoare pentru adăugarea elementelor în listă
function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

// Funcție asincronă pentru preluarea vremii (cu suport pentru exercițiile 3, 4 și 5)
async function incarcaVremea() {
    // Preluăm coordonatele din valoarea selectată (Exercițiul 4)
    const [lat, lon] = selectOras.value.split(',');
    
    // Exercițiul 5: adăugăm &timezone=auto pentru ora locală
    const URL_VREME = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&timezone=auto`;

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

        let temp = acum.temperature_2m;
        
        // Exercițiul 3: Evaluarea temperaturii (rece, plăcut, cald)
        let evaluare = '';
        if (temp < 10) {
            evaluare = 'rece';
        } else if (temp >= 10 && temp <= 25) {
            evaluare = 'plăcut';
        } else {
            evaluare = 'cald';
        }

        adaugaRand(`Temperatură: ${temp} ${u.temperature_2m} (${evaluare})`);
        adaugaRand(`Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
        
        // Dacă folosim timezone=auto, afișăm ora locală corespunzătoare
        adaugaRand(`Ora măsurătorii: ${acum.time}`);
        stare.textContent = '';
    } catch (eroare) {
        console.error(eroare);
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    } finally {
        btnVreme.disabled = false;
    }
}

btnVreme.addEventListener('click', incarcaVremea);