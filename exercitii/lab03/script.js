// Selectăm elementele o singură dată, după încărcarea HTML-ului.
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');
const confirmare = document.querySelector('#confirmare');
const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

btnTema.addEventListener('click', () => {
  const temaIntunecata = document.body.classList.toggle('intunecat');
  btnTema.setAttribute('aria-pressed', String(temaIntunecata));
});

inputNume.addEventListener('input', () => {
  previzualizare.textContent = inputNume.value || '...';
  eroareNume.textContent = '';
  inputNume.removeAttribute('aria-invalid');
  confirmare.textContent = '';
});

formular.addEventListener('submit', (event) => {
  event.preventDefault();
  const nume = inputNume.value.trim();
  let mesaj = '';

  if (nume.length < 3) {
    mesaj = 'Numele trebuie să aibă cel puțin 3 caractere.';
  } else if (/[0-9]/.test(nume)) {
    mesaj = 'Numele nu poate conține cifre.';
  }

  eroareNume.textContent = mesaj;
  confirmare.textContent = '';
  if (mesaj) {
    inputNume.setAttribute('aria-invalid', 'true');
    inputNume.focus();
    return;
  }

  inputNume.removeAttribute('aria-invalid');
  titlu.textContent = `Bine ai venit, ${nume}!`;
  confirmare.textContent = `Bine ai venit, ${nume}!`;
  formular.reset();
  // reset() nu declanșează evenimentul input; actualizăm și previzualizarea.
  previzualizare.textContent = '...';
});

const URL_VREME = 'https://api.open-meteo.com/v1/forecast'
  + '?latitude=46.57&longitude=26.91&current=temperature_2m,wind_speed_10m';

let controlCerere = null;
let numarCerere = 0;

function adaugaRand(text) {
  const li = document.createElement('li');
  li.textContent = text;
  listaVreme.append(li);
}

function descrieTemperatura(temperatura) {
  if (temperatura < 10) return 'rece';
  if (temperatura <= 25) return 'plăcut';
  return 'cald';
}

async function incarcaVremea() {
  if (controlCerere) return;

  const cerereaCurenta = ++numarCerere;
  const control = new AbortController();
  controlCerere = control;
  // O conexiune blocată nu lasă butonul dezactivat la nesfârșit.
  const limitaAsteptare = setTimeout(() => control.abort(), 15000);

  stare.textContent = 'Se încarcă…';
  stare.classList.remove('eroare');
  listaVreme.replaceChildren();
  btnVreme.disabled = true;
  listaVreme.setAttribute('aria-busy', 'true');

  try {
    const raspuns = await fetch(URL_VREME, { signal: control.signal });
    if (!raspuns.ok) {
      throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
    }
    const date = await raspuns.json();
    const acum = date.current;
    const unitati = date.current_units;

    if (!acum || !unitati || !Number.isFinite(acum.temperature_2m)
      || !Number.isFinite(acum.wind_speed_10m) || typeof acum.time !== 'string'
      || typeof unitati.temperature_2m !== 'string' || typeof unitati.wind_speed_10m !== 'string') {
      throw new Error('Răspunsul API nu conține datele meteo așteptate.');
    }

    // După reset, un răspuns vechi nu trebuie să completeze din nou pagina.
    if (cerereaCurenta !== numarCerere) return;
    adaugaRand(`Temperatura: ${acum.temperature_2m} ${unitati.temperature_2m} — ${descrieTemperatura(acum.temperature_2m)}`);
    adaugaRand(`Vântul: ${acum.wind_speed_10m} ${unitati.wind_speed_10m}`);
    adaugaRand(`Ora măsurătorii (GMT): ${acum.time.replace('T', ' ')}`);
    stare.textContent = 'Datele meteo au fost încărcate.';
  } catch (eroare) {
    if (cerereaCurenta !== numarCerere) return;
    console.error(eroare);
    stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
    stare.classList.add('eroare');
  } finally {
    clearTimeout(limitaAsteptare);
    if (cerereaCurenta === numarCerere) {
      controlCerere = null;
      btnVreme.disabled = false;
      listaVreme.setAttribute('aria-busy', 'false');
    }
  }
}

btnVreme.addEventListener('click', incarcaVremea);

btnReset.addEventListener('click', () => {
  // Invalidăm și oprim cererea înainte să curățăm interfața.
  numarCerere++;
  if (controlCerere) controlCerere.abort();
  controlCerere = null;

  titlu.textContent = 'Laboratorul 03';
  formular.reset();
  inputNume.removeAttribute('aria-invalid');
  eroareNume.textContent = '';
  confirmare.textContent = '';
  previzualizare.textContent = '...';
  listaVreme.replaceChildren();
  listaVreme.setAttribute('aria-busy', 'false');
  stare.textContent = '';
  stare.classList.remove('eroare');
  btnVreme.disabled = false;
});
