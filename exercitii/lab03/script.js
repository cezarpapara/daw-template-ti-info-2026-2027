
// 1. Selectăm elementele HTML
const butonTema = document.getElementById("tema");
const formular = document.getElementById("formular");
const campNume = document.getElementById("nume");
const previzualizare = document.getElementById("previzualizare");
const eroare = document.getElementById("eroare");
const mesaj = document.getElementById("mesaj");
const butonVreme = document.getElementById("vreme");
const rezultatVreme = document.getElementById("rezultat-vreme");
const titlu = document.getElementById("titlu");
const selectOras = document.getElementById("oras");

// 2. Schimbarea temei
butonTema.addEventListener("click", function () {
    document.body.classList.toggle("tema-inchisa");
});

// 3. Previzualizarea numelui în timp real
campNume.addEventListener("input", function () {
    previzualizare.textContent = campNume.value
        ? "Numele introdus: " + campNume.value
        : "Numele va apărea aici.";
});

// 4. Validarea formularului
formular.addEventListener("submit", function (event) {
    event.preventDefault();

    const nume = campNume.value.trim();

    eroare.textContent = "";
    mesaj.textContent = "";

    if (nume.length < 3) {
        eroare.textContent = "Numele trebuie să aibă cel puțin 3 caractere.";
        return;
    }

    if (/\d/.test(nume)) {
        eroare.textContent = "Numele nu trebuie să conțină cifre!";
        return;
    }

    mesaj.textContent = "Bun venit, " + nume + "!";
});

// 5. Resetarea formularului
formular.addEventListener("reset", function () {
    eroare.textContent = "";
    mesaj.textContent = "";
    previzualizare.textContent = "Numele va apărea aici.";

    // Revenim la titlul inițial
    titlu.textContent = "Laboratorul 03";

    // Ștergem informațiile despre vreme
    rezultatVreme.textContent =
        "Apasă butonul pentru a verifica vremea.";
});

// 6. Preluarea vremii folosind Fetch și API Open-Meteo
butonVreme.addEventListener("click", async function () {

    rezultatVreme.textContent = "Se încarcă datele meteo...";

    try {
        // Preluăm coordonatele orașului selectat
        const coordonate = selectOras.value.split(",");

        const latitudine = coordonate[0];
        const longitudine = coordonate[1];

        // Construim adresa API în funcție de oraș
        const raspuns = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitudine}&longitude=${longitudine}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );

        if (!raspuns.ok) {
            throw new Error("Nu s-au putut prelua datele.");
        }

        const date = await raspuns.json();

        const temperatura = date.current.temperature_2m;
        const umiditate = date.current.relative_humidity_2m;
        const vant = date.current.wind_speed_10m;

        let descriere;

        if (temperatura < 10) {
            descriere = "rece";
        } else if (temperatura <= 25) {
            descriere = "plăcut";
        } else {
            descriere = "cald";
        }

        // Afișăm rezultatele
        rezultatVreme.textContent =
            "Temperatura: " + temperatura + " °C. " +
            "Umiditate: " + umiditate + "%. " +
            "Vânt: " + vant + " km/h. " +
            descriere;

    } catch (eroareFetch) {
        rezultatVreme.textContent =
            "Eroare la preluarea datelor meteo. Încearcă din nou.";

        console.error(eroareFetch);
    }
});
