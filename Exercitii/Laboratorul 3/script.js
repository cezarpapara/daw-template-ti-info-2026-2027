
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');

const btnVreme = document.querySelector('#btn-vreme');
const btnReset = document.querySelector('#btn-reset');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');
const oras = document.querySelector('#oras');

// Schimbarea temei
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('intunecat');
});

// Previzualizarea numelui în timp real
inputNume.addEventListener('input', () => {
    previzualizare.textContent = inputNume.value || '...';
    eroareNume.textContent = '';
});

// Validarea formularului
formular.addEventListener('submit', (event) => {
    event.preventDefault();

    const nume = inputNume.value.trim();

    if (nume.length < 3) {
        eroareNume.textContent =
            'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }

    if (/[0-9]/.test(nume)) {
        eroareNume.textContent =
            'Numele nu poate conține cifre.';
        inputNume.focus();
        return;
    }

    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;

    formular.reset();
    previzualizare.textContent = '...';
});

// Adăugarea unui element în lista vremii
function adaugaRand(text) {
    const li = document.createElement('li');
    li.textContent = text;
    listaVreme.append(li);
}

// Încărcarea vremii de la API
async function incarcaVremea() {
    stare.textContent = 'Se încarcă...';
    listaVreme.innerHTML = '';
    btnVreme.disabled = true;

    try {
        const coordonate = oras.value.split(',');
        const latitudine = coordonate[0];
        const longitudine = coordonate[1];

        const URL_VREME =
            'https://api.open-meteo.com/v1/forecast' +
            `?latitude=${latitudine}` +
            `&longitude=${longitudine}` +
            '&current=temperature_2m,wind_speed_10m' +
            '&timezone=auto';

        const raspuns = await fetch(URL_VREME);

        if (!raspuns.ok) {
            throw new Error(
                'Serverul a răspuns cu codul ' + raspuns.status
            );
        }

        const date = await raspuns.json();

        const acum = date.current;
        const unitati = date.current_units;

        const temperatura = acum.temperature_2m;
        const vant = acum.wind_speed_10m;

        adaugaRand(
            `Temperatura: ${temperatura} ${unitati.temperature_2m}`
        );

        // Clasificarea temperaturii
        let descriereTemperatura;

        if (temperatura < 10) {
            descriereTemperatura = 'Rece';
        } else if (temperatura <= 25) {
            descriereTemperatura = 'Plăcut';
        } else {
            descriereTemperatura = 'Cald';
        }

        adaugaRand(`Condiții: ${descriereTemperatura}`);

        adaugaRand(
            `Vântul: ${vant} ${unitati.wind_speed_10m}`
        );

        adaugaRand(`Ora măsurătorii: ${acum.time}`);

        stare.textContent = 'Datele meteo au fost încărcate cu succes.';

    } catch (eroare) {
        console.error(eroare);

        stare.textContent =
            'Nu am putut încărca vremea. Încercați din nou.';

    } finally {
        btnVreme.disabled = false;
    }
}

// Eveniment pentru butonul meteo
btnVreme.addEventListener('click', incarcaVremea);

// Resetarea titlului și a informațiilor meteo
btnReset.addEventListener('click', () => {
    titlu.textContent = 'Laboratorul 03';
    listaVreme.innerHTML = '';
    stare.textContent = '';
});
