// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');
const btnReset = document.querySelector('#reset');
const orasSelect = document.querySelector('#oras');
// 2. Click: punem sau scoatem clasa „intunecat”
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});
// 3. Tastare: afișăm în timp real ce scrie utilizatorul
inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
});
btnReset.addEventListener('click', () => {
    // document.body.classList.remove('intunecat');
    formular.reset();
    previzualizare.textContent = '...';
    titlu.textContent = 'Laboratorul 03';
    eroareNume.textContent = '';
    listaVreme.innerHTML = '';
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
    if (/[0-9]/.test(nume)) {
        eroareNume.textContent = 'Numele nu poate avea cifre.';
        inputNume.focus();
        return;
    }
    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;
    formular.reset();
});

const getVremeUrl = (lat, lon) => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;

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
    const [lat, lon] = orasSelect.value.split(',').map(Number);
    const URL_VREME = getVremeUrl(lat, lon);
    console.log('Cerere către:', lat, lon, URL_VREME);
    try {
        const raspuns = await fetch(URL_VREME);
        if (!raspuns.ok) {
            throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
        }
        const date = await raspuns.json();
        const acum = date.current_weather;
        const u = date.current_weather_units;
        console.log('Date primite:', date);
        const tipTemp = acum.temperature >= 25 ? "cald" : (acum.temperature < 10 ? "rece" : "placut");
        adaugaRand(`Temperatura: ${acum.temperature} ${u.temperature} (${tipTemp})`);
        adaugaRand(`Vântul: ${acum.windspeed} ${u.windspeed}`);
        adaugaRand(`Ora măsurătorii (Local): ${acum.time}`);
        stare.textContent = '';
    } catch (eroare) {
        console.error(eroare);
        stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    } finally {
        btnVreme.disabled = false;
    }
}
btnVreme.addEventListener('click', incarcaVremea);