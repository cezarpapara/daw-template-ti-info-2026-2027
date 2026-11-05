import { useState } from 'react'

const EMPTY_VALUES = { name: '', email: '', subject: '', message: '' }

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
  } else if (values.message.length > 500) {
    errors.message = 'Mesajul nu poate depasi 500 de caractere.'
  }

  return errors
}

function ContactPage() {
  const [values, setValues] = useState(EMPTY_VALUES)
  const [touched, setTouched] = useState({})
  const [sent, setSent] = useState(false)

  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0

  function handleChange(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setSent(false)
  }

  function handleBlur(event) {
    setTouched((currentTouched) => ({ ...currentTouched, [event.target.name]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!isValid) {
      setTouched({ name: true, email: true, subject: true, message: true })
      return
    }

    console.log('Mesaj de trimis:', values)
    setSent(true)
    setValues(EMPTY_VALUES)
    setTouched({})
  }

  return (
    <section>
      <h1>Contact</h1>
      {sent && (
        <p className="form-success" role="status">
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
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
          />
          {touched.name && errors.name && (
            <p className="form-error" id="name-error">{errors.name}</p>
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
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
          />
          {touched.email && errors.email && (
            <p className="form-error" id="email-error">{errors.email}</p>
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
            aria-invalid={Boolean(touched.subject && errors.subject)}
            aria-describedby={touched.subject && errors.subject ? 'subject-error' : undefined}
          />
          {touched.subject && errors.subject && (
            <p className="form-error" id="subject-error">{errors.subject}</p>
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
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
          />
          <p>{values.message.length} / 500</p>
          {touched.message && errors.message && (
            <p className="form-error" id="message-error">{errors.message}</p>
          )}
        </div>

        <button type="submit" disabled={!isValid}>Trimite</button>
      </form>
    </section>
  )
}

export default ContactPage
