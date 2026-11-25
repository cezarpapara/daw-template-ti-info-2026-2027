
import { useState } from 'react'

const EMPTY = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

function validate(values) {
  const errors = {}

  if (values.name.trim().length < 3) {
    errors.name = 'Numele trebuie sa aiba cel putin 3 caractere.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Introduceti o adresa valida, de exemplu ion@exemplu.ro.'
  }

  if (values.subject.trim().length < 5) {
    errors.subject = 'Subiectul trebuie sa aiba cel putin 5 caractere.'
  }

  if (values.message.trim().length < 10) {
    errors.message = 'Mesajul trebuie sa aiba cel putin 10 caractere.'
  }

  if (values.message.length > 500) {
    errors.message = 'Mesajul nu poate depasi 500 de caractere.'
  }

  return errors
}

export default function ContactPage() {
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [sent, setSent] = useState(false)

  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0

  function handleChange(event) {
    const { name, value } = event.target

    setValues({ ...values, [name]: value })
    setSent(false)
  }

  function handleBlur(event) {
    setTouched({ ...touched, [event.target.name]: true })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!isValid) return

    console.log('Mesaj de trimis:', values)

    setSent(true)
    setValues(EMPTY)
    setTouched({})
  }

  return (
    <section className="contact-layout">
      <div className="page-heading">
        <h1>Contact</h1>
        <p>Trimite-ne un mesaj! Iti vom raspunde cat mai curand.</p>
      </div>

      <div className="glass-panel contact-panel">
        {sent && (
          <p className="form-success">
            Mesajul a fost trimis. Multumim!
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="name">Nume</label>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Numele tau"
            />
            {touched.name && errors.name && (
              <p className="form-error">{errors.name}</p>
            )}
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
              placeholder="adresa@email.com"
            />
            {touched.email && errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="subject">Subiect</label>
            <input
              id="subject"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Subiectul mesajului"
            />
            {touched.subject && errors.subject && (
              <p className="form-error">{errors.subject}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="message">Mesaj</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              maxLength="500"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Scrie mesajul tau..."
            />

            <small>{values.message.length} / 500</small>

            {touched.message && errors.message && (
              <p className="form-error">{errors.message}</p>
            )}
          </div>

          <button type="submit" disabled={!isValid}>
            Trimite mesaj →
          </button>
        </form>
      </div>
    </section>
  )
}
