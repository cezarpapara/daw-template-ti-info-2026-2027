// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
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
    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;
    formular.reset();
});

const URL_VREME = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=46.57&longitude=26.91&current=temperature_2m,wind_speed_10m';
const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');
function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

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
        adaugaRand(`Temperatura: ${acum.temperature_2m} ${u.temperature_2m}`);
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