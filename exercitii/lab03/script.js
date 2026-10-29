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

// 4. Trimitere: validăm înainte de a folosi datele
formular.addEventListener('submit', (event) => {
    event.preventDefault(); // oprim reîncărcarea paginii
    const nume = inputNume.value.trim();
    if (nume.length < 3) {
        eroareNume.textContent = 'Numele trebuie să aibă cel puțin 3 caractere.';
        inputNume.focus();
        return;
    }
    eroareNume.textContent = '';
    titlu.textContent = `Bine ai venit, ${nume}!`;
    formular.reset();
});

