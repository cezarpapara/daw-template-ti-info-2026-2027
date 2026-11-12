import { useState } from 'react';

// Laboratorul 05: formular de contact controlat, cu validare in client.
const MAX_MESSAGE = 500;
const EMPTY = { name: '', email: '', subject: '', message: '' };

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 3) {
    errors.name = 'Numele trebuie să aibă cel puțin 3 caractere.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Introduceți o adresă validă, de exemplu ion@exemplu.ro.';
  }
  // Exercitiul 2: campul Subiect, obligatoriu, minimum 5 caractere
  if (values.subject.trim() === '') {
    errors.subject = 'Subiectul este obligatoriu.';
  } else if (values.subject.trim().length < 5) {
    errors.subject = 'Subiectul trebuie să aibă cel puțin 5 caractere.';
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Mesajul trebuie să aibă cel puțin 10 caractere.';
  } else if (values.message.length > MAX_MESSAGE) {
    // Exercitiul 3: cel mult 500 de caractere
    errors.message = `Mesajul poate avea cel mult ${MAX_MESSAGE} de caractere.`;
  }
  return errors;
}

export default function ContactPage() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    setSent(false);
  }

  function handleBlur(event) {
    setTouched({ ...touched, [event.target.name]: true });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!isValid) return;
    console.log('Mesaj de trimis:', values);
    setSent(true);
    setValues(EMPTY);
    setTouched({});
  }

  return (
    <section>
      <h1>Contact</h1>
      {sent && <p className="form-success">Mesajul a fost trimis. Mulțumim!</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Nume</label>
          <input id="name" name="name" value={values.name}
            onChange={handleChange} onBlur={handleBlur} />
          {touched.name && errors.name && (
            <p className="form-error">{errors.name}</p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email"
            value={values.email}
            onChange={handleChange} onBlur={handleBlur} />
          {touched.email && errors.email && (
            <p className="form-error">{errors.email}</p>
          )}
        </div>
        {/* Exercitiul 2: campul Subiect */}
        <div className="form-field">
          <label htmlFor="subject">Subiect</label>
          <input id="subject" name="subject"
            value={values.subject}
            onChange={handleChange} onBlur={handleBlur} />
          {touched.subject && errors.subject && (
            <p className="form-error">{errors.subject}</p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="message">Mesaj</label>
          <textarea id="message" name="message" rows="5"
            value={values.message}
            onChange={handleChange} onBlur={handleBlur} />
          {/* Exercitiul 3: contorul de caractere */}
          <small className={values.message.length > MAX_MESSAGE ? 'form-error' : 'muted'}>
            {values.message.length} / {MAX_MESSAGE}
          </small>
          {touched.message && errors.message && (
            <p className="form-error">{errors.message}</p>
          )}
        </div>
        <button type="submit" disabled={!isValid}>Trimite</button>
      </form>
    </section>
  );
}
