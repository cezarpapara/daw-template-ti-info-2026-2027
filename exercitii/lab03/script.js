// Selectăm elementele din pagină.
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

// Schimbăm tema prin adăugarea sau eliminarea unei clase CSS.
btnTema.addEventListener('click', () => {
  document.body.classList.toggle('intunecat');
});

// Actualizăm previzualizarea în timpul tastării.
inputNume.addEventListener('input', () => {
  previzualizare.textContent = inputNume.value || '...';
  eroareNume.textContent = '';
  inputNume.removeAttribute('aria-invalid');
});

// Validăm numele fără să reîncărcăm pagina.
formular.addEventListener('submit', (event) => {
  event.preventDefault();

  const nume = inputNume.value.trim();

  if (nume.length < 3) {
    eroareNume.textContent =
      'Numele trebuie să aibă cel puțin 3 caractere.';
    inputNume.setAttribute('aria-invalid', 'true');
    inputNume.focus();
    return;
  }

  if (/[0-9]/.test(nume)) {
    eroareNume.textContent = 'Numele nu poate conține cifre.';
    inputNume.setAttribute('aria-invalid', 'true');
    inputNume.focus();
    return;
  }

  eroareNume.textContent = '';
  inputNume.removeAttribute('aria-invalid');
  titlu.textContent = `Bine ai venit, ${nume}!`;

  formular.reset();
  previzualizare.textContent = '...';
});

// Adresa API-ului: temperatura și vântul pentru Bacău.
const URL_VREME =
  'https://api.open-meteo.com/v1/forecast'
  + '?latitude=46.57&longitude=26.91'
  + '&current=temperature_2m,wind_speed_10m';

// Reținem cererea activă pentru a o putea anula la resetare.
let cerereActiva = null;

function adaugaRand(text) {
  const li = document.createElement('li');
  li.textContent = text;
  listaVreme.append(li);
}

function descrieTemperatura(temperatura) {
  if (temperatura < 10) {
    return 'rece';
  }

  if (temperatura <= 25) {
    return 'plăcut';
  }

  return 'cald';
}

async function incarcaVremea() {
  const controller = new AbortController();
  cerereActiva = controller;

  stare.textContent = 'Se încarcă…';
  listaVreme.replaceChildren();
  btnVreme.disabled = true;

  try {
    const raspuns = await fetch(URL_VREME, {
      signal: controller.signal
    });

    if (!raspuns.ok) {
      throw new Error(
        'Serverul a răspuns cu codul ' + raspuns.status
      );
    }

    const date = await raspuns.json();

    // Ignorăm rezultatul dacă între timp s-a apăsat Resetează.
    if (cerereActiva !== controller) {
      return;
    }

    const acum = date.current;
    const unitati = date.current_units;
    const descriere = descrieTemperatura(acum.temperature_2m);

    adaugaRand(
      `Temperatura: ${acum.temperature_2m} `
      + `${unitati.temperature_2m} — ${descriere}`
    );

    adaugaRand(
      `Vântul: ${acum.wind_speed_10m} `
      + `${unitati.wind_speed_10m}`
    );

    adaugaRand(`Ora măsurătorii (GMT): ${acum.time}`);

    stare.textContent = '';
  } catch (eroare) {
    if (
      eroare.name === 'AbortError'
      || cerereActiva !== controller
    ) {
      return;
    }

    console.error(eroare);
    stare.textContent =
      'Nu am putut încărca vremea. Încercați din nou.';
  } finally {
    if (cerereActiva === controller) {
      cerereActiva = null;
      btnVreme.disabled = false;
    }
  }
}

btnVreme.addEventListener('click', incarcaVremea);

// Readucem pagina la starea inițială, păstrând tema aleasă.
btnReset.addEventListener('click', () => {
  if (cerereActiva) {
    cerereActiva.abort();
    cerereActiva = null;
  }

  titlu.textContent = 'Laboratorul 03';
  formular.reset();
  previzualizare.textContent = '...';
  eroareNume.textContent = '';
  inputNume.removeAttribute('aria-invalid');
  listaVreme.replaceChildren();
  stare.textContent = '';
  btnVreme.disabled = false;
});