import { useState } from 'react';

const EMPTY = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

function validate(values) {
  const errors = {};

  if (values.name.trim().length < 3) {
    errors.name = 'Numele trebuie să aibă cel puțin 3 caractere.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Introduceți o adresă validă, de exemplu ion@exemplu.ro.';
  }

  if (values.subject.trim().length < 5) {
    errors.subject = 'Subiectul trebuie să aibă cel puțin 5 caractere.';
  }

  if (values.message.trim().length < 10) {
    errors.message = 'Mesajul trebuie să aibă cel puțin 10 caractere.';
  } else if (values.message.length > 500) {
    errors.message = 'Mesajul poate avea cel mult 500 de caractere.';
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

    setValues((previous) => ({
      ...previous,
      [name]: value
    }));

    setSent(false);
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isValid) {
      setTouched({
        name: true,
        email: true,
        subject: true,
        message: true
      });
      return;
    }

    console.log('Mesaj de trimis:', {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim()
    });

    setSent(true);
    setValues(EMPTY);
    setTouched({});
  }

  return (
    <section>
      <h1>Contact</h1>

      <p>
        Formular demonstrativ: datele sunt afișate în consola
        browserului, fără trimiterea unui e-mail.
      </p>

      {sent && (
        <p className="form-success" role="status">
          Formular validat cu succes. Trimiterea a fost simulată.
          Mulțumim!
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="contact-name">Nume</label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={
              touched.name && errors.name ? 'name-error' : undefined
            }
          />

          {touched.name && errors.name && (
            <p id="name-error" className="form-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="contact-email">E-mail</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={
              touched.email && errors.email ? 'email-error' : undefined
            }
          />

          {touched.email && errors.email && (
            <p id="email-error" className="form-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="contact-subject">Subiect</label>
          <input
            id="contact-subject"
            name="subject"
            required
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.subject && errors.subject)}
            aria-describedby={
              touched.subject && errors.subject
                ? 'subject-error'
                : undefined
            }
          />

          {touched.subject && errors.subject && (
            <p id="subject-error" className="form-error">
              {errors.subject}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="contact-message">Mesaj</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={
              touched.message && errors.message
                ? 'message-count message-error'
                : 'message-count'
            }
          />

          <p
            id="message-count"
            className={
              values.message.length > 500
                ? 'form-counter form-error'
                : 'form-counter'
            }
          >
            {values.message.length} / 500 caractere
          </p>

          {touched.message && errors.message && (
            <p id="message-error" className="form-error">
              {errors.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={!isValid}>
          Trimite
        </button>
      </form>
    </section>
  );
}