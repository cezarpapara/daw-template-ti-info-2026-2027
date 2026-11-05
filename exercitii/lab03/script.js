// 1. Selectam elementele o singura data
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

const TITLU_INITIAL = titlu.textContent; // "Laboratorul 03"

// 2. Click: punem sau scoatem clasa "intunecat"
btnTema.addEventListener('click', () => {
  document.body.classList.toggle('intunecat');
});

// 3. Tastare: afisam in timp real ce scrie utilizatorul
inputNume.addEventListener('input', () => {
  previzualizare.textContent = inputNume.value || '...';
});

// Exercitiul 2: intoarce mesajul pentru prima problema gasita sau '' daca numele este bun
function valideazaNume(nume) {
  if (nume === '') {
    return 'Scrieti numele.';
  }
  if (/[0-9]/.test(nume)) {
    return 'Numele nu poate contine cifre.';
  }
  if (nume.length < 3) {
    return 'Numele trebuie sa aiba cel putin 3 caractere.';
  }
  return '';
}

// 4. Trimitere: validam inainte de a folosi datele
formular.addEventListener('submit', (event) => {
  event.preventDefault(); // oprim reincarcarea paginii
  const nume = inputNume.value.trim();
  const mesaj = valideazaNume(nume);
  if (mesaj !== '') {
    eroareNume.textContent = mesaj;
    inputNume.focus();
    return;
  }
  eroareNume.textContent = '';
  // textContent pune text simplu, nu HTML: ce scrie utilizatorul nu poate injecta etichete
  titlu.textContent = `Bine ai venit, ${nume}!`;
  formular.reset();
  previzualizare.textContent = '...';
});

// ---------------------------------------------------------------------------
// 5. Date de la un API: fetch, async/await, erori
// ---------------------------------------------------------------------------

// Exercitiul 4: adresa se construieste din orasul ales (vezi construiesteUrl)
// Exercitiul 5: timezone=auto -> ora vine in ora locala a orasului, nu in GMT
const URL_API = 'https://api.open-meteo.com/v1/forecast';
const btnVreme = document.querySelector('#btn-vreme');
const selectOras = document.querySelector('#oras');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');

function construiesteUrl() {
  const [latitudine, longitudine] = selectOras.value.split(',');
  return `${URL_API}?latitude=${latitudine}&longitude=${longitudine}`
    + '&current=temperature_2m,wind_speed_10m&timezone=auto';
}

// Exercitiul 3: un cuvant care descrie temperatura
function descrieTemperatura(grade) {
  if (grade < 10) {
    return 'rece';
  }
  if (grade <= 25) {
    return 'placut';
  }
  return 'cald';
}

function adaugaRand(text) {
  const li = document.createElement('li');
  li.textContent = text;
  listaVreme.append(li);
  return li;
}

async function incarcaVremea() {
  stare.textContent = 'Se incarca...';
  listaVreme.innerHTML = '';
  btnVreme.disabled = true;
  try {
    const raspuns = await fetch(construiesteUrl());
    if (!raspuns.ok) {
      throw new Error('Serverul a raspuns cu codul ' + raspuns.status);
    }
    const date = await raspuns.json();
    const acum = date.current;
    const u = date.current_units;
    const oras = selectOras.options[selectOras.selectedIndex].text;

    // cuvantul este un <span> separat, ca sa il putem colora cu CSS
    const descriere = descrieTemperatura(acum.temperature_2m);
    const rand = adaugaRand(`Temperatura in ${oras}: ${acum.temperature_2m} ${u.temperature_2m} - `);
    const span = document.createElement('span');
    span.className = descriere;
    span.textContent = descriere;
    rand.append(span);

    adaugaRand(`Vantul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
    adaugaRand(`Ora masuratorii (ora locala): ${acum.time.replace('T', ' ')}`);
    stare.textContent = '';
  } catch (eroare) {
    console.error(eroare); // detaliile tehnice doar in consola
    stare.textContent = 'Nu am putut incarca vremea. Incercati din nou.';
  } finally {
    btnVreme.disabled = false;
  }
}

btnVreme.addEventListener('click', incarcaVremea);

// Exercitiul 1: readucem pagina la starea initiala
btnReset.addEventListener('click', () => {
  titlu.textContent = TITLU_INITIAL;
  listaVreme.innerHTML = '';
  stare.textContent = '';
});
