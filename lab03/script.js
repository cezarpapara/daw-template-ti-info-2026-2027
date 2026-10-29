// 1. Selectăm elementele o singură dată
const titlu = document.querySelector('#titlu');
const btnTema = document.querySelector('#btn-tema');
const btnReset = document.querySelector('#btn-reset');
const formular = document.querySelector('#formular');
const inputNume = document.querySelector('#nume');
const eroareNume = document.querySelector('#eroare-nume');
const previzualizare = document.querySelector('#previzualizare');
// 2. Click: punem sau scoatem clasa „intunecat”
btnTema.addEventListener('click', () => {
 document.body.classList.toggle('intunecat');
});
btnReset.addEventListener('click', () => {
 titlu.textContent = 'Laboratorul 03';
 listaVreme.innerHTML = '';
 stare.textContent = '';
});
// 3. Tastare: afișăm în timp real ce scrie utilizatorul
inputNume.addEventListener('input', () => {
 previzualizare.textContent = inputNume.value || '...';
});// 4. Trimitere: validăm înainte de a folosi datele
formular.addEventListener('submit', (event) => {
 event.preventDefault(); // oprim reîncărcarea paginii
 const nume = inputNume.value.trim();
 if (/[0-9]/.test(nume)) {
 eroareNume.textContent = 'Numele nu poate conține cifre.';
 inputNume.focus();
 return;
 }
 if (nume.length < 3) {
 eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
 inputNume.focus();
 return;
 }
 eroareNume.textContent = '';
 titlu.textContent = `Bine ai venit, ${nume}!`;
 formular.reset();
});
const btnVreme = document.querySelector('#btn-vreme');
const stare = document.querySelector('#stare');
const listaVreme = document.querySelector('#vreme');
const selectOras = document.querySelector('#oras');
const titluVreme = document.querySelector('#titlu-vreme');
selectOras.addEventListener('change', () => {
 titluVreme.textContent = `Vremea în ${selectOras.selectedOptions[0].textContent}`;
});
function adaugaRand(text) {
 const li = document.createElement('li');
 li.textContent = text;
 listaVreme.append(li);
}
async function incarcaVremea() {
 stare.textContent = 'Se încarcă…';
 listaVreme.innerHTML = '';
 btnVreme.disabled = true;
 try {
 const [latitudine, longitudine] = selectOras.value.split(',');
 const urlVreme = 'https://api.open-meteo.com/v1/forecast'
  + `?latitude=${latitudine}&longitude=${longitudine}&current=temperature_2m,wind_speed_10m`;
 const raspuns = await fetch(urlVreme);
 if (!raspuns.ok) {
 throw new Error('Serverul a răspuns cu codul ' + raspuns.status);
 }
 const date = await raspuns.json();
 const acum = date.current;
 const u = date.current_units;
 const temperatura = acum.temperature_2m;
 const descriereTemperatura = temperatura < 10 ? 'rece' : temperatura <= 25 ? 'plăcut' : 'cald';
 adaugaRand(`Temperatura: ${temperatura} ${u.temperature_2m} (${descriereTemperatura})`);
 adaugaRand(`Vântul: ${acum.wind_speed_10m} ${u.wind_speed_10m}`);
 adaugaRand(`Ora măsurătorii (GMT): ${acum.time}`);
 stare.textContent = '';
 } catch (eroare) {
 console.error(eroare);
 stare.textContent = 'Nu am putut încărca vremea. Încercați din nou.';
 } finally {
 btnVreme.disabled = false;
 }
}
btnVreme.addEventListener('click', incarcaVremea)