// Selectam elementele HTML dupa ID.
//querySelector găsește elementele, addEventListener răspunde la acțiuni, iar textContent schimbă textul. fetch cere vremea; try/catch/finally tratează succesul, erorile și reactivarea butoanelor.
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

// Coordonatele orasului Bacau si datele meteo solicitate.
const URL_VREME = 'https://api.open-meteo.com/v1/forecast'
  + '?latitude=46.57&longitude=26.91'
  + '&current=temperature_2m,wind_speed_10m';

// Schimbam tema prin adaugarea sau eliminarea clasei CSS.
btnTema.addEventListener('click', () => {
  document.body.classList.toggle('intunecat');
});

// Actualizam previzualizarea la fiecare tastare.
inputNume.addEventListener('input', () => {
  previzualizare.textContent = inputNume.value || '...';
  eroareNume.textContent = '';
});

// Verificam numele la trimiterea formularului.
formular.addEventListener('submit', (event) => {
  // Formularul nu mai reincarca pagina.
  event.preventDefault();

  const nume = inputNume.value.trim();

  if (nume.length < 3) {
    eroareNume.textContent = 'Numele trebuie sa aiba minimum 3 caractere.';
    inputNume.focus();
    return;
  }

  if (/[0-9]/.test(nume)) {
    eroareNume.textContent = 'Numele nu poate contine cifre.';
    inputNume.focus();
    return;
  }

  eroareNume.textContent = '';
  titlu.textContent = `Bine ai venit, ${nume}!`;

  formular.reset();
  previzualizare.textContent = '...';
});

// Adaugam un element in lista vremii.
function adaugaRand(text) {
  const element = document.createElement('li');
  element.textContent = text;
  listaVreme.append(element);
}

// Clasificam temperatura conform cerintei.
function descrieTemperatura(temperatura) {
  if (temperatura < 10) {
    return 'rece';
  }

  if (temperatura <= 25) {
    return 'placut';
  }

  return 'cald';
}

// Cerem datele meteo fara reincarcarea paginii.
async function incarcaVremea() {
  stare.textContent = 'Se incarca...';
  listaVreme.replaceChildren();

  // Evitam cererile repetate in timpul incarcarii.
  btnVreme.disabled = true;
  btnReset.disabled = true;

  try {
    const raspuns = await fetch(URL_VREME);

    if (!raspuns.ok) {
      throw new Error('Cod HTTP: ' + raspuns.status);
    }

    const date = await raspuns.json();
    const acum = date.current;
    const unitati = date.current_units;

    const descriere = descrieTemperatura(acum.temperature_2m);

    adaugaRand(
      `Temperatura: ${acum.temperature_2m} `
      + `${unitati.temperature_2m} - ${descriere}`
    );

    adaugaRand(
      `Vantul: ${acum.wind_speed_10m} ${unitati.wind_speed_10m}`
    );

    adaugaRand(`Ora masuratorii (GMT): ${acum.time}`);

    stare.textContent = 'Datele meteo au fost incarcate.';
  } catch (eroare) {
    console.error(eroare);
    stare.textContent = 'Nu am putut incarca vremea. Incearca din nou.';
  } finally {
    // Reactivam butoanele si la succes, si la eroare.
    btnVreme.disabled = false;
    btnReset.disabled = false;
  }
}

btnVreme.addEventListener('click', incarcaVremea);

// Readucem titlul si golim formularul si rezultatele.
btnReset.addEventListener('click', () => {
  titlu.textContent = 'Laboratorul 03';
  formular.reset();
  previzualizare.textContent = '...';
  eroareNume.textContent = '';
  stare.textContent = '';
  listaVreme.replaceChildren();
});