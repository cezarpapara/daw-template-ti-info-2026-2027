// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

const TITLU_INITIAL = 'Laboratorul 03';

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
const URL_API = 'https://api.open-meteo.com/v1/forecast';
const btnVreme = document.querySelector('#btn-vreme');
const selectOras = document.querySelector('#oras');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

function adaugaRand(text) {
  const li = document.createElement('li');
  li.textContent = text;
  listaVreme.append(li);
}

function descriereTemperatura(grade) {
  if (grade < 10) return 'rece';
  if (grade <= 25) return 'plăcut';
  return 'cald';
}

function construiesteUrl() {
  const [lat, lon] = selectOras.value.split(',');
  return `${URL_API}?latitude=${lat}&longitude=${lon}`
    + '&current=temperature_2m,wind_speed_10m&timezone=auto';
}

async function incarcaVremea() {
  stare.textContent = 'Se încarcă…';
  listaVreme.innerHTML = '';
  btnVreme.disabled = true;

  try {
    const raspuns = await fetch(construiesteUrl());
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
    adaugaRand(`Ora măsurătorii (ora locală): ${acum.time.replace('T', ' ')}`);
    stare.textContent = '';
  } catch (eroare) {
    console.error(eroare);
    stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
  } finally {
    btnVreme.disabled = false;
  }
}

btnVreme.addEventListener('click', incarcaVremea);

// 6. Resetare: titlul inițial și lista vremii goală
btnReset.addEventListener('click', () => {
  titlu.textContent = TITLU_INITIAL;
  listaVreme.innerHTML = '';
  stare.textContent = '';
});
