// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset'); // Ex. 1
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');
const selectOras = document.querySelector('#oras'); // Ex. 4

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

// 4. Trimitere: validăm înainte de a folosi datele
formular.addEventListener('submit', (event) => {
    event.preventDefault(); // oprim reîncărcarea paginii
    const nume = inputNume.value.trim();
    
    // Exercițiul 2: Extinderea validării
    if (nume.length < 3) {
        eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }
    
    if (/[0-9]/.test(nume)) {
        eroareNume.textContent = 'Numele nu poate conține cifre.';
        inputNume.focus();
        return;
    }
    
    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;
    formular.reset();
});

// 5. Funcție ajutătoare pentru vreme
function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

// 6. Cererea de date asincronă cu tratarea erorilor
async function incarcaVremea() {
    stare.textContent = 'Se încarcă...';
    listaVreme.innerHTML = '';
    btnVreme.disabled = true;

    // Exercițiul 4: Prelucrăm coordonatele din meniul selectat
    const [lat, lon] = selectOras.value.split(',');
    
    // Exercițiul 5: Adăugăm &timezone=auto la adresa API-ului
    const urlVreme = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&timezone=auto`;

    try {
        const raspuns = await fetch(urlVreme);
        if (!raspuns.ok) {
            throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
        }
        
        const date = await raspuns.json();
        const acum = date.current;
        const u = date.current_units;
        
        // Exercițiul 3: Afișăm un cuvânt descriptiv lângă temperatură
        let tipVreme = "";
        if (acum.temperature_2m < 10) tipVreme = " (rece)";
        else if (acum.temperature_2m > 25) tipVreme = " (cald)";
        else tipVreme = " (plăcut)";

        adaugaRand(`Temperatura: ${acum.temperature_2m}${u.temperature_2m}${tipVreme}`);
        adaugaRand(`Vântul: ${acum.wind_speed_10m}${u.wind_speed_10m}`);
        adaugaRand(`Ora măsurătorii (Locală): ${acum.time}`);
        stare.textContent = '';
    } catch (eroare) {
        console.error(eroare);
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    } finally {
        btnVreme.disabled = false;
    }
}

btnVreme.addEventListener('click', incarcaVremea);