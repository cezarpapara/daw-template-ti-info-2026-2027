// Selectăm elementele formularului și butoanele generale.
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

// Selectăm elementele pentru vreme.
const selectOras = document.querySelector('#oras');
const titluVreme = document.querySelector('#titlu-vreme');
const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

let cerereActiva = null;

// Schimbăm tema.
btnTema.addEventListener('click', () => {
  document.body.classList.toggle('intunecat');
});

// Actualizăm previzualizarea în timpul tastării.
inputNume.addEventListener('input', () => {
  previzualizare.textContent = inputNume.value || '...';
  eroareNume.textContent = '';
  inputNume.removeAttribute('aria-invalid');
});

// Validăm formularul.
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

// Adăugăm text în lista vremii.
function adaugaRand(text) {
  const li = document.createElement('li');
  li.textContent = text;
  listaVreme.append(li);
}

// Descriem temperatura.
function descrieTemperatura(temperatura) {
  if (temperatura < 10) {
    return 'rece';
  }

  if (temperatura <= 25) {
    return 'plăcut';
  }

  return 'cald';
}

// Anulăm cererea activă și golim rezultatele meteo.
function golesteVremea() {
  if (cerereActiva) {
    cerereActiva.abort();
    cerereActiva = null;
  }

  listaVreme.replaceChildren();
  stare.textContent = '';
  btnVreme.disabled = false;
}

// La schimbarea orașului eliminăm datele orașului anterior.
selectOras.addEventListener('change', () => {
  golesteVremea();

  const numeOras = selectOras.selectedOptions[0].textContent;
  titluVreme.textContent = `Vremea în ${numeOras}`;
});

// Cerem vremea pentru orașul selectat.
async function incarcaVremea() {
  golesteVremea();

  const [latitudine, longitudine] = selectOras.value.split(',');
  const numeOras = selectOras.selectedOptions[0].textContent;

  const urlVreme =
    'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${latitudine}&longitude=${longitudine}`
    + '&current=temperature_2m,wind_speed_10m'
    + '&timezone=auto';

  const controller = new AbortController();
  cerereActiva = controller;

  titluVreme.textContent = `Vremea în ${numeOras}`;
  stare.textContent = 'Se încarcă…';
  btnVreme.disabled = true;

  try {
    const raspuns = await fetch(urlVreme, {
      signal: controller.signal,
      cache: 'no-store'
    });

    if (!raspuns.ok) {
      throw new Error(
        'Serverul a răspuns cu codul ' + raspuns.status
      );
    }

    const date = await raspuns.json();

    // Nu afișăm rezultate pentru o cerere anulată sau înlocuită.
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

    adaugaRand(
      `Ora locală a măsurătorii (${date.timezone}): `
      + acum.time.replace('T', ' ')
    );

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

// Resetăm formularul și vremea, păstrând tema aleasă.
btnReset.addEventListener('click', () => {
  golesteVremea();

  titlu.textContent = 'Laboratorul 03';
  formular.reset();
  previzualizare.textContent = '...';
  eroareNume.textContent = '';
  inputNume.removeAttribute('aria-invalid');

  selectOras.selectedIndex = 0;
  titluVreme.textContent = 'Vremea în Bacău';
});