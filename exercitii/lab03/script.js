// ==========================================================================
//  Laboratorul 03 – DOM, evenimente și fetch
// ==========================================================================

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

// Exercițiul 2: validarea extinsă, cu un mesaj diferit pentru fiecare problemă
function valideazaNume(nume) {
  const erori = [];
  if (nume.length < 3) {
    erori.push('Numele trebuie să aibă cel puțin 3 caractere.');
  }
  if (/[0-9]/.test(nume)) {
    erori.push('Numele nu poate conține cifre.');
  }
  return erori;
}

// 4. Trimitere: validăm înainte de a folosi datele
formular.addEventListener('submit', (event) => {
  event.preventDefault(); // oprim reîncărcarea paginii
  const nume = inputNume.value.trim();
  const erori = valideazaNume(nume);
  if (erori.length > 0) {
    eroareNume.textContent = erori.join(' ');
    inputNume.focus();
    return;
  }
  eroareNume.textContent = '';
  titlu.textContent = `Bine ai venit, ${nume}!`;
  formular.reset();
  previzualizare.textContent = '...';
});

// ==========================================================================
//  Date de la un API: fetch, async/await, erori
// ==========================================================================

// Exercițiul 4: adresa se construiește din orașul ales.
// Exercițiul 5: &timezone=auto -> ora vine în ora locală a orașului.
const URL_VREME = 'https://api.open-meteo.com/v1/forecast';

const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');
const selectOras = document.querySelector('#oras');
const numeOras = document.querySelector('#nume-oras');

function adaugaRand(text) {
  const li = document.createElement('li');
  li.textContent = text;
  listaVreme.append(li);
}

// Exercițiul 3: un cuvânt care descrie temperatura
function descrieTemperatura(grade) {
  if (grade < 10) return 'rece';
  if (grade <= 25) return 'plăcut';
  return 'cald';
}

function construiesteAdresa() {
  const [latitudine, longitudine] = selectOras.value.split(',');
  return `${URL_VREME}?latitude=${latitudine}&longitude=${longitudine}`
    + '&current=temperature_2m,wind_speed_10m&timezone=auto';
}

async function incarcaVremea() {
  stare.textContent = 'Se încarcă…';
  listaVreme.innerHTML = '';
  btnVreme.disabled = true;
  try {
    const raspuns = await fetch(construiesteAdresa());
    if (!raspuns.ok) {
      throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
    }
    const date = await raspuns.json();
    const acum = date.current;
    const u = date.current_units;
    const descriere = descrieTemperatura(acum.temperature_2m);
    adaugaRand(`Temperatura: ${acum.temperature_2m} ${u.temperature_2m} (${descriere})`);
    adaugaRand(`Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
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

// Titlul secțiunii urmează orașul ales; lista veche se golește.
selectOras.addEventListener('change', () => {
  numeOras.textContent = selectOras.options[selectOras.selectedIndex].text;
  listaVreme.innerHTML = '';
  stare.textContent = '';
});

// Exercițiul 1: butonul Resetează
const btnReset = document.querySelector('#btn-reset');
btnReset.addEventListener('click', () => {
  titlu.textContent = 'Laboratorul 03';
  listaVreme.innerHTML = '';
  stare.textContent = '';
});
