// 1. Selectăm elementele o singură dată
const titlu = document.querySelector("#titlu");
const btnTema = document.querySelector("#btn-tema");
const formular = document.querySelector("#formular");
const inputNume = document.querySelector("#nume");
const eroareNume = document.querySelector("#eroare-nume");
const previzualizare = document.querySelector("#previzualizare");
const titluVreme = document.querySelector("#titlu-vreme");
// 2. Click: punem sau scoatem clasa „intunecat”
btnTema.addEventListener("click", () => {
  document.body.classList.toggle("intunecat");
});
// 3. Tastare: afișăm în timp real ce scrie utilizatorul
inputNume.addEventListener("input", () => {
  eroareNume.textContent = "";
  const nume = inputNume.value.trim();
  if (nume.length < 3) {
    eroareNume.textContent = "Numele trebuie să aibă cel puțin 3 caractere.";
    previzualizare.textContent = "...";
  } else if (/[0-9]/.test(nume)) {
    eroareNume.textContent = "Numele nu poate conține cifre.";
    previzualizare.textContent = "...";
  } else {
    previzualizare.textContent = inputNume.value || "...";
  }
});
// 4. Trimitere: validăm înainte de a folosi datele
formular.addEventListener("submit", (event) => {
  event.preventDefault(); // oprim reîncărcarea paginii
  const nume = inputNume.value.trim();
  let mesaj = "";
  if (nume === "") {
    mesaj = "Numele este obligatoriu.";
  } else if (nume.length < 3) {
    mesaj = "Numele trebuie să aibă cel puțin 3 caractere.";
  } else if (/[0-9]/.test(nume)) {
    mesaj = "Numele nu poate conține cifre.";
  }
  if (mesaj) {
    eroareNume.textContent = mesaj;
    inputNume.focus();
    return;
  }
  eroareNume.textContent = "";
  titlu.textContent = `Bine ai venit, ${nume}!`;
  formular.reset();
});

// Alegerea orașului dintr-o listă. Adăugați în HTML lista de mai jos, iar în incarcaVremea construiți adresa din valoarea aleasă (select.value.split(',') dă latitudinea și longitudinea):

const btnVreme = document.querySelector("#btn-vreme");
const stare = document.querySelector("#stare");
const listaVreme = document.querySelector("#vreme");
const select = document.querySelector("#oras");
function adaugaRand(text) {
  const li = document.createElement("li");
  li.textContent = text;
  listaVreme.append(li);
}

function construiesteUrlVreme() {
  const [latitude, longitude] = select.value.split(",");
  return (
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}&longitude=${longitude}` +
    "&current=temperature_2m,wind_speed_10m" +
    "&timezone=auto"
  );
}

//Afișați, lângă temperatură, un cuvânt de tipul „rece” (sub 10 °C), „plăcut” (10–25 °C) sau „cald” (peste 25°C).

async function incarcaVremea() {
  stare.textContent = "Se încarcă…";
  listaVreme.innerHTML = "";
  btnVreme.disabled = true;
  try {
    const raspuns = await fetch(construiesteUrlVreme());
    if (!raspuns.ok) {
      throw new Error("Serverul a răspuns cu codul " + raspuns.status);
    }
    const date = await raspuns.json();
    const acum = date.current;
    let descriere = "";
    if (acum.temperature_2m < 10) {
      descriere = "rece";
    } else if (acum.temperature_2m > 25) {
      descriere = "cald";
    } else {
      descriere = "plăcut";
    }
    const u = date.current_units;
    const orasSelectat = select.options[select.selectedIndex].text;
    titluVreme.textContent = `Vremea în ${orasSelectat}`;
    adaugaRand(
      `Temperatura: ${acum.temperature_2m} ${u.temperature_2m} (${descriere})`,
    );
    adaugaRand(`Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
    adaugaRand(`Ora măsurătorii (ora locala): ${acum.time}`);
    stare.textContent = "";
  } catch (eroare) {
    console.error(eroare);
    stare.textContent = "Nu am putut încărca vremea. Încercați din nou.";
  } finally {
    btnVreme.disabled = false;
  }
}
const btnReset = document.querySelector("#btn-reset");
btnReset.addEventListener("click", () => {
  titlu.textContent = "Laboratorul 03";
  stare.textContent = "";
  listaVreme.innerHTML = "";
  titluVreme.textContent = "Vremea în orasul selectat";
});
btnVreme.addEventListener("click", incarcaVremea);
