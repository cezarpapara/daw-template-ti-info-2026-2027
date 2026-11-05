import { useState } from 'react'

const EMPTY = { name: '', email: '', subject: '', message: '' }
const MAX_MESSAGE = 500

// Regulile de validare: primeste valorile si intoarce un obiect { camp: mesaj de eroare }.
// Validarea din client doar ajuta utilizatorul; verificarea reala se face pe server.
function validate(values) {
  const errors = {}
  if (values.name.trim().length < 3) {
    errors.name = 'Numele trebuie sa aiba cel putin 3 caractere.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Introduceti o adresa valida, de exemplu ion@exemplu.ro.'
  }
  // Exercitiul 2: subiect obligatoriu, cu mesaj de eroare propriu
  if (values.subject.trim().length < 5) {
    errors.subject = 'Subiectul trebuie sa aiba cel putin 5 caractere.'
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Mesajul trebuie sa aiba cel putin 10 caractere.'
  } else if (values.message.length > MAX_MESSAGE) {
    // Exercitiul 3: limita maxima, afisata si de contorul de sub camp
    errors.message = `Mesajul poate avea cel mult ${MAX_MESSAGE} de caractere.`
  }
  return errors
}

// Pagina de contact: /contact
// Formular controlat: valoarea fiecarui camp vine din stare (value), iar orice tastare
// actualizeaza starea (onChange), deci datele sunt mereu disponibile in JavaScript.
function ContactPage() {
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({}) // campurile pe care utilizatorul le-a parasit
  const [sent, setSent] = useState(false)

  // Erorile nu se pastreaza in stare: se calculeaza la fiecare redesenare din valorile curente
  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0

  // O singura functie pentru toate campurile: atributul name coincide cu cheia din values.
  // { ...values, [name]: value } copiaza obiectul si schimba doar campul tastat:
  // in React, starea nu se modifica direct, ci se inlocuieste.
  function handleChange(event) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
    setSent(false)
  }

  // onBlur = campul a fost parasit: eroarea apare abia acum, nu de la prima litera
  function handleBlur(event) {
    setTouched({ ...touched, [event.target.name]: true })
  }

  function handleSubmit(event) {
    event.preventDefault() // opreste reincarcarea paginii
    if (!isValid) {
      return
    }
    console.log('Mesaj de trimis:', values)
    setSent(true)
    setValues(EMPTY)
    setTouched({})
  }

  return (
    <section>
      <h1>Contact</h1>
      {sent && <p className="form-success">Mesajul a fost trimis. Multumim!</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Nume</label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.name && errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="subject">Subiect</label>
          <input
            id="subject"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.subject && errors.subject && <p className="form-error">{errors.subject}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="message">Mesaj</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <p className="muted form-counter">{values.message.length} / {MAX_MESSAGE}</p>
          {touched.message && errors.message && <p className="form-error">{errors.message}</p>}
        </div>

        {/* butonul ramane dezactivat cat timp un camp nu respecta regulile */}
        <button type="submit" disabled={!isValid}>Trimite</button>
      </form>
    </section>
  )
}

export default ContactPage
